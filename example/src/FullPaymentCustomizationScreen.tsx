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
  SDKType,
  TonderPayment,
  useTonder,
} from '@tonder.io/rn-sdk';
import { useEffect } from 'react';
import { getSecureToken } from './utils/utils';
import { BusinessConfig } from './business';

export default function FullPaymentCustomizationScreen() {
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
      customization: {
        saveCards: {
          showSaveCardOption: true,
          showSaved: true,
        },
        paymentButton: {
          show: true,
          showAmount: false,
        },
        labels: {
          name: 'Cardholder Name',
          cvv: 'CVV',
          cardNumber: 'Card Number',
          expiryDate: 'Expiration Date',
          saveCardFuturePayment: 'Guardar tarjeta para futuros pagos.',
          saveCardCheckedIcon: '✓',
          expirationCard: 'Exp.',
          payWithCard: 'Pagar con tarjeta',
        },
        placeholders: {
          cvv: '123',
          name: 'John Doe',
          cardNumber: '4242 4242 4242 4242',
          expiryMonth: 'MM',
          expiryYear: 'YY',
        },
        styles: {
          sdkCard: {
            base: {
              backgroundColor: '#f9f9f9',
              borderRadius: 10,
              padding: 16,
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
            },
          },
          cardForm: {
            base: {
              backgroundColor: '#ffffff',
              borderRadius: 10,
              padding: 16,
              borderWidth: 1,
              borderColor: '#e3e3e3',
              marginVertical: 8,
            },
            inputStyles: {
              base: {
                borderWidth: 1,
                borderColor: '#cccccc',
                borderRadius: 6,
                padding: 12,
                fontSize: 16,
                marginBottom: 10,
                color: '#333',
              },
            },
            labelStyles: {
              base: {
                fontSize: 14,
                color: '#666',
                marginBottom: 6,
              },
            },
            saveCardOption: {
              base: {
                marginTop: 15,
                color: '#4a4a4a',
              },
              checkboxBase: {
                borderColor: '#4a4a4a',
              },
              checkboxCheckedBase: {
                backgroundColor: '#35c6c1',
              },
              checkedIcon: {
                color: '#2c2929',
              },
            },
          },
          savedCards: {
            base: {
              backgroundColor: '#f9f9f9',
              borderRadius: 8,
              padding: 10,
              marginVertical: 6,
              borderWidth: 1,
              borderColor: '#e3e3e3',
            },
            cardItem: {
              base: {
                borderBottomColor: '#e2e8f0',
              },
            },
          },
          paymentRadio: {
            base: {
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
              backgroundColor: '#f9f9f9',
              borderRadius: 8,
              borderWidth: 1,
              borderColor: '#e3e3e3',
            },
          },
          paymentButton: {
            base: {
              backgroundColor: '#007AFF',
              paddingVertical: 15,
              paddingHorizontal: 20,
              borderRadius: 8,
              alignItems: 'center',
              fontSize: 18,
              color: '#fff',
              fontWeight: '600',
            },
          },
          paymentMethods: {
            base: {
              paddingVertical: 10,
              backgroundColor: '#f9f9f9',
            },
            radioBase: {
              width: 20,
              height: 20,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: '#007AFF',
              marginHorizontal: 10,
            },
          },
          successMessage: {
            base: {
              color: '#28a745',
              fontWeight: '600',
              fontSize: 16,
              textAlign: 'center',
              marginTop: 20,
            },
          },
          errorMessage: {
            base: {
              color: '#9a0832',
              fontWeight: '600',
              fontSize: 16,
              textAlign: 'center',
              marginTop: 20,
            },
          },
          skeletonCard: {
            base: {
              backgroundColor: '#F9F9F9',
            },
            fullField: {
              base: {
                borderRadius: 8,
              },
            },
            animatedBGColors: ['#e0e0e0', '#c8c7c7'],
          },
        },
      },
      callbacks: {
        onFinishPayment: callbackFinish,
      },
    });

    if (error) {
      // Manage error
      console.error('Error creating SDK', error);
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
      <ScrollView style={styles.scrollContent}>
        <Text>
          Full Inline Checkout with Custom Styles and Configuration:
          Demonstrates the Full Inline Checkout SDK's ability to customize
          visual styles, labels, placeholders, and other configurations for a
          tailored user experience.
        </Text>
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
