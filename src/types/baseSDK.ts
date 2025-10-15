import type { Business, IBaseState, ICustomerResponse } from '.';
import type { IConfig } from 'skyflow-react-native';
import { SDKType } from './base';

export interface IBaseSDKState<T extends SDKType> extends IBaseState<T> {
  customerData?: ICustomerResponse;
  merchantData?: Business;
  skyflowConfig?: IConfig;
  skyflowContainer?: any;
}
