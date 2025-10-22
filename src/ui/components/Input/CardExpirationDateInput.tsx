// @ts-nocheck
import React from 'react';
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
import type { InputExpiryDateProps } from '../../../types';
import SkyflowContainerWrapper from '../../providers/SkyflowContainerWrapper';
import useTonderContext from '../../providers/TonderProvider/hook';

export const CardExpirationDateInput: React.FC<InputExpiryDateProps> = ({
  yearPlaceholder = DEFAULT_SKYFLOW_PLACEHOLDERS.expiryYearPlaceholder,
  monthPlaceholder = DEFAULT_SKYFLOW_PLACEHOLDERS.expiryMonthPlaceholder,
  label = DEFAULT_SKYFLOW_lABELS.expiryDateLabel,
  style,
  events,
}) => {
  const { state } = useTonderContext();
  return (
    <View style={styles.container}>
      <SkyflowContainerWrapper />
      {state?.skyflowContainer && state?.isCreated && !state?.isCreating && (
        <Text
          style={{
            ...(DEFAULT_SKYFLOW_lABEL_STYLES.base as StyleProp<TextStyle>),
            ...((style?.labelStyles?.base || {}) as StyleProp<TextStyle>),
          }}
        >
          {label}
        </Text>
      )}
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
          onBlur={events?.monthEvents?.onBlur}
          onChange={events?.monthEvents?.onChange}
          onFocus={events?.monthEvents?.onFocus}
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
          onBlur={events?.yearEvents?.onBlur}
          onChange={events?.yearEvents?.onChange}
          onFocus={events?.yearEvents?.onFocus}
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
