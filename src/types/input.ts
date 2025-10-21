import type {
  CollectInputStylesVariant,
  CollectLabelStylesVariant,
} from 'skyflow-react-native';
import type { StylesBaseVariant } from './common';

export interface IEventSecureInput {
  elementType: string;
  isEmpty: boolean;
  isFocused: boolean;
  isValid: boolean;
  value: string;
}
export interface InputExpiryDateProps {
  label?: string;
  yearPlaceholder?: string;
  monthPlaceholder?: string;
  style?: IElementStyle;
  events?: {
    monthEvents?: IInputEvents;
    yearEvents?: IInputEvents;
  };
}

export interface IInputEvents {
  onChange?: (event: IEventSecureInput) => void;
  onFocus?: (event: IEventSecureInput) => void;
  onBlur?: (event: IEventSecureInput) => void;
}

export interface ICardFormEvents {
  cardHolderEvents?: IInputEvents;
  cardNumberEvents?: IInputEvents;
  cvvEvents?: IInputEvents;
  monthEvents?: IInputEvents;
  yearEvents?: IInputEvents;
}

export interface InputProps extends IInputEvents {
  label?: string;
  placeholder?: string;
  style?: IElementStyle;
}

export interface IElementStyle {
  inputStyles?: CollectInputStylesVariant;
  labelStyles?: CollectLabelStylesVariant;
  errorStyles?: StylesBaseVariant;
}
