import type Tonder from '../../core/Tonder';
import TonderError from '../../shared/utils/errors';
import { ErrorKeyEnum } from '../../shared';
import React from 'react';
import type {
  IBaseProcessPaymentRequest,
  IBaseResponse,
  IInlineCustomizationOptions,
  IPaymentInlineContainer,
  IProcessPaymentRequest,
  ITransaction,
  SDKOptions,
} from '../../types';
import BaseCheckout from '../../core/BaseCheckout';
import { SDKType } from '../../types';

class PaymentInlineContainer implements IPaymentInlineContainer {
  #tonderClient: Tonder;
  #baseSDK: BaseCheckout;
  #defaultCustomization: IInlineCustomizationOptions = {
    saveCards: {
      showSaveCardOption: true,
      showSaved: true,
      autoSave: false,
      showDeleteOption: true,
    },
    paymentButton: {
      show: true,
      text: 'Pagar',
      showAmount: true,
    },
    paymentMethods: {
      show: true,
    },
    cardForm: {
      show: true,
    },
    showMessages: true,
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
    data: SDKOptions<SDKType.INLINE>
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
        paymentMethods: {
          ...this.#defaultCustomization.paymentMethods,
          ...(data.customization?.paymentMethods || {}),
        },
        cardForm: {
          ...this.#defaultCustomization.cardForm,
          ...(data.customization?.cardForm || {}),
        },
        paymentButton: {
          ...this.#defaultCustomization.paymentButton,
          ...(data.customization?.paymentButton || {}),
        },
      },
      uiData: {
        card: '',
        payment_method: '',
        saveCard: false,
        selectedMethod: 'new',
        paymentMethods: [],
        cards: [],
      },
      events: data.events || {},
      isCreating: true,
      isCreated: false,
    });
    return await this.#baseSDK.create(data);
  };
  public payment = async (
    data?: IBaseProcessPaymentRequest
  ): Promise<IBaseResponse<ITransaction>> => {
    try {
      if (data) {
        await this.#tonderClient.setState({ paymentData: data });
      }
      const state = this.#tonderClient.getState();
      const payment_data: IProcessPaymentRequest = {
        ...state.paymentData,
        card: state.uiData.card,
        payment_method: state.uiData.payment_method,
      };
      await this.validateProcessPaymentData(payment_data);
      const response = await this.#baseSDK.setupPaymentFlow(payment_data);
      return { response };
    } catch (error) {
      const err = await this.#baseSDK.handlePaymentError(error);
      return { error: err };
    }
  };

  reset = (): void => {
    this.#tonderClient.reset();
  };

  private validateProcessPaymentData(data: IProcessPaymentRequest) {
    if (!data || (data && Object.keys(data).length === 0)) {
      throw new TonderError({
        code: ErrorKeyEnum.INVALID_PAYMENT_REQUEST,
      });
    }
  }
}

export default PaymentInlineContainer;
