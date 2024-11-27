import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface CheckBoxProps {
  checked: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
}

export const CheckBox: React.FC<CheckBoxProps> = ({
  checked,
  onValueChange,
  label,
}) => (
  <TouchableOpacity
    style={styles.checkboxContainer}
    onPress={() => onValueChange(!checked)}
  >
    <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
      {checked && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text style={styles.checkboxLabel}>{label}</Text>
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
