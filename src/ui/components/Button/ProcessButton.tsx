import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import type { StylesBaseVariant } from '../../../types';
import { buildBaseStyleText } from '../../../shared/utils/styleUtils';

interface PayButtonProps {
  text: string;
  onPress?: () => Promise<void>;
  isLoading?: boolean;
  style?: StylesBaseVariant;
}

export const ProcessButton: React.FC<PayButtonProps> = ({
  text,
  onPress,
  isLoading,
  style,
}) => (
  <TouchableOpacity
    style={{ ...styles.payButton, ...(style?.base || {}) }}
    onPress={onPress}
    disabled={isLoading}
  >
    {isLoading ? (
      <ActivityIndicator color="#fff" size="small" />
    ) : (
      <Text
        style={{
          ...styles.payButtonText,
          ...buildBaseStyleText(style),
        }}
      >
        {text}
      </Text>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  payButton: {
    backgroundColor: '#000',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
