import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import {
  CardCVVInput,
  CardExpirationMonthInput,
  CardExpirationYearInput,
  CardHolderInput,
  CardNumberInput,
  type IProcessPaymentRequest,
  SDKType,
  useTonder,
} from '@tonder.io/rn-sdk';
import { getSecureToken } from './utils/utils';
import { BusinessConfig } from './business';

export default function LitePaymentCustomizationScreen() {
  // Do not share your API secret key.
  const apiSecretKey = BusinessConfig.apiSecretKey;
  const paymentData: IProcessPaymentRequest = {
    customer: {
      email: 'test@example.com',
      firstName: 'David',
      lastName: 'Hernandez',
      country: 'Mexico',
      address: 'Pinos 507, Col El Tecuan',
      city: 'Durango',
      state: 'Durango',
      postCode: '34105',
      phone: '8161234567',
    },
    cart: {
      total: 399,
      items: [
        {
          name: 'Product Test',
          amount_total: 399,
          description: 'Test product description',
          discount: 0,
          price_unit: 399,
          product_reference: '123',
          quantity: 1,
          taxes: 0,
        },
      ],
    },
  };
  const [isProcessing, setIsProcessing] = useState(false);

  const { create, payment, reset } = useTonder<SDKType.LITE>();

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    const token = await getSecureTokenFromBackend();
    await createSDK(token);
  };

  const getSecureTokenFromBackend = async () => {
    // Implement this logic from your backend for greater security, and do not share your API secret key.
    try {
      return await getSecureToken(apiSecretKey);
    } catch (error) {
      //Manage error
      console.error('Error getting token: ', error);
    }
  };

  const createSDK = async (token) => {
    const { error } = await create({
      secureToken: token,
      paymentData: { ...paymentData },
    });
    if (error) {
      console.error('Error creating SDK', error);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const { response, error } = await payment();
      if (error) {
        Alert.alert('Error', 'Failed to process payment. Please try again.');
        console.error(
          'Error processing payment: ',
          error,
          response?.transaction_status
        );
        return;
      }
      // Handle different transaction statuses
      // Customize these messages based on your business logic
      const status = response?.transaction_status;

      handleTransactionStatus(status);

      // Reset the state and regenerate the SDK to use it again.
      reset();
      await initialize();
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle different transaction statuses
  // Customize these messages based on your business logic
  const handleTransactionStatus = (status: string | undefined) => {
    switch (status) {
      case 'Success':
      case 'Authorized':
        Alert.alert(
          'Payment Successful',
          'Your payment has been processed successfully!'
        );

        break;

      case 'Pending':
        Alert.alert(
          'Payment Pending',
          'Your payment is being processed. You will be notified once completed.'
        );
        break;

      case 'Declined':
        Alert.alert(
          'Payment Declined',
          'Your payment was declined. Please try again or use a different payment method.'
        );
        break;

      default:
        Alert.alert(status || 'Unknown Status', 'Error processing payment');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#f8f9fa" barStyle="dark-content" />
      <ScrollView contentContainerStyle={styles.container}>
        <Text>
          Lite Payment Customization Example: Allows developers to create a
          custom interface using Tonder's secure card inputs, with full control
          over input styles, labels, and placeholders for a tailored payment
          experience.
        </Text>
        <View style={styles.card}>
          {/* Card Number */}
          <CardNumberInput
            placeholder="1234 5678 9012 3456"
            style={{
              inputStyles: inputStyles,
              labelStyles: labelStyles,
              errorStyles: errorStyles,
            }}
          />
          {/* Card Holder */}
          <CardHolderInput
            placeholder="Cardholder Name"
            style={{
              inputStyles: inputStyles,
              labelStyles: labelStyles,
              errorStyles: errorStyles,
            }}
          />
          <View style={styles.row}>
            {/* Expiry Date */}
            <CardExpirationMonthInput
              placeholder="MM"
              style={{
                inputStyles: smallInputStyles,
                labelStyles: labelStyles,
                errorStyles: errorStyles,
              }}
            />
            <CardExpirationYearInput
              placeholder="YY"
              style={{
                inputStyles: smallInputStyles,
                labelStyles: labelStyles,
                errorStyles: errorStyles,
              }}
            />
            {/* CVV */}
            <CardCVVInput
              placeholder="CVV"
              style={{
                inputStyles: smallInputStyles,
                labelStyles: labelStyles,
                errorStyles: errorStyles,
              }}
            />
          </View>
        </View>
        <TouchableOpacity
          style={styles.button}
          disabled={isProcessing}
          onPress={handlePayment}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Pay Now</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const inputStyles = {
  base: {
    backgroundColor: 'transparent',
    borderBottomColor: '#cbd5e1', // Gris claro
    borderBottomWidth: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: '#111827', // Texto oscuro
    marginBottom: 15,
  },
  focus: {
    borderBottomColor: '#0ea5e9', // Azul suave
    boxShadow: '0 0 0 4px rgba(14, 165, 233, 0.2)', // Sombra azul
  },
};

const smallInputStyles = {
  base: {
    backgroundColor: 'transparent',
    borderBottomColor: '#cbd5e1',
    borderBottomWidth: 1,
    paddingVertical: 8,
    fontSize: 16,
    color: '#111827',
  },
  container: {
    paddingHorizontal: 2,
  },
  focus: {
    borderBottomColor: '#0ea5e9',
  },
};

const labelStyles = {
  base: {
    fontSize: 14,
    color: '#6b7280', // Gris medio
    marginBottom: 5,
  },
};

const errorStyles = {
  base: {
    color: '#ef4444', // Rojo
    fontSize: 12,
    marginTop: 4,
  },
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb', // Fondo muy claro
  },
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#1f2937', // Gris oscuro
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffff', // Blanco
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#3b82f6', // Azul claro
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
