import type {
  Business,
  IBaseState,
  ICustomer,
  ICustomerResponse,
  IEnrollmentCallbacks,
} from '.';
import type { IConfig } from 'skyflow-react-native';
import { SDKType } from './base';

export interface IBaseEnrollmentState extends IBaseState<SDKType.ENROLLMENT> {
  customer?: ICustomer;
  customerData?: ICustomerResponse;
  merchantData?: Business;
  skyflowConfig?: IConfig;
  callbacks?: IEnrollmentCallbacks;
}
