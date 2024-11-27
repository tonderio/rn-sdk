import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Alert,
} from 'react-native';
import {
  ICustomer,
  SDKType,
  TonderEnrollment,
  useTonder,
} from '@tonder.io/rn-sdk';
import { useEffect } from 'react';
import { getSecureToken } from './utils/utils';
import { BusinessConfig } from './business';

export default function FullEnrollmentCustomizationScreen() {
  // Do not share your API secret key.
  const apiSecretKey = BusinessConfig.apiSecretKey;
  const customerData: ICustomer = {
    email: 'test@example.com',
    firstName: 'david',
    lastName: 'her',
  };
  const { create, reset } = useTonder<SDKType.ENROLLMENT>();

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
      customer: { ...customerData },
      customization: {
        saveButton: {
          text: 'Guadar tarjeta',
        },
        labels: {
          name: 'Cardholder Name',
          cvv: 'CVV',
          cardNumber: 'Card Number',
          expiryDate: 'Expiration Date',
        },
        placeholders: {
          cvv: '123',
          name: 'John Doe',
          cardNumber: '4242 4242 4242 4242',
          expiryMonth: 'MM',
          expiryYear: 'YY',
        },
        styles: sdkStyles,
      },
      callbacks: {
        onFinishSave: callbackFinish,
      },
    });

    if (error) {
      // Manage error
      console.error('Error creating SDK', error);
    }
  };

  const callbackFinish = async (response) => {
    console.log('FINISH SAVE CARD ===== ', response);
    if (response.error) {
      // Manage error
      Alert.alert('Error', 'Failed to save card. Please try again.');
    }

    Alert.alert('Success', 'Card saved successfully!');
    // Reset the state and regenerate the SDK to use it again.
    reset();
    await initialize();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView style={styles.scrollContent}>
        <Text>
          Customizable Card Enrollment with Styles: Showcases the Full
          Enrollment SDK featuring tailored labels, placeholders, and styles,
          allowing developers to personalize the enrollment experience to match
          their app's design.
        </Text>
        <TonderEnrollment />
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

const sdkStyles = {
  sdkCard: {
    base: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
  },
  saveButton: {
    base: {
      backgroundColor: '#007AFF',
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 8,
      textAlign: 'center',
    },
  },
  successMessage: {
    base: {
      color: '#10B981',
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'center',
      marginTop: 20,
    },
  },
  labels: {
    base: {
      color: '#6B7280',
      fontSize: 14,
      fontWeight: '400',
      marginBottom: 5,
    },
    requiredAsterisk: {
      color: '#EF4444',
    },
  },
  placeholders: {
    base: {
      fontSize: 16,
      color: '#9CA3AF',
    },
  },
  paymentButton: {
    base: {
      backgroundColor: '#3B82F6',
      color: '#ffffff',
      fontSize: 16,
      fontWeight: '600',
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 20,
    },
  },
};
