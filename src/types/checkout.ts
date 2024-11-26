import type { IBrowserInfo } from './common';
import type { IItem } from './payment';

export interface IStartCheckoutBase {
  name: string;
  last_name: string;
  email_client: string;
  phone_number?: string;
  return_url?: string;
  id_product: string;
  quantity_product: number;
  id_ship: string;
  instance_id_ship: string;
  amount: number;
  title_ship: string;
  description: string;
  device_session_id: string | null;
  token_id: string;
  order_id: string | number;
  business_id: string | number;
  payment_id: string | number;
  source: string;
  browser_info?: IBrowserInfo;
  metadata: any;
  currency: string;
}

export type IStartCheckoutRequest = IStartCheckoutBase &
  (
    | { card: any; payment_method?: any }
    | { card?: any; payment_method: string }
  );

export interface IStartCheckoutIdRequest {
  checkout_id: string;
}

export interface INextAction {
  redirect_to_url?: {
    url: string;
    return_url: string;
    verify_transaction_status_url: string;
  };
  iframe_resources?: {
    iframe: string;
    verify_transaction_status_url: string;
  };
  three_ds_challenge?: string;
}

export interface ICheckoutResponse {
  status: string;
  message: string;
  psp_response: Record<string, any>;
  checkout_id: string;
  is_route_finished: boolean;
  transaction_status: string;
  transaction_id: number;
  payment_id: number;
  provider: string;
  next_action?: INextAction;
  actions: ICheckoutAction[];
}

export interface ICheckoutAction {
  name: string;
  url: string;
  method: string;
}

export interface ICreateOrderResponse {
  id: number | string;
  created: string;
  amount: string;
  status: string;
  payment_method?: string;
  reference?: string;
  is_oneclick: boolean;
  items: IItem[];
  billing_address?: string;
  shipping_address?: string;
  client: {
    email: string;
    name: string;
    first_name: string;
    last_name: string;
    client_profile: {
      gender: string;
      date_birth?: string;
      terms: boolean;
      phone: string;
    };
  };
}

export interface ICreatePaymentResponse {
  pk: number | string;
  order?: string;
  amount: string;
  status: string;
  date: string;
  paid_date?: string;
  shipping_address: {
    street: string;
    number: string;
    suburb: string;
    city: {
      name: string;
    };
    state: {
      name: string;
      country: {
        name: string;
      };
    };
    zip_code: string;
  };
  shipping_address_id?: string;
  billing_address: {
    street: string;
    number: string;
    suburb: string;
    city: {
      name: string;
    };
    state: {
      name: string;
      country: {
        name: string;
      };
    };
    zip_code: string;
  };
  billing_address_id?: string;
  client?: string;
  customer_order_reference?: string;
}

export type ICreatePaymentRequest = {
  business_pk: string | number;
  amount: number;
  date: string;
  order_id: string | number;
  client_id: string | number;
};

export interface ICreateOrderRequest {
  business: string;
  client: string;
  billing_address_id?: number | null;
  shipping_address_id?: number | null;
  amount: number;
  status?: string;
  reference: string | number;
  is_oneclick: boolean;
  items: IItem[];
}
