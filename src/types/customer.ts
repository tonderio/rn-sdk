export interface ICustomer {
  email: string;
  firstName?: string;
  lastName?: string;
  country?: string;
  street?: string;
  city?: string;
  state?: string;
  postCode?: string;
  phone?: string;
  address?: string;
}

export interface ICustomerProfile {
  gender?: string;
  date_birth?: string;
  terms: boolean;
  phone: string;
}

export interface ICustomerResponse {
  id: number | string;
  email: string;
  auth_token?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  client_profile?: ICustomerProfile;
}
