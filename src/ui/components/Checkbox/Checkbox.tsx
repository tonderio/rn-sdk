import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import type { StylesCheckboxVariant } from '../../../types';
import { buildBaseStyleText } from '../../../shared/utils/styleUtils';

interface CheckBoxProps {
  checked: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
  checkedIcon?: string;
  style?: StylesCheckboxVariant;
}

export const CheckBox: React.FC<CheckBoxProps> = ({
  checked,
  onValueChange,
  label,
  style,
  checkedIcon = '✓',
}) => (
  <TouchableOpacity
    style={{ ...styles.checkboxContainer, ...(style?.base || {}) }}
    onPress={() => onValueChange(!checked)}
  >
    <View
      style={[
        { ...styles.checkbox, ...(style?.checkboxBase || {}) },
        checked && {
          ...styles.checkboxChecked,
          ...(style?.checkboxCheckedBase || {}),
        },
      ]}
    >
      {checked && (
        <Text style={{ ...styles.checkmark, ...(style?.checkedIcon || {}) }}>
          {checkedIcon}
        </Text>
      )}
    </View>
    <Text
      style={{
        ...styles.checkboxLabel,
        ...buildBaseStyleText(style),
      }}
    >
      {label}
    </Text>
  </TouchableOpacity>
);
const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 0,
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#bababa',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#3bc635',
    borderColor: '#3bc635',
  },
  checkmark: {
    color: '#fff',
    fontSize: 10,
  },
  checkboxLabel: {
    marginLeft: 14,
    fontSize: 12,
    fontWeight: '500',
    color: '#1D1D1D',
  },
});
