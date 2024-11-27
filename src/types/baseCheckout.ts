import type {
  Business,
  IBaseProcessPaymentRequest,
  IBaseResponse,
  IBaseState,
  ICustomerResponse,
  IInlineCallbacks,
  IInlineCustomizationOptions,
  IInternalProcessPaymentRequest,
  ILiteCallbacks,
  ILiteCustomizationOptions,
  IProcessPaymentRequest,
  ITransaction,
} from '.';
import type { IConfig } from 'skyflow-react-native';
import { SDKType } from './base';

export interface IBaseUIState {
  card?: string;
  payment_method?: string;
  saveCard?: boolean;
}
export interface IBaseCheckoutState<T extends SDKType> extends IBaseState<T> {
  paymentData: IBaseProcessPaymentRequest | IProcessPaymentRequest;
  customerData?: ICustomerResponse;
  merchantData?: Business;
  skyflowConfig?: IConfig;
  internalPaymentData?: IInternalProcessPaymentRequest;
  customization?: IInlineCustomizationOptions | ILiteCustomizationOptions;
  callbacks?: IInlineCallbacks | ILiteCallbacks;
  deviceSessionIds?: {
    openPay: string;
    mercadoPago: string;
  };
  returnURL: string;
  uiData: IBaseUIState;
}

export interface IBaseCallback {
  beforePayment?: () => Promise<void>;
  onFinishPayment?: (response: IBaseResponse<ITransaction>) => Promise<void>;
}
