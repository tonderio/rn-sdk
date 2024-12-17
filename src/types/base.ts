import type {
  IEnrollment,
  IEnrollmentOptions,
  IEnrollmentState,
  IInlineCheckoutOptions,
  IInlineCheckoutState,
  ILiteCheckoutOptions,
  ILiteCheckoutState,
  IPaymentInlineContainer,
  IPaymentLiteContainer,
} from '.';
import type TonderError from '../shared/utils/errors';

export enum Environment {
  production = 'production',
  sandbox = 'sandbox',
  stage = 'stage',
  development = 'development',
}

export enum SDKType {
  INLINE = 'inline',
  LITE = 'lite',
  ENROLLMENT = 'enrollment',
}

export type IBaseResponse<T> =
  | { response: T; error?: never }
  | { response?: never; error: TonderError };

export interface ISDKBaseConfig {
  mode: Environment;
  apiKey: string;
  type: SDKType;
  sdkId?: string;
}

export interface IBaseState<T extends SDKType> {
  secureToken: string;
  isCreated: boolean;
  isCreating: boolean;
  isProcessing: boolean;
  error: TonderError | Error | null;
  config: ISDKBaseConfig;
  options: SDKOptions<T>;
  message: string;
}

export interface IBaseCreateOptions {
  secureToken?: string;
}
export type SDKOptionsMap = {
  [SDKType.INLINE]: IInlineCheckoutOptions;
  [SDKType.LITE]: ILiteCheckoutOptions;
  [SDKType.ENROLLMENT]: IEnrollmentOptions;
};

// Helper type to get options type based on SDK type
export type SDKOptions<T extends SDKType> = SDKOptionsMap[T];

// Helper type to get instance type based on SDK type
export type SDKInstance<T extends SDKType> = T extends SDKType.INLINE
  ? IPaymentInlineContainer
  : T extends SDKType.LITE
    ? IPaymentLiteContainer
    : T extends SDKType.ENROLLMENT
      ? IEnrollment
      : never;

export type SDKStateInstance<T extends SDKType> = T extends SDKType.INLINE
  ? IInlineCheckoutState
  : T extends SDKType.LITE
    ? ILiteCheckoutState
    : T extends SDKType.ENROLLMENT
      ? IEnrollmentState
      : never;
