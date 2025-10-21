import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  type ICardFormEvents,
  type ICardFormStyles,
  type IFormLabels,
  type IFormPlaceholder,
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
  events?: ICardFormEvents;
}

export const NewCardForm: React.FC<NewCardFormProps> = ({
  showSaveOption,
  saveCard,
  onSaveCardChange,
  style,
  labels,
  placeholders,
  events,
}) => {
  return (
    <View style={{ ...styles.container, ...(style?.base || {}) }}>
      <CardHolderInput
        style={style}
        label={labels?.name}
        placeholder={placeholders?.name}
        onBlur={events?.cardHolderEvents?.onBlur}
        onChange={events?.cardHolderEvents?.onChange}
        onFocus={events?.cardHolderEvents?.onFocus}
      />
      <CardNumberInput
        style={style}
        label={labels?.cardNumber}
        placeholder={placeholders?.cardNumber}
        onBlur={events?.cardNumberEvents?.onBlur}
        onChange={events?.cardNumberEvents?.onChange}
        onFocus={events?.cardNumberEvents?.onFocus}
      />
      <View style={styles.expirationRow}>
        <CardExpirationDateInput
          style={style}
          label={labels?.expiryDate}
          yearPlaceholder={placeholders?.expiryYear}
          monthPlaceholder={placeholders?.expiryMonth}
          events={{
            monthEvents: events?.monthEvents,
            yearEvents: events?.yearEvents,
          }}
        />
        <CardCVVInput
          style={style}
          label={labels?.cvv}
          placeholder={placeholders?.cvv}
          onBlur={events?.cvvEvents?.onBlur}
          onChange={events?.cvvEvents?.onChange}
          onFocus={events?.cvvEvents?.onFocus}
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
    minHeight: 250,
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
