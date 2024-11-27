export interface Business {
  business: {
    pk: number;
    name: string;
    categories: {
      pk: number;
      name: string;
    }[];
    web: string;
    logo: string;
    full_logo_url: string;
    background_color: string;
    primary_color: string;
    checkout_mode: boolean;
    textCheckoutColor: string;
    textDetailsColor: string;
    checkout_logo: string;
  };
  openpay_keys: {
    merchant_id: string;
    public_key: string;
  };
  fintoc_keys: {
    public_key: string;
  };
  mercado_pago: {
    active: boolean;
  };
  vault_id: string;
  vault_url: string;
  reference: string;
  is_installments_available: boolean;
}
export interface GetBusinessResponse extends Business {}
