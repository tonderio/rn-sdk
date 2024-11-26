import type { IUIWrapper } from '../ui/providers/TonderProvider/uiWrapper';
import type { Environment, SDKInstance } from './base';
import type { IElementStyle } from './input';
import { SDKType } from './base';

export interface StylesBaseVariant {
  base?: Record<string, any>;
}

export interface StylesSelectVariant {
  base?: Record<string, any>;
  radioBase?: Record<string, any>;
  radioInner?: Record<string, any>;
  radioSelected?: Record<string, any>;
  cardIcon?: Record<string, any>;
}

export interface StylesSavedCardsVariant extends StylesSelectVariant {
  deleteButton?: Record<string, any>;
  deleteIcon?: Record<string, any>;
}

export interface IApiConfig {
  apiKey: string;
  mode: Environment;
}

export interface IBrowserInfo {
  language: string;
  time_zone: number;
  user_agent: string;
  color_depth: number | null;
  screen_width: number | null;
  screen_height: number | null;
  javascript_enabled: boolean;
}

export interface IFormLabels {
  name?: string;
  cardNumber?: string;
  cvv?: string;
  expiryDate?: string;
}

export interface IFormPlaceholder {
  name?: string;
  cardNumber?: string;
  cvv?: string;
  expiryMonth?: string;
  expiryYear?: string;
}

export interface IStyles {
  sdkCard?: StylesBaseVariant;
  cardForm?: StylesBaseVariant & IElementStyle;
  paymentMethods?: StylesSelectVariant;
  savedCards?: StylesSavedCardsVariant;
  paymentRadio?: StylesSelectVariant;
  paymentButton?: StylesBaseVariant;
  errorMessage?: StylesBaseVariant;
  successMessage?: StylesBaseVariant;
}

export interface ITonderContext<T extends SDKType> {
  uiWrapper: IUIWrapper;
  sdk: SDKInstance<T>;
  state: any;
}
