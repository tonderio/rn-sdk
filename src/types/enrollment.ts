import type { IBaseCreateOptions, IBaseResponse, SDKOptions } from './base';
import type { IBaseEnrollmentState } from './baseEnrollment';
import { SDKType } from './base';
import type { ISaveCardResponse } from './card';
import type { IFormLabels, IFormPlaceholder, IStyles } from './common';
import type { ICustomer } from './customer';
import TonderError from '../shared/utils/errors';

export interface IEnrollmentOptions extends IBaseCreateOptions {
  customer?: ICustomer;
  customization?: IEnrollmentCustomizationOptions;
  callbacks?: IEnrollmentCallbacks;
}

export interface IEnrollmentCallbacks {
  beforeSave?: () => Promise<void>;
  onFinishSave?: (response: IBaseResponse<ISaveCardResponse>) => Promise<void>;
}

export interface IEnrollmentCustomizationOptions {
  saveButton?: {
    show?: boolean;
    text?: string;
  };
  showMessages?: boolean;
  labels?: IFormLabels;
  placeholders?: IFormPlaceholder;
  styles?: IStyles;
}
export interface IEnrollmentState extends IBaseEnrollmentState {
  customization?: IEnrollmentCustomizationOptions;
  callbacks?: IEnrollmentCallbacks;
  message: string;
}
export interface IEnrollment {
  /**
   * Creates an SDK instance and initializes necessary configurations.
   * @param {SDKOptions<SDKType.ENROLLMENT>} data - Configuration and initialization data for the SDK.
   * @returns {Promise<{ error?: TonderError }>} A promise that resolves to an object containing
   * an error if one occurred during initialization.
   *
   * @public
   */
  create(
    data: SDKOptions<SDKType.ENROLLMENT>
  ): Promise<{ error?: TonderError }>;

  /**
   * Saves a card to a customer's account. This method can be used to add a new card
   * or update an existing one.
   * @returns {Promise<IBaseResponse<ISaveCardResponse>>} A promise that resolves with the saved card data.
   *
   * @public
   */
  saveCustomerCard(): Promise<IBaseResponse<ISaveCardResponse>>;

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
