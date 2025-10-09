import type {
  ICustomerCardsResponse,
  IPaymentMethod,
  IProcessPaymentRequest,
  ISaveCardResponse,
  ISaveCardsOptionsBase,
  IBaseCreateOptions,
  IBaseCheckoutState,
  ITransaction,
  IBaseCallback,
  IInlineCallbacks,
  IBaseResponse,
  ICardsSummaryResponse,
} from '.';
import { SDKType } from './base';
import TonderError from '../shared/utils/errors';

export interface ILiteCheckoutOptions extends IBaseCreateOptions {
  paymentData: IProcessPaymentRequest;
  customization?: ILiteCustomizationOptions;
  callbacks?: ILiteCallbacks;
  returnURL?: string;
}
export interface ILiteCallbacks extends IBaseCallback {}

export interface ILiteCheckoutState extends IBaseCheckoutState<SDKType.LITE> {
  deviceSessionIds?: {
    openPay: string;
    mercadoPago: string;
  };
  customization?: {
    saveCards?: ISaveCardsOptionsBase;
  };
  callbacks?: IInlineCallbacks;
}

export interface ILiteCustomizationOptions {
  saveCards?: ISaveCardsOptionsBase;
}

export interface IPaymentLiteContainer {
  /**
   * Creates an SDK instance and initializes necessary configurations.
   * @param {ILiteCheckoutOptions} data - Configuration and initialization data for the SDK.
   * @returns {Promise<{ error?: TonderError }>} A promise that resolves to an object containing
   * an error if one occurred during initialization.
   *
   * @public
   */
  create(data: ILiteCheckoutOptions): Promise<{ error?: TonderError }>;

  /**
   * Processes a payment.
   * @param {IProcessPaymentRequest} data - (Optional) Payment data including customer, cart, and other relevant information (Useful in case you need to update payment information).
   * @returns {Promise<IBaseResponse<ITransaction>>} A promise that resolves with the payment response or 3DS redirect or is rejected with an error.
   *
   * @public
   */
  payment(data?: IProcessPaymentRequest): Promise<IBaseResponse<ITransaction>>;

  /**
   * Retrieves the list of cards associated with a customer.
   * @returns {Promise<IBaseResponse<ICustomerCardsResponse>>} A promise that resolves with the customer's card data.
   *
   * @public
   */
  getCustomerCards(): Promise<IBaseResponse<ICustomerCardsResponse>>;

  /**
   * Saves a card to a customer's account. This method can be used to add a new card
   * or update an existing one.
   * @returns {Promise<IBaseResponse<ISaveCardResponse>>} A promise that resolves with the saved card data.
   *
   * @public
   */
  saveCustomerCard(): Promise<IBaseResponse<ISaveCardResponse>>;

  /**
   * Removes a card from a customer's account.
   * @param {string} id - The unique identifier of the card to be deleted.
   * @returns {Promise<IBaseResponse<string>>} A promise that resolves when the card is successfully deleted.
   *
   * @public
   */
  removeCustomerCard(id: string): Promise<IBaseResponse<string>>;

  /**
   * Retrieves the list of available Alternative Payment Methods (APMs).
   * @returns {Promise<IBaseResponse<IPaymentMethod[]>>} A promise that resolves with the list of APMs.
   *
   * @public
   */
  getPaymentMethods(): Promise<IBaseResponse<IPaymentMethod[]>>;

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

  /**
   * Retrieves a summary of the card associated with a customer.
   * @param {string} id - The unique identifier of the card to retrieve the summary for.
   * @returns {Promise<IBaseResponse<ICardsSummaryResponse>>} A promise that resolves with the customer's card summary data.
   *
   * @public
   */
  getCardSummary(id: string): Promise<IBaseResponse<ICardsSummaryResponse>>;
}
