import type {
  CollectInputStylesVariant,
  CollectLabelStylesVariant,
} from 'skf-rnad';
import type { StylesBaseVariant } from './common';

export interface InputProps {
  label?: string;
  placeholder?: string;
  style?: IElementStyle;
}

export interface IElementStyle {
  inputStyles?: CollectInputStylesVariant;
  labelStyles?: CollectLabelStylesVariant;
  errorStyles?: StylesBaseVariant;
}
