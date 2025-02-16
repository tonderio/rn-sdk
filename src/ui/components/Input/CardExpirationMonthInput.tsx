// @ts-nocheck
import React, { useState } from 'react';
import type { InputProps } from '../../../types';
import { ExpirationMonthElement } from 'skf-rnad';
import {
  getErrorField,
  regexMatchRule,
} from '../../../shared/constants/skyflow';
import {
  DEFAULT_SKYFLOW_lABELS,
  DEFAULT_SKYFLOW_PLACEHOLDERS,
} from '../../../shared/constants/skyflow';
import { Text, View } from 'react-native';
import { DEFAULT_INPUT_CONTAINER_STYLES } from '../../styles/payment';
import {
  DEFAULT_SKYFLOW_ERROR_TEXT_STYLES,
  DEFAULT_SKYFLOW_INPUT_STYLES,
  DEFAULT_SKYFLOW_lABEL_STYLES,
  SKYFLOW_HIDDEN_ERROR_TEXT_STYLES,
} from '../../styles/skyflow';
import useTonderContext from '../../providers/TonderProvider/hook';

export const CardExpirationMonthInput: React.FC<InputProps> = ({
  placeholder = DEFAULT_SKYFLOW_PLACEHOLDERS.expiryMonthPlaceholder,
  label = DEFAULT_SKYFLOW_lABELS.expiryMonthLabel,
  style,
  onFocus,
  onBlur,
  onChange,
}) => {
  const { state } = useTonderContext();
  const [errorText, setErrorText] = useState('');

  return (
    <>
      {state?.skyflowContainer && state?.isCreated && !state?.isCreating && (
        <View
          style={{
            ...DEFAULT_INPUT_CONTAINER_STYLES.base,
            ...(style?.inputStyles?.container
              ? { ...style.inputStyles.container }
              : {}),
          }}
        >
          <ExpirationMonthElement
            container={state.skyflowContainer}
            table="cards"
            column="expiration_month"
            options={{}}
            placeholder={placeholder}
            label={label}
            validations={[regexMatchRule]}
            inputStyles={{
              ...DEFAULT_SKYFLOW_INPUT_STYLES,
              ...(style?.inputStyles
                ? {
                    ...style?.inputStyles,
                    base: {
                      ...DEFAULT_SKYFLOW_INPUT_STYLES.base,
                      ...style?.inputStyles.base,
                    },
                  }
                : {}),
            }}
            errorTextStyles={{
              ...SKYFLOW_HIDDEN_ERROR_TEXT_STYLES,
            }}
            labelStyles={{
              ...DEFAULT_SKYFLOW_lABEL_STYLES,
              ...(style?.labelStyles
                ? {
                    ...style?.labelStyles,
                    base: {
                      ...DEFAULT_SKYFLOW_lABEL_STYLES.base,
                      ...style?.labelStyles.base,
                    },
                  }
                : {}),
            }}
            onChange={(event) => {
              setErrorText('');
              if (onChange) onChange(event);
            }}
            onFocus={(event) => {
              if (onFocus) onFocus(event);
            }}
            onBlur={(event) => {
              setErrorText(getErrorField(event, label));
              if (onBlur) onBlur(event);
            }}
            // onReady={props.onReady}
          />
          {errorText && (
            <Text style={{ ...DEFAULT_SKYFLOW_ERROR_TEXT_STYLES.base }}>
              {errorText}
            </Text>
          )}
        </View>
      )}
    </>
  );
};
