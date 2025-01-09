import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  Alert,
} from 'react-native';
import {
  type ICustomer,
  useTonder,
  TonderEnrollment,
  SDKType,
  type IEventSecureInput,
} from '@tonder.io/rn-sdk';
import { useEffect } from 'react';
import { getSecureToken } from './utils/utils';
import { BusinessConfig } from './business';

export default function FullEnrollmentScreen() {
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
      callbacks: {
        onFinishSave: callbackFinish,
      },
      events: {
        cardHolderEvents: {
          onBlur: handleOnBlur,
          onChange: handleOnChange,
          onFocus: handleOnFocus,
        },
        // add more events...
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
      // Manage the error
      Alert.alert('Error', 'Failed to save card. Please try again.');
      console.log('Save Card ERROR', response.error);
      return;
    }
    Alert.alert('Success', 'Card saved successfully!');
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView style={styles.scrollContent}>
        <Text>
          Full Card Enrollment: Demonstrates the Full Enrollment SDK to securely
          save card details for a customer, including configuration for
          callbacks and seamless re-initialization after saving.
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
