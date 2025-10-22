import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Alert,
} from 'react-native';
import {
  type IBaseProcessPaymentRequest,
  type IEventSecureInput,
  SDKType,
  TonderPayment,
  useTonder,
} from '@tonder.io/rn-sdk';
import { useEffect } from 'react';
import { getSecureToken } from './utils/utils';
import { BusinessConfig } from './business';

export default function FullPaymentScreen() {
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
  const { create, reset } = useTonder<SDKType.INLINE>();

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
      callbacks: {
        onFinishPayment: callbackFinish,
      },
      events: {
        cardHolderEvents: {
          onBlur: handleOnBlur,
          onChange: handleOnChange,
          onFocus: handleOnFocus,
        },
        cardNumberEvents: {
          onBlur: handleOnBlur,
          onChange: handleOnChange,
          onFocus: handleOnFocus,
        },
        // add more events...
      },
    });

    if (error) {
      // Manage error
      console.error('Error creating SDK', error, error?.details);
    }
  };

  const callbackFinish = async (response) => {
    if (response.error) {
      // Manage error
      Alert.alert('Error', 'Failed to process payment. Please try again.');
      console.log('Error payment: ', response);
      return;
    }
    console.log('Payment response: ', response);

    // Handle transaction status
    handleTransactionStatus(response?.response?.transaction_status);

    // Reset the state and regenerate the SDK to use it again.
    reset();
    await initialize();
  };

  const handleOnChange = (event: IEventSecureInput) => {
    console.log('Received change event: ', event);
  };
  const handleOnBlur = (event: IEventSecureInput) => {
    console.log('Received blur event: ', event);
  };
  const handleOnFocus = (event: IEventSecureInput) => {
    console.log('Received focus event: ', event);
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
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <Text>
        Full Inline Checkout: This example demonstrates how to use the Full
        Inline Checkout SDK to securely process a payment, including customer
        and cart data handling, callbacks for payment completion, and state
        management for the checkout flow.
      </Text>
      <ScrollView style={styles.scrollContent}>
        <TonderPayment />
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
