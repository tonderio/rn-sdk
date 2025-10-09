import type Tonder from '../../core/Tonder';
import TonderError from '../../shared/utils/errors';
import { ErrorKeyEnum } from '../../shared';
import React from 'react';
import type {
  IBaseResponse,
  ICardsSummaryResponse,
  ICustomerCardsResponse,
  ILiteCustomizationOptions,
  IPaymentLiteContainer,
  IPaymentMethod,
  IProcessPaymentRequest,
  ISaveCardResponse,
  ITransaction,
  SDKOptions,
} from '../../types';
import BaseCheckout from '../../core/BaseCheckout';
import { SDKType } from '../../types';
import { getPaymentMethodsWithDetails } from '../../shared/utils/paymentMethodUtils';
import { getCardType } from '../../shared/catalog/cardBrandCatalog';
import { defaultTo } from '../../shared/utils/stringUtils';

class PaymentLiteContainer implements IPaymentLiteContainer {
  #tonderClient: Tonder;
  #baseSDK: BaseCheckout;
  #defaultCustomization: ILiteCustomizationOptions = {
    saveCards: {
      autoSave: false,
    },
  };

  constructor(
    tonderClient: Tonder,
    setSkyflowConfig: React.Dispatch<React.SetStateAction<any>>
  ) {
    this.#tonderClient = tonderClient;
    this.#baseSDK = new BaseCheckout(
      tonderClient,
      tonderClient.getState,
      tonderClient.setState,
      setSkyflowConfig
    );
  }

  public create = async (
    data: SDKOptions<SDKType.LITE>
  ): Promise<{ error?: TonderError }> => {
    this.#baseSDK.setState({
      ...data,
      customization: {
        ...this.#defaultCustomization,
        ...(data.customization || {}),
        saveCards: {
          ...this.#defaultCustomization.saveCards,
          ...(data.customization?.saveCards || {}),
        },
      },
      isCreating: true,
      isCreated: false,
    });
    return await this.#baseSDK.create(data);
  };

  public payment = async (
    data?: IProcessPaymentRequest
  ): Promise<IBaseResponse<ITransaction>> => {
    try {
      if (data) {
        await this.#tonderClient.setState({ paymentData: data });
      }
      const state = this.#tonderClient.getState();
      const payment_data: IProcessPaymentRequest = {
        ...state.paymentData,
      };
      await this.validateProcessPaymentData(payment_data);
      const response = await this.#baseSDK.setupPaymentFlow(payment_data);
      return { response };
    } catch (error) {
      const err = await this.#baseSDK.handlePaymentError(error);
      return { error: err };
    }
  };

  public saveCustomerCard = async (): Promise<
    IBaseResponse<ISaveCardResponse>
  > => {
    try {
      await this.#baseSDK.setState({
        isProcessing: true,
      });
      const cardFields = await this.#baseSDK
        .getState()
        .skyflowContainer.collect();
      const card_data = cardFields?.records[0]?.fields;
      const response = await this.#baseSDK.validateAndSaveCard(
        card_data.skyflow_id,
        true
      );
      return { response: response as ISaveCardResponse };
    } catch (error) {
      const err =
        error instanceof TonderError
          ? error
          : new TonderError({
              code: ErrorKeyEnum.SAVE_CARD_PROCESS_ERROR,
              details: error,
            });
      await this.#baseSDK.setState({
        error: error as TonderError,
        isProcessing: false,
      });

      return { error: err };
    }
  };

  public getCustomerCards = async (): Promise<
    IBaseResponse<ICustomerCardsResponse>
  > => {
    try {
      const merchantId = this.#tonderClient.getBusinessPK();
      const secureToken: string = this.#tonderClient.getSecureToken();
      const customer_auth_token: string | undefined =
        this.#tonderClient.getCustomerAuthToken();

      const response = await this.#tonderClient
        .getService()
        .card.fetchCustomerCards(customer_auth_token, secureToken, merchantId);

      return {
        response: {
          ...response,
          cards: response.cards.map((ic) => ({
            ...ic,
            icon: getCardType(ic.fields.card_scheme),
          })),
        },
      };
    } catch (error) {
      return { error: error as TonderError };
    }
  };

  public removeCustomerCard = async (
    id: string
  ): Promise<IBaseResponse<string>> => {
    try {
      const merchantId = this.#tonderClient.getBusinessPK();
      const secureToken: string = this.#tonderClient.getSecureToken();
      const customer_auth_token: string | undefined =
        this.#tonderClient.getCustomerAuthToken();
      const response = await this.#tonderClient
        .getService()
        .card.removeCustomerCard(
          customer_auth_token,
          secureToken,
          id,
          merchantId
        );
      return { response };
    } catch (error) {
      return { error: error as TonderError };
    }
  };

  public getPaymentMethods = async (): Promise<
    IBaseResponse<IPaymentMethod[]>
  > => {
    try {
      const response = await this.#tonderClient
        .getService()
        .paymentMethod.fetchPaymentMethods();

      const pm_results = getPaymentMethodsWithDetails(response);
      return { response: pm_results };
    } catch (error) {
      return { error: error as TonderError };
    }
  };

  reset = (): void => {
    this.#tonderClient.reset();
  };

  public getCardSummary = async (
    id: string
  ): Promise<IBaseResponse<ICardsSummaryResponse>> => {
    try {
      const response = await this.#baseSDK.getCardSummary(id);
      return { response };
    } catch (error) {
      return { error: error as TonderError };
    }
  };

  private validateProcessPaymentData(data: IProcessPaymentRequest) {
    if (!data || (data && Object.keys(data).length === 0)) {
      throw new TonderError({
        code: ErrorKeyEnum.INVALID_PAYMENT_REQUEST,
      });
    }

    let card_data = defaultTo(data.card, '');
    let payment_method_data = defaultTo(data.payment_method, '');

    if (card_data !== '' && payment_method_data !== '') {
      throw new TonderError({
        code: ErrorKeyEnum.INVALID_PAYMENT_REQUEST_CARD_PM,
      });
    }
  }
}

export default PaymentLiteContainer;
