// @ts-nocheck
import React from 'react';
import type { IElementStyle } from '../../../types';
import {
  DEFAULT_SKYFLOW_lABELS,
  DEFAULT_SKYFLOW_PLACEHOLDERS,
} from '../../../shared/constants/skyflow';
import { StyleSheet, Text, View } from 'react-native';
import type { StyleProp, TextStyle } from 'react-native';
import {
  DEFAULT_SKYFLOW_INPUT_STYLES,
  DEFAULT_SKYFLOW_lABEL_STYLES,
} from '../../styles/skyflow';
import { DEFAULT_INPUT_CONTAINER_STYLES } from '../../styles/payment';
import { CardExpirationMonthInput } from './CardExpirationMonthInput';
import { CardExpirationYearInput } from './CardExpirationYearInput';

export interface InputExpiryDateProps {
  label?: string;
  yearPlaceholder?: string;
  monthPlaceholder?: string;
  style?: IElementStyle;
}
export const CardExpirationDateInput: React.FC<InputExpiryDateProps> = ({
  yearPlaceholder = DEFAULT_SKYFLOW_PLACEHOLDERS.expiryYearPlaceholder,
  monthPlaceholder = DEFAULT_SKYFLOW_PLACEHOLDERS.expiryMonthPlaceholder,
  label = DEFAULT_SKYFLOW_lABELS.expiryDateLabel,
  style,
}) => {
  return (
    <View style={styles.container}>
      <Text
        style={{
          ...(DEFAULT_SKYFLOW_lABEL_STYLES.base as StyleProp<TextStyle>),
          ...((style?.labelStyles?.base || {}) as StyleProp<TextStyle>),
        }}
      >
        {label}
      </Text>
      <View style={styles.row}>
        <CardExpirationMonthInput
          label={''}
          placeholder={monthPlaceholder}
          style={{
            ...({
              ...style,
              inputStyles: {
                ...DEFAULT_SKYFLOW_INPUT_STYLES,
                ...(style?.inputStyles || {}),
                container: {
                  ...DEFAULT_INPUT_CONTAINER_STYLES.base,
                  ...{ marginVertical: 0 },
                  ...(style?.inputStyles?.container || {}),
                },
              },
            } as StyleProp<TextStyle>),
          }}
        />
        <CardExpirationYearInput
          label={''}
          placeholder={yearPlaceholder}
          style={{
            ...({
              ...style,
              inputStyles: {
                ...DEFAULT_SKYFLOW_INPUT_STYLES,
                ...(style?.inputStyles || {}),
                container: {
                  ...DEFAULT_INPUT_CONTAINER_STYLES.base,
                  ...{ marginVertical: 0 },
                  ...(style?.inputStyles?.container || {}),
                },
              },
            } as StyleProp<TextStyle>),
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
