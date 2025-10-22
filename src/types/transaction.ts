export interface ITransaction {
  id: number;
  provider: string;
  country: string;
  currency_code: string;
  transaction_status: string;
  created: string;
  modified: string;
  operation_date: string;
  transaction_reference: string;
  transaction_type: string;
  status: string;
  amount: string;
  related_transaction_reference?: string | null;
  reason?: string | null;
  is_refunded?: boolean | null;
  is_disputed?: boolean | null;
  number_of_payment_attempts: number;
  card_brand?: string | null;
  is_route_finished?: boolean;
  number_of_installments: number;
  payment?: ITransactionPayment;
  checkout: ITransactionCheckout;
  currency: ITransactionCurrency;
  payment_method?: ITransactionPaymentMethod | null;
  issuing_country?: string | null;
  is_apm?: boolean;
  decline?: {
    error_type?: string;
  };
}

interface ITransactionPayment {
  id: number;
  created: string;
  modified: string;
  amount: string;
  status: string;
  date: string;
  paid_date: string | null;
  source: string | null;
  customer_order_reference: string | null;
  client: number;
  business: number;
  shipping_address?: string | null;
  billing_address?: string | null;
  order: number;
}

interface ITransactionCheckout {
  id: string;
  created: string;
  modified: string;
  checkout_data: ITransactionCheckoutData;
  number_of_payment_attempts: number;
  tried_psps: string[];
  rejected_transactions: string[];
  routing_step: number;
  route_length: number;
  last_status: string;
  ip_address: string;
  is_dynamic_routing: boolean;
  is_route_finished: boolean;
  business: number;
  payment: number;
}

interface ITransactionCheckoutData {
  name: string;
  amount: number;
  source: string;
  id_ship: string;
  currency: string;
  order_id: number;
  token_id: string;
  last_name: string;
  id_product: string;
  ip_address: string;
  payment_id: number;
  return_url: string;
  title_ship: string;
  business_id: number;
  checkout_id: string;
  description: string;
  browser_info: any;
  email_client: string;
  phone_number: string;
  instance_id_ship: string;
  quantity_product: number;
  device_session_id: string | null;
  number_of_payment_attempts: number;
}

interface ITransactionCurrency {
  id: number;
  name: string;
  code: string;
  symbol: string;
  country: string | null;
}

interface ITransactionPaymentMethod {
  id: number;
  name: string;
  display_name: string;
  category: string;
  is_apm: boolean;
}
