import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  ICustomer,
  SDKType,
  TonderEnrollment,
  useTonder,
} from '@tonder.io/rn-sdk';
import { useEffect, useState } from 'react';
import { getSecureToken } from './utils/utils';
import { BusinessConfig } from './business';

export default function FullEnrollmentButtonScreen() {
  // Do not share your API secret key.
  const apiSecretKey = BusinessConfig.apiSecretKey;
  const customerData: ICustomer = {
    email: 'test@example.com',
    firstName: 'david',
    lastName: 'her',
  };
  const { create, saveCustomerCard, reset } = useTonder<SDKType.ENROLLMENT>();
  const [isProcessing, setIsProcessing] = useState(false);

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
          show: false,
        },
      },
    });

    if (error) {
      // Manage error
      console.error('Error creating SDK', error);
    }
  };
  const handleSaveCard = async () => {
    setIsProcessing(true);
    const { response, error } = await saveCustomerCard();
    setIsProcessing(false);
    if (error) {
      //Manage error
      Alert.alert('Error', 'Failed to save card. Please try again.');
      console.error('Error save: ', error);
      return;
    }
    Alert.alert('Success', 'Card saved successfully!');
    console.log('Response save: ', response);
    // Reset the state and regenerate the SDK to use it again.
    reset();
    await initialize();
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView style={styles.scrollContent}>
        <Text>
          Customizable Card Enrollment: Demonstrates the Full Enrollment SDK
          with developer-defined save button, offering flexibility to integrate
          and style custom UI elements for saving card details.
        </Text>
        <TonderEnrollment />
        <TouchableOpacity
          style={styles.button}
          disabled={isProcessing}
          onPress={handleSaveCard}
        >
          {!isProcessing && <Text>Guardar</Text>}
          {isProcessing && <Text>Guardando...</Text>}
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
