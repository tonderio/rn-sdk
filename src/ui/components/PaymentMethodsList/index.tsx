import React from 'react';
import { View, StyleSheet, Text, Image, ScrollView } from 'react-native';
import type { IPaymentMethod, StylesSelectVariant } from '../../../types';
import { getPaymentMethodDetails } from '../../../shared/catalog/paymentMethodsCatalog';
import { RadioButton } from '../RadioButton';
import { buildBaseStyleText } from '../../../shared/utils/styleUtils';

interface PaymentMethodsListProps {
  methods: IPaymentMethod[];
  selectedMethod: string;
  onMethodSelect: (methodId: string) => void;
  style?: StylesSelectVariant;
}

const PaymentMethodsList: React.FC<PaymentMethodsListProps> = ({
  methods,
  selectedMethod,
  onMethodSelect,
  style,
}) => {
  if (!methods.length) return null;

  return (
    <ScrollView style={{ ...styles.container, ...(style?.base || {}) }}>
      {methods.map((method) => {
        const details = getPaymentMethodDetails(method.payment_method);
        return (
          <View key={method.id} style={styles.methodItem}>
            <RadioButton
              style={{
                base: style?.radioBase,
                selected: style?.radioSelected,
                inner: style?.radioInner,
              }}
              value={method.payment_method}
              selected={selectedMethod === method.payment_method}
              onSelect={() => onMethodSelect(method.payment_method)}
            />
            <View style={styles.methodIconContainer}>
              <View style={styles.methodIconBorder} />
              <Image
                source={{ uri: details.icon }}
                style={{ ...styles.methodIcon, ...(style?.cardIcon || {}) }}
                resizeMode="contain"
              />
            </View>
            <Text
              style={{
                ...styles.methodName,
                ...buildBaseStyleText(style),
              }}
            >
              {details.label}
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  methodIconContainer: {
    width: 25,
    height: 25,
    marginLeft: 15,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodIcon: {
    width: '100%',
    height: '100%',
  },
  methodIconBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 1,
    borderColor: '#bababa36',
    borderRadius: 4,
  },
  methodName: {
    fontSize: 12,
    color: '#1D1D1D',
    marginLeft: 10,
  },
});

export default PaymentMethodsList;
