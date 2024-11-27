import type { ICustomer } from './customer';

export interface IPaymentMethod {
  id: string;
  payment_method: string;
  priority: number;
  category: string;
  icon: string;
  label: string;
}

export interface IPaymentMethodResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ITonderPaymentMethod[];
}

export interface ITonderPaymentMethod {
  pk: string;
  payment_method: string;
  priority: number;
  category: string;
  unavailable_countries: string[];
  status: string;
}

export interface ICardPaymentFields {
  card_number?: string;
  expiration_month?: string;
  expiration_year?: string;
  skyflow_id: string;
  card_scheme?: string;
  cardholder_name?: string;
}

export interface IBaseProcessPaymentRequest {
  customer: ICustomer;
  cart: {
    total: number;
    items: IItem[];
  };
  metadata?: Record<string, any>;
  currency?: string;
}

export interface IProcessPaymentRequest extends IBaseProcessPaymentRequest {
  card?: string;
  payment_method?: string;
}

export interface IInternalProcessPaymentRequest
  extends IBaseProcessPaymentRequest {
  card?: ICardPaymentFields;
  payment_method?: string;
}
export interface IItem {
  description: string;
  quantity: number;
  price_unit: number;
  discount: number;
  taxes: number;
  product_reference: string | number;
  name: string;
  amount_total: number;
}
