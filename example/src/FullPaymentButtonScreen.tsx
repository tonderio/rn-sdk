import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  type IBaseProcessPaymentRequest,
  SDKType,
  TonderPayment,
  useTonder,
} from '@tonder.io/rn-sdk';
import { useEffect, useState } from 'react';
import { getSecureToken } from './utils/utils';
import { BusinessConfig } from './business';

export default function FullPaymentButtonScreen() {
  // Do not share your API secret key.
  const apiSecretKey = BusinessConfig.apiSecretKey;
  const paymentData: IBaseProcessPaymentRequest = {
    customer: {
      email: 'test@example.com',
      firstName: 'david',
      lastName: 'her',
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
          name: 'product test',
          amount_total: 399,
          description: 'product desc',
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
  const { create, payment, reset } = useTonder<SDKType.INLINE>();

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    const token = await getSecureTokenFromBackend();
    await createSDK(token);
  };

  const getSecureTokenFromBackend = async () => {
    try {
      // Implement this logic from your backend for greater security, and do not share your API secret key.
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
      customization: {
        paymentButton: {
          show: false,
        },
      },
    });

    if (error) {
      // Manage error
      console.error('Error creating SDK', error);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    const { response, error } = await payment();
    setIsProcessing(false);

    if (
      error ||
      !['Success', 'Authorized'].includes(response?.transaction_status)
    ) {
      Alert.alert('Error', 'Failed to process payment. Please try again.');
      console.error('Error payment: ', error, response?.transaction_status);
      return;
    }
    Alert.alert(
      response?.transaction_status || 'Success',
      'Payment process successfully!'
    );
    console.log('Success payment: ', response);
    // Reset the state and regenerate the SDK to use it again.
    reset();
    await initialize();
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView style={styles.scrollContent}>
        <Text>
          Full Inline Checkout with Custom Button: This example showcases the
          Full Inline Checkout SDK where developers can use a fully customizable
          payment button, enabling a tailored checkout experience while managing
          payment processing and callbacks manually
        </Text>
        <TonderPayment />
        <TouchableOpacity
          style={styles.button}
          disabled={isProcessing}
          onPress={handlePayment}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text>Pagar</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    padding: 12,
  },
  button: {
    width: '100%',
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  scrollContent: {
    flexGrow: 1,
    width: '100%',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#fafafa',
  },
});
