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
  type ICard,
  type IProcessPaymentRequest,
  SDKType,
  useTonder,
} from '@tonder.io/rn-sdk';
import { getSecureToken } from './utils/utils';
import { BusinessConfig } from './business';

export default function LitePaymentSavedCardsScreen() {
  const apiSecretKey = BusinessConfig.apiSecretKey;

  // Base payment data - will be sent with selected card
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

  // State management
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState<ICard[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const { create, payment, getCustomerCards, reset } =
    useTonder<SDKType.LITE>();

  // Initialize on mount
  useEffect(() => {
    initialize();
  }, []);

  // Main initialization function
  const initialize = async () => {
    try {
      const token = await getSecureToken(apiSecretKey);
      await createSDK(token);
      await fetchCards();
    } catch (error) {
      console.error('Error during initialization: ', error);
    }
  };

  // Create SDK instance
  const createSDK = async (token: string) => {
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

  // Fetch customer's saved cards
  const fetchCards = async () => {
    try {
      const { response } = await getCustomerCards();
      if (response?.cards) {
        setCards(response.cards);
      }
    } catch (error) {
      console.error('Error fetching cards: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Select a card for payment
  const handleCardSelect = (cardId: string) => {
    setSelectedCard(cardId);
  };

  // Process payment with selected card
  const handlePayment = async () => {
    if (!selectedCard) return;

    setIsProcessing(true);
    try {
      // Send payment data with selected card ID
      const paymentDataToSend = { ...paymentData, card: selectedCard };
      const { response, error } = await payment(paymentDataToSend);

      if (error) {
        Alert.alert('Error', 'Failed to process payment. Please try again.');
        console.error('Error processing payment: ', error);
        return;
      }

      console.log('Payment response: ', response);

      // Handle transaction status
      handleTransactionStatus(response?.transaction_status);

      // Reset and reinitialize
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

  // Loading state
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
        <Text style={styles.description}>
          Saved Cards Payment: Select a saved card and enter the CVV to complete
          your payment.
        </Text>

        {/* Cards List */}
        <View style={styles.cardsContainer}>
          {cards.length > 0 ? (
            cards.map((card) => (
              <TouchableOpacity
                key={card.fields.skyflow_id}
                style={[
                  styles.cardItem,
                  selectedCard === card.fields.skyflow_id &&
                    styles.selectedCard,
                ]}
                onPress={() => handleCardSelect(card.fields.skyflow_id)}
              >
                {/* Card icon */}
                <Image source={{ uri: card.icon }} style={styles.cardIcon} />

                {/* Card info */}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardHolderName}>
                    {card.fields.cardholder_name}
                  </Text>
                  <Text style={styles.cardNumber}>
                    •••• •••• •••• {card.fields.card_number.slice(-4)}
                  </Text>
                  <Text style={styles.cardExpiry}>
                    Expires: {card.fields.expiration_month}/
                    {card.fields.expiration_year}
                  </Text>
                </View>

                {/* CVV input - only show for selected card */}
                {selectedCard === card.fields.skyflow_id && (
                  <View style={styles.cvvInputContainer}>
                    <CardCVVInput
                      placeholder="CVV"
                      cardId={card.fields.skyflow_id}
                    />
                  </View>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No saved cards available</Text>
              <Text style={styles.emptySubText}>
                Add a card to use this payment method
              </Text>
            </View>
          )}
        </View>

        {/* Payment Button */}
        <TouchableOpacity
          style={[styles.payButton, !selectedCard && styles.payButtonDisabled]}
          disabled={isProcessing || !selectedCard}
          onPress={handlePayment}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.payButtonText}>Pay Now</Text>
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
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    lineHeight: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardsContainer: {
    marginBottom: 24,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  cardIcon: {
    width: 50,
    height: 32,
    marginRight: 16,
    resizeMode: 'contain',
  },
  cardInfo: {
    flex: 1,
  },
  cardHolderName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cardNumber: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  cardExpiry: {
    fontSize: 12,
    color: '#999',
  },
  cvvInputContainer: {
    width: 80,
    marginLeft: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#bbb',
  },
  payButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  payButtonDisabled: {
    backgroundColor: '#ccc',
  },
  payButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
