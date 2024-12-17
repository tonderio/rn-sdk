import React from 'react';
import { View, StyleSheet } from 'react-native';
import type {
  ICardFormStyles,
  IFormLabels,
  IFormPlaceholder,
} from '../../../types';
import { CardHolderInput } from '../Input/CardHolderInput';
import { CardNumberInput } from '../Input/CardNumberInput';
import { CardCVVInput } from '../Input/CardCVVInput';
import { CardExpirationDateInput } from '../Input/CardExpirationDateInput';
import { CheckBox } from '../Checkbox/Checkbox';

interface NewCardFormProps {
  showSaveOption?: boolean;
  saveCard: boolean;
  onSaveCardChange: (save: boolean) => void;
  labels?: IFormLabels;
  placeholders?: IFormPlaceholder;
  style?: ICardFormStyles;
}

export const NewCardForm: React.FC<NewCardFormProps> = ({
  showSaveOption,
  saveCard,
  onSaveCardChange,
  style,
  labels,
  placeholders,
}) => {
  return (
    <View style={{ ...styles.container, ...(style?.base || {}) }}>
      <CardHolderInput
        style={style}
        label={labels?.name}
        placeholder={placeholders?.name}
      />
      <CardNumberInput
        style={style}
        label={labels?.cardNumber}
        placeholder={placeholders?.cardNumber}
      />
      <View style={styles.expirationRow}>
        <CardExpirationDateInput
          style={style}
          label={labels?.expiryDate}
          yearPlaceholder={placeholders?.expiryYear}
          monthPlaceholder={placeholders?.expiryMonth}
        />
        <CardCVVInput
          style={style}
          label={labels?.cvv}
          placeholder={placeholders?.cvv}
        />
      </View>

      {showSaveOption && (
        <CheckBox
          checked={saveCard}
          onValueChange={onSaveCardChange}
          label={
            labels?.saveCardFuturePayment ||
            'Guardar tarjeta para futuros pagos'
          }
          style={style?.saveCardOption}
          checkedIcon={labels?.saveCardCheckedIcon}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingVertical: 10,
  },
  expirationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  groupContainer: {
    flex: 2,
    marginVertical: 5,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  inputContainerCustom: {
    flex: 1,
  },
});
