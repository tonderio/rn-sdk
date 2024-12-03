import React from 'react';
import BaseSDK from '../BaseSDK';
import type {
  ICardPaymentFields,
  ICheckoutResponse,
  ICreateOrderResponse,
  ICreatePaymentResponse,
  IInternalProcessPaymentRequest,
  IProcessPaymentRequest,
  ISaveCardResponse,
  IStartCheckoutRequest,
  IThreeDSHandler,
  ITransaction,
  SDKOptions,
} from '../../types';
import Tonder from '../Tonder';
import { ThreeDSHandler } from '../3DSHandler';
import { SDKType } from '../../types';
import TonderError from '../../shared/utils/errors';
import { ErrorKeyEnum, MESSAGES_ES, TONDER_URL_BY_MODE } from '../../shared';
import { executeCallback, getAppInfo } from '../../shared/utils/common';
import { getPaymentMethodDetails } from '../../shared/catalog/paymentMethodsCatalog';
import { defaultTo, get } from '../../shared/utils/stringUtils';

class BaseCheckout extends BaseSDK {
  #process3ds: IThreeDSHandler;

  constructor(
    tonderClient: Tonder,
    getState: () => Readonly<any>,
    setState: (newState: Partial<any>) => void,
    setSkyflowConfig: React.Dispatch<React.SetStateAction<any>>
  ) {
    super(tonderClient, getState, setState, setSkyflowConfig);
    this.#process3ds = new ThreeDSHandler(
      this.tonderClient.getConfig(),
      this.tonderClient.getService(),
      (eventName: string, data: any) => this.tonderClient.emit(eventName, data),
      (checkoutId) => this.resumeCheckout(checkoutId)
    );
  }

  public create = async (
    data: SDKOptions<SDKType.INLINE | SDKType.LITE>
  ): Promise<{ error?: TonderError }> => {
    try {
      await this.setState({
        returnURL:
          data.returnURL && data.returnURL !== ''
            ? data.returnURL
            : TONDER_URL_BY_MODE[this.tonderClient.getConfig().mode],
      });

      await this.getInitialData();
      await this.initializeProviders();

      if (this.tonderClient.getConfig().type === SDKType.INLINE) {
        await this.getUIData({});
      }

      this.setState({ isCreated: true, isCreating: false });

      return {};
    } catch (error) {
      const err =
        error instanceof TonderError
          ? error
          : new TonderError({
              code: ErrorKeyEnum.CREATE_ERROR,
              details: error,
            });

      await this.setState({
        error: err,
      });

      return { error: err };
    }
  };

  public setupPaymentFlow = async (
    data: IProcessPaymentRequest
  ): Promise<ITransaction> => {
    await this.setState({
      isProcessing: true,
    });
    const callbacks = this.getState().callbacks;

    // Execute user callbacks
    await executeCallback({
      callbacks,
      callback: 'beforePayment',
      throwError: true,
    });

    const payment_data: IInternalProcessPaymentRequest =
      await this.prepareCheckoutData(data);

    await this.setState({
      customer: payment_data.customer,
      internalPaymentData: payment_data,
    });

    await this.getOrRegisterCustomer(
      this.getState().internalPaymentData?.customer
    );

    // Save card based on the configuration or card selector for future payments.
    await this.validateAndSaveCard(
      payment_data.card?.skyflow_id,
      this.getState().customization?.saveCards?.autoSave ||
        this.getState().uiData?.saveCard
    );

    // Refresh customer cards.
    try {
      this.getUIData({ cards: true, paymentMethods: false });
    } catch (e) {}

    // Make init checkout
    const response = await this.handleCheckout({
      card: payment_data.card,
      payment_method: payment_data.payment_method,
    });

    // Execute 3DS flow
    return await this.handle3DSFlow(response);
  };

  private async prepareCheckoutData(
    data: IProcessPaymentRequest
  ): Promise<IInternalProcessPaymentRequest> {
    let card_data = defaultTo(data.card, '');
    let card_tokens = {};
    let payment_method_data = defaultTo(data.payment_method, '');

    if (card_data === '' && payment_method_data === '') {
      const cardFields = await this.getState().skyflowContainer.collect();
      card_tokens = cardFields?.records[0]?.fields;
    }
    if (card_data !== '') {
      card_tokens = {
        skyflow_id: card_data,
      };
    }
    return {
      ...data,
      ...(Object.keys(card_tokens).length > 0
        ? { card: card_tokens }
        : { payment_method: payment_method_data }),
      currency: data.currency || 'mxn',
      metadata: data.metadata || {},
    } as IInternalProcessPaymentRequest;
  }

  public validateAndSaveCard = async (
    cardId?: string,
    saveCard?: boolean
  ): Promise<ISaveCardResponse | void> => {
    if (cardId && saveCard) {
      const { customerToken, secureToken, businessId } = this.getDataForCards();
      const response = await this.tonderClient
        .getService()
        .card.saveCustomerCard(customerToken, secureToken, businessId, {
          skyflow_id: cardId!,
        });
      await this.setState({
        message: MESSAGES_ES.CARD_SAVED_SUCCESSFULLY,
      });

      return response;
    }
  };

  private async handleCheckout({
    card,
    payment_method,
  }: {
    card?: ICardPaymentFields;
    payment_method?: string;
  }): Promise<ICheckoutResponse> {
    try {
      const orderResponse = await this.createOrder();

      const paymentResponse = await this.createPayment(
        orderResponse.id as string
      );

      return await this.startCheckoutRouter(
        orderResponse.id as string,
        paymentResponse.pk as string,
        payment_method,
        card
      );
    } catch (error) {
      throw error;
    }
  }

  private async createOrder(): Promise<ICreateOrderResponse> {
    const state = this.getState();

    const orderItems = {
      business: this.tonderClient.getConfig().apiKey,
      client: state.customerData?.auth_token!,
      billing_address_id: null,
      shipping_address_id: null,
      amount: state.internalPaymentData!.cart.total,
      status: 'A',
      reference: state.merchantData?.reference!,
      is_oneclick: true,
      items: state.internalPaymentData!.cart.items,
    };

    return await this.tonderClient
      .getService()
      .checkout.createOrder(orderItems);
  }

  private async createPayment(
    orderId: string
  ): Promise<ICreatePaymentResponse> {
    const state = this.getState();
    const now = new Date();
    const dateString = now.toISOString();

    const request = {
      business_pk: state.merchantData?.business.pk!,
      client_id: state.customerData?.id!,
      amount: state.internalPaymentData!.cart.total,
      date: dateString,
      order_id: orderId,
    };
    return await this.tonderClient.getService().checkout.createPayment(request);
  }

  private async startCheckoutRouter(
    orderId: string,
    paymentPK: string,
    paymentMethod?: string,
    card?: ICardPaymentFields
  ): Promise<ICheckoutResponse> {
    const state = this.getState();
    const { openpay_keys, business } = state.merchantData;
    let deviceSessionIdTonder: string = '';
    if (openpay_keys.merchant_id && openpay_keys.public_key) {
      deviceSessionIdTonder = await this.tonderClient
        .getService()
        .openPay.getDeviceSessionId(
          openpay_keys.merchant_id,
          openpay_keys.public_key,
          true
        );
    }

    const routerItems = {
      name: state.internalPaymentData?.customer?.firstName || '',
      last_name: state.internalPaymentData?.customer?.lastName || '',
      email_client: state.internalPaymentData?.customer?.email || '',
      phone_number: state.internalPaymentData?.customer?.phone || '',
      return_url: this.getState().returnURL || '',
      id_product: 'no_id',
      quantity_product: 1,
      id_ship: '0',
      instance_id_ship: '0',
      amount: state.internalPaymentData!.cart.total,
      title_ship: 'shipping',
      description: 'transaction',
      device_session_id: deviceSessionIdTonder,
      token_id: '',
      order_id: orderId,
      business_id: business.pk as string,
      payment_id: paymentPK,
      source: 'rn-sdk',
      metadata: state.internalPaymentData!.metadata,
      browser_info: getAppInfo(),
      currency: state.internalPaymentData!.currency,
      ...(paymentMethod ? { payment_method: paymentMethod! } : { card: card! }),
    } as IStartCheckoutRequest;
    return await this.tonderClient
      .getService()
      .checkout.startCheckoutRouter(routerItems);
  }

  private handle3DSFlow(response: ICheckoutResponse) {
    return new Promise<ITransaction>((resolve, reject) => {
      this.#process3ds.handle3DS(
        response,
        this.getState().returnURL,
        async (finalResponse) => {
          try {
            await this.setState({ isProcessing: false });

            if (finalResponse instanceof TonderError) {
              reject(
                new TonderError({
                  code: ErrorKeyEnum.PAYMENT_PROCESS_ERROR,
                  details: finalResponse?.details || finalResponse,
                })
              );
              return;
            }

            executeCallback({
              callbacks: this.getState().callbacks,
              callback: 'onFinishPayment',
              data: { response: finalResponse },
            });
            resolve(finalResponse);
          } catch (error) {
            reject(error);
          }
        }
      );
    });
  }

  public async handlePaymentError(error: any): Promise<TonderError> {
    let err;
    let message = MESSAGES_ES.PAYMENT_PROCESS_ERROR;
    if ((error?.message || '').includes('Incomplete inputs')) {
      err = new TonderError({
        code: ErrorKeyEnum.INVALID_CARD_DATA,
        details: error,
      });
      message = MESSAGES_ES.INVALID_CARD_DATA;
    } else {
      err =
        error instanceof TonderError
          ? error
          : new TonderError({
              code: ErrorKeyEnum.PAYMENT_PROCESS_ERROR,
              details: error,
            });
    }

    await this.setState({
      error: error as TonderError,
      isProcessing: false,
      message: message,
    });

    await executeCallback({
      callbacks: this.getState().callbacks,
      callback: 'onFinishPayment',
      data: { error: err },
    });

    return err;
  }

  private async resumeCheckout(checkoutId: string) {
    return await this.tonderClient.getService().checkout.startCheckoutRouter({
      checkout_id: checkoutId,
    });
  }

  private async getUIData(data: {
    cards?: boolean;
    paymentMethods?: boolean;
  }): Promise<void> {
    const { cards = true, paymentMethods = true } = data;

    const tasks: Promise<any>[] = [];

    if (cards && this.getState().customization?.saveCards?.showSaved) {
      tasks.push(this.getCards());
    }

    if (paymentMethods && this.getState().customization?.paymentMethods?.show) {
      tasks.push(this.getPaymentMethods());
    }

    await Promise.allSettled(tasks);
  }

  private async getCards() {
    try {
      const { customerToken, secureToken, businessId } = this.getDataForCards();

      const response = await this.tonderClient
        .getService()
        .card.fetchCustomerCards(customerToken, secureToken, businessId);

      await this.tonderClient.updateUIState({
        ...(response ? { cards: response.cards || [] } : {}),
      });
      return response.cards;
    } catch (e) {
      console.warn('[BaseCheckout | getCards | ERROR]', e);
      return [];
    }
  }

  private async getPaymentMethods() {
    try {
      const response = await this.tonderClient
        .getService()
        .paymentMethod.fetchPaymentMethods();

      const pym = defaultTo(get(response, 'results'), [])
        .filter((pmItem) => pmItem.category.toLowerCase() !== 'cards')
        .map((pmItem) => {
          return {
            id: pmItem.pk,
            payment_method: pmItem.payment_method,
            priority: pmItem.priority,
            category: pmItem.category,
            ...getPaymentMethodDetails(pmItem.payment_method),
          };
        })
        .sort((a, b) => a.priority - b.priority);

      await this.tonderClient.updateUIState({
        ...(pym ? { paymentMethods: pym } : {}),
      });
      return pym;
    } catch (e) {
      console.warn('[BaseCheckout | getPaymentMethods | ERROR]', e);
      return [];
    }
  }

  private getDataForCards() {
    const secureToken = this.tonderClient.getSecureToken();
    const businessId = this.tonderClient.getBusinessPK();
    const customerToken = this.tonderClient.getCustomerAuthToken();

    return { secureToken, businessId, customerToken };
  }
}

export default BaseCheckout;
