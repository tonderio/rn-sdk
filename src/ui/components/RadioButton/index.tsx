// RadioButton.tsx
import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import type { StylesBaseVariant } from '../../../types';

interface RadioButtonProps {
  value: string;
  selected: boolean;
  onSelect: () => void;
  style?: StylesBaseVariant & {
    selected?: Record<string, any>;
    inner?: Record<string, any>;
  };
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  selected,
  onSelect,
  style,
}) => (
  <TouchableOpacity onPress={onSelect}>
    <View
      style={{
        ...styles.radio,
        ...(style?.base || {}),
        ...(selected
          ? { ...styles.radioSelected, ...(style?.selected || {}) }
          : {}),
      }}
    >
      {selected && (
        <View style={{ ...styles.radioInner, ...(style?.inner || {}) }} />
      )}
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bababa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#3bc635',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3bc635',
  },
});
