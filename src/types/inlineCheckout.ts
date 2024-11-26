import type {
  IBaseCheckoutState,
  IBaseCreateOptions,
  ICustomerCardsResponse,
  IPaymentMethod,
  ISaveCardsOptions,
  IFormLabels,
  IFormPlaceholder,
  IStyles,
  ITransaction,
  IBaseProcessPaymentRequest,
  IBaseCallback,
  IBaseResponse,
} from '.';
import { SDKType } from './base';
import TonderError from '../shared/utils/errors';

export interface IInlineCheckoutOptions extends IBaseCreateOptions {
  paymentData: IBaseProcessPaymentRequest;
  customization?: IInlineCustomizationOptions;
  callbacks?: IInlineCallbacks;
  returnURL?: string;
}

export interface IInlineCheckoutState
  extends IBaseCheckoutState<SDKType.INLINE> {
  deviceSessionIds?: {
    openPay: string;
    mercadoPago: string;
  };
  customization?: IInlineCustomizationOptions;
  callbacks?: IInlineCallbacks;
  message: string;
  customerCards: ICustomerCardsResponse;
  payment_methods: IPaymentMethod[];
}

export interface IInlineCustomizationOptions {
  saveCards?: ISaveCardsOptions;
  paymentButton?: {
    show?: boolean;
    text?: string;
    showAmount?: boolean;
  };
  paymentMethods?: {
    show?: boolean;
  };
  cardForm?: {
    show?: boolean;
  };
  showMessages?: boolean;
  labels?: IFormLabels;
  placeholders?: IFormPlaceholder;
  styles?: IStyles;
}
export interface IInlineCallbacks extends IBaseCallback {
  beforeDeleteCard?: () => Promise<void>;
  onFinishDeleteCard?: (response: IBaseResponse<string>) => Promise<void>;
}
export interface IPaymentInlineContainer {
  /**
   * Creates an SDK instance and initializes necessary configurations.
   * @param {IInlineCheckoutOptions} data - Configuration and initialization data for the SDK.
   * @returns {Promise<{ error?: TonderError }>} A promise that resolves to an object containing
   * an error if one occurred during initialization.
   *
   * @public
   */
  create(data: IInlineCheckoutOptions): Promise<{ error?: TonderError }>;

  /**
   * Processes a payment.
   * @param {IBaseProcessPaymentRequest} data - (Optional) Payment data including customer, cart, and other relevant information (Useful in case you need to update payment information).
   * @returns {Promise<IBaseResponse<ITransaction>>} A promise that resolves with the payment response or 3DS redirect or is rejected with an error.
   *
   * @public
   */
  payment(
    data?: IBaseProcessPaymentRequest
  ): Promise<IBaseResponse<ITransaction>>;

  /**
   * Resets the SDK state, clearing all subscribers and event listeners.
   * This method is used to reinitialize the SDK with the current configuration.
   *
   * @remarks
   * This method should be called when you need to completely reset the SDK state.
   * For example, if a user logs out or the configuration needs to be refreshed.
   *
   * @returns {void} Does not return a value.
   *
   * @public
   */
  reset(): void;
}
