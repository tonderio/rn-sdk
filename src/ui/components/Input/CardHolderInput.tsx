// @ts-nocheck
import React, { useState } from 'react';
import type { InputProps } from '../../../types';
import {
  getErrorField,
  lengthMatchRule,
  regexMatchRule,
  DEFAULT_SKYFLOW_lABELS,
  DEFAULT_SKYFLOW_PLACEHOLDERS,
} from '../../../shared/constants/skyflow';
import { Text, View } from 'react-native';
import { CardHolderNameElement } from 'skyflow-react-native';
import {
  DEFAULT_SKYFLOW_ERROR_TEXT_STYLES,
  DEFAULT_SKYFLOW_INPUT_STYLES,
  DEFAULT_SKYFLOW_lABEL_STYLES,
  SKYFLOW_HIDDEN_ERROR_TEXT_STYLES,
} from '../../styles/skyflow';
import { DEFAULT_INPUT_CONTAINER_STYLES } from '../../styles/payment';
import useTonderContext from '../../providers/TonderProvider/hook';

export const CardHolderInput: React.FC<InputProps> = ({
  placeholder = DEFAULT_SKYFLOW_PLACEHOLDERS.namePlaceholder,
  label = DEFAULT_SKYFLOW_lABELS.nameLabel,
  style,
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
          <CardHolderNameElement
            container={state.skyflowContainer}
            table="cards"
            column="cardholder_name"
            validations={[lengthMatchRule, regexMatchRule]}
            placeholder={placeholder}
            label={label}
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
            onChange={() => {
              setErrorText('');
            }}
            // onFocus={props.onFocus}
            onBlur={(e) => {
              setErrorText(getErrorField(e, label));
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
