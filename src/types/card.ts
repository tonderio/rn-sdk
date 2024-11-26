export interface ISaveCardsOptionsBase {
  autoSave?: boolean;
}

export interface ISaveCardsOptions extends ISaveCardsOptionsBase {
  showSaveCardOption?: boolean;
  showSaved?: boolean;
  autoSave?: boolean;
  showDeleteOption?: boolean;
}

export interface ICard {
  fields: ICardSkyflowFields;
  icon?: string;
}

export interface ICardSkyflowFields {
  card_number: string;
  expiration_month: string;
  expiration_year: string;
  skyflow_id: string;
  card_scheme: string;
  cardholder_name: string;
}

export interface ICustomerCardsResponse {
  user_id: number;
  cards: ICard[];
}

export interface ISaveCardResponse {
  skyflow_id: string;
  user_id: number;
}

export interface ISaveCardSkyflowRequest {
  skyflow_id: string;
}
