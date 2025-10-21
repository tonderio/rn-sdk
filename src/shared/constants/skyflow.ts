import { ValidationRuleType } from 'skyflow-react-native';
const lengthMatchRule = {
  type: ValidationRuleType.LENGTH_MATCH_RULE,
  params: {
    max: 70,
  },
};
const regexEmpty = RegExp('^(?!s*$).+');

const regexMatchRule = {
  type: ValidationRuleType.REGEX_MATCH_RULE,
  params: {
    regex: regexEmpty,
    error: 'El campo es requerido', // Optional, default error is 'VALIDATION FAILED'.
  },
};

const getErrorField = (
  event: {
    elementType?: string;
    isEmpty?: boolean;
    isFocused?: boolean;
    isValid?: boolean;
    value?: string;
  },
  field: string
) => {
  if (event.isEmpty) {
    return 'El campo es requerido';
  } else if (!event.isValid && !event.isEmpty) {
    return `El campo ${field} es inválido`;
  } else {
    return '';
  }
};

const DEFAULT_SKYFLOW_lABELS = {
  nameLabel: 'Titular de la tarjeta',
  cardLabel: 'Número de tarjeta',
  cvvLabel: 'CVC/CVV',
  expiryMonthLabel: 'Mes',
  expiryYearLabel: 'Año',
  expiryDateLabel: 'Fecha de expiración',
};

const DEFAULT_SKYFLOW_PLACEHOLDERS = {
  namePlaceholder: 'Nombre como aparece en la tarjeta',
  cardPlaceholder: '1234 1234 1234 1234',
  cvvPlaceholder: '3-4 dígitos',
  expiryMonthPlaceholder: 'MM',
  expiryYearPlaceholder: 'AA',
};

export {
  lengthMatchRule,
  regexMatchRule,
  getErrorField,
  DEFAULT_SKYFLOW_lABELS,
  DEFAULT_SKYFLOW_PLACEHOLDERS,
};
