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
  Image,
  Alert,
} from 'react-native';
import {
  CardCVVInput,
  CardExpirationMonthInput,
  CardExpirationYearInput,
  CardHolderInput,
  CardNumberInput,
  ICard,
  IPaymentMethod,
  IProcessPaymentRequest,
  SDKType,
  useTonder,
} from '@tonder.io/rn-sdk';
import { getSecureToken } from './utils/utils';
import { BusinessConfig } from './business';

export default function LitePaymentFullScreen() {
  const apiSecretKey = BusinessConfig.apiSecretKey;
  const paymentData: IProcessPaymentRequest = {
    customer: {
      email: 'test@example.com',
      firstName: 'David',
      lastName: 'Her',
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
          description: 'Product Description',
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
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState<ICard[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);
  const { create, payment, getCustomerCards, getPaymentMethods, reset } =
    useTonder<SDKType.LITE>();

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    try {
      const token = await getSecureTokenFromBackend();
      await createSDK(token);
      await fetchInitialData();
    } catch (error) {
      console.error('Error during initialization: ', error);
    }
  };

  const getSecureTokenFromBackend = async () => {
    try {
      return await getSecureToken(apiSecretKey);
    } catch (error) {
      console.error('Error getting token: ', error);
    }
  };

  const createSDK = async (token) => {
    try {
      const { error } = await create({
        secureToken: token,
        customization: { saveCards: { autoSave: false } },
        paymentData: { ...paymentData },
      });
      if (error) {
        console.error('Error creating SDK: ', error);
      }
    } catch (error) {
      console.error('Error in createSDK: ', error);
    }
  };

  const fetchInitialData = async () => {
    try {
      const fetchedCards = await getCustomerCards();
      if (fetchedCards.response) {
        setCards(fetchedCards.response.cards);
      }

      const fetchedPaymentMethods = await getPaymentMethods();
      if (fetchedPaymentMethods.response) {
        setPaymentMethods(fetchedPaymentMethods.response);
      }
    } catch (error) {
      console.error('Error fetching data: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      const { response, error } = await payment();
      if (
        error ||
        !['Success', 'Authorized'].includes(response?.transaction_status)
      ) {
        Alert.alert('Error', 'Failed to process payment. Please try again.');
        console.error(
          'Error processing payment: ',
          error,
          response?.transaction_status
        );
        return;
      }
      Alert.alert(
        response?.transaction_status || 'Success',
        'Payment process successfully!'
      );
      console.log('Success Payment: ', response);
      // Reset the state and regenerate the SDK to use it again.
      reset();
      await initialize();
    } finally {
      setIsProcessing(false);
    }
  };

  const renderCards = () =>
    cards.length > 0 ? (
      cards.map((card) => (
        <View key={card.fields.skyflow_id} style={styles.cardContainer}>
          <Image source={{ uri: card.icon }} style={styles.cardIcon} />
          <View>
            <Text style={styles.cardText}>{card.fields.cardholder_name}</Text>
            <Text style={styles.cardSubText}>
              **** **** **** {card.fields.card_number.slice(-4)}
            </Text>
            <Text style={styles.cardSubText}>
              Expires: {card.fields.expiration_month}/
              {card.fields.expiration_year}
            </Text>
          </View>
        </View>
      ))
    ) : (
      <Text style={styles.emptyText}>No saved cards available</Text>
    );

  const renderPaymentMethods = () =>
    paymentMethods.length > 0 ? (
      <View style={styles.gridContainer}>
        {paymentMethods.map((method, index) => (
          <View key={index} style={styles.methodGridItem}>
            <Image source={{ uri: method.icon }} style={styles.methodIcon} />
            <Text style={styles.methodText}>{method.label}</Text>
          </View>
        ))}
      </View>
    ) : (
      <Text style={styles.emptyText}>No payment methods available</Text>
    );
  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView style={styles.scrollContent}>
        <Text>
          Lite Payment Example: A custom payment interface showcasing saved
          cards and all available payment methods. Developers can integrate
          secure Tonder inputs for cardholder details and dynamically display
          multiple payment options in a grid layout
        </Text>

        {/* Display Customer Cards */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Saved Cards</Text>
          {renderCards()}
        </View>

        {/* Display Payment Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Payment Methods</Text>
          {renderPaymentMethods()}
        </View>

        {/* Secure Inputs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Card Details</Text>
          <View style={styles.inputWrapper}>
            <CardHolderInput placeholder="Cardholder Name" />
          </View>
          <View style={styles.inputWrapper}>
            <CardNumberInput placeholder="Card Number" />
          </View>
          <View style={styles.row}>
            <CardExpirationMonthInput placeholder="MM" />
            <CardExpirationYearInput placeholder="YY" />
            <CardCVVInput placeholder="CVV" />
          </View>
        </View>

        {/* Payment Button */}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
  },
  scrollContent: {
    flexGrow: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  cardIcon: {
    width: 40,
    height: 25,
    marginRight: 10,
  },
  cardText: {
    fontWeight: 'bold',
  },
  cardSubText: {
    fontSize: 12,
    color: '#555',
  },
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  inputWrapper: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -5,
  },
  methodGridItem: {
    width: '30%',
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  methodIcon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  methodText: {
    fontSize: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#aaa',
    textAlign: 'center',
  },
});
