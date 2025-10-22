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
  type ICard,
  type IPaymentMethod,
  type IProcessPaymentRequest,
  SDKType,
  useTonder,
} from '@tonder.io/rn-sdk';
import { getSecureToken } from './utils/utils';
import { BusinessConfig } from './business';

// Selection types for payment methods
type SelectionType = 'card' | 'payment-method' | 'new-card' | null;

export default function LitePaymentFullScreen() {
  const apiSecretKey = BusinessConfig.apiSecretKey;

  // Base payment data - this will be copied and modified based on selection
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

  // State for loading and processing
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // State for fetched data
  const [cards, setCards] = useState<ICard[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<IPaymentMethod[]>([]);

  // State for accordion sections (which section is expanded)
  const [expandedSection, setExpandedSection] = useState<SelectionType>(null);

  // State for selected payment option
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    string | null
  >(null);

  const { create, payment, getCustomerCards, getPaymentMethods, reset } =
    useTonder<SDKType.LITE>();

  // Initialize SDK on component mount
  useEffect(() => {
    initialize();
  }, []);

  // Main initialization function
  const initialize = async () => {
    try {
      const token = await getSecureTokenFromBackend();
      await createSDK(token);
      await fetchInitialData();
    } catch (error) {
      console.error('Error during initialization: ', error);
    }
  };

  // Get secure token from backend
  const getSecureTokenFromBackend = async () => {
    try {
      return await getSecureToken(apiSecretKey);
    } catch (error) {
      console.error('Error getting token: ', error);
    }
  };

  // Create the SDK instance
  const createSDK = async (token: string | undefined) => {
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

  // Fetch saved cards and payment methods
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

  // Toggle accordion section
  const toggleSection = (section: SelectionType) => {
    if (expandedSection === section) {
      // Collapse if already expanded
      setExpandedSection(null);
      setSelectedCard(null);
      setSelectedPaymentMethod(null);
    } else {
      // Expand new section and reset selections
      setExpandedSection(section);
      setSelectedCard(null);
      setSelectedPaymentMethod(null);
    }
  };

  // Select a saved card
  const selectCard = (cardId: string) => {
    setSelectedCard(cardId);
    setSelectedPaymentMethod(null);
  };

  // Select a payment method
  const selectPaymentMethod = (methodName: string) => {
    setSelectedPaymentMethod(methodName);
    setSelectedCard(null);
  };

  // Handle payment based on selected option
  const handlePayment = async () => {
    setIsProcessing(true);
    try {
      // Prepare payment data based on selection
      let paymentDataToSend = { ...paymentData };

      // Case 1: Saved card selected - add card field
      if (expandedSection === 'card' && selectedCard) {
        paymentDataToSend = { ...paymentData, card: selectedCard };
      }
      // Case 2: Payment method selected - add payment_method field
      else if (expandedSection === 'payment-method' && selectedPaymentMethod) {
        paymentDataToSend = {
          ...paymentData,
          payment_method: selectedPaymentMethod,
        };
      }
      // Case 3: New card form - just use base paymentData (SDK collects form inputs)
      // No additional fields needed

      // Process payment
      const { response, error } = await payment(paymentDataToSend);

      if (error) {
        Alert.alert('Error', 'Failed to process payment. Please try again.');
        console.error('Error processing payment: ', error);
        return;
      }
      console.log('Payment response: ', response);

      // Handle transaction status
      handleTransactionStatus(response?.transaction_status);

      // Reset and reinitialize for next use
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

  // Check if payment button should be enabled
  const isPaymentEnabled = () => {
    if (expandedSection === 'card') {
      return selectedCard !== null;
    } else if (expandedSection === 'payment-method') {
      return selectedPaymentMethod !== null;
    } else if (expandedSection === 'new-card') {
      return true; // Form validation handled by SDK
    }
    return false;
  };

  // Render saved cards accordion
  const renderCardsSection = () => (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => toggleSection('card')}
      >
        <Text style={styles.accordionTitle}>💳 Pay with Saved Card</Text>
        <Text style={styles.accordionIcon}>
          {expandedSection === 'card' ? '▼' : '▶'}
        </Text>
      </TouchableOpacity>

      {expandedSection === 'card' && (
        <View style={styles.accordionContent}>
          {cards.length > 0 ? (
            cards.map((card) => (
              <TouchableOpacity
                key={card.fields.skyflow_id}
                style={[
                  styles.cardItem,
                  selectedCard === card.fields.skyflow_id &&
                    styles.selectedItem,
                ]}
                onPress={() => selectCard(card.fields.skyflow_id)}
              >
                <Image source={{ uri: card.icon }} style={styles.cardIcon} />
                <View style={styles.cardInfo}>
                  <Text style={styles.cardText}>
                    {card.fields.cardholder_name}
                  </Text>
                  <Text style={styles.cardSubText}>
                    **** **** **** {card.fields.card_number.slice(-4)}
                  </Text>
                  <Text style={styles.cardSubText}>
                    Expires: {card.fields.expiration_month}/
                    {card.fields.expiration_year}
                  </Text>
                </View>

                {/* Show CVV input only for selected card */}
                {selectedCard === card.fields.skyflow_id && (
                  <View style={styles.cvvContainer}>
                    <CardCVVInput
                      placeholder="CVV"
                      cardId={card.fields.skyflow_id}
                    />
                  </View>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No saved cards available</Text>
          )}
        </View>
      )}
    </View>
  );

  // Render payment methods accordion
  const renderPaymentMethodsSection = () => (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => toggleSection('payment-method')}
      >
        <Text style={styles.accordionTitle}>🏦 Pay with Other Methods</Text>
        <Text style={styles.accordionIcon}>
          {expandedSection === 'payment-method' ? '▼' : '▶'}
        </Text>
      </TouchableOpacity>

      {expandedSection === 'payment-method' && (
        <View style={styles.accordionContent}>
          {paymentMethods.length > 0 ? (
            paymentMethods.map((method, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.methodItem,
                  selectedPaymentMethod === method.payment_method &&
                    styles.selectedItem,
                ]}
                onPress={() => selectPaymentMethod(method.payment_method)}
              >
                <Image
                  source={{ uri: method.icon }}
                  style={styles.methodIcon}
                />
                <Text style={styles.methodText}>{method.label}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.emptyText}>No payment methods available</Text>
          )}
        </View>
      )}
    </View>
  );

  // Render new card form accordion
  const renderNewCardSection = () => (
    <View style={styles.accordionContainer}>
      <TouchableOpacity
        style={styles.accordionHeader}
        onPress={() => toggleSection('new-card')}
      >
        <Text style={styles.accordionTitle}>➕ Pay with New Card</Text>
        <Text style={styles.accordionIcon}>
          {expandedSection === 'new-card' ? '▼' : '▶'}
        </Text>
      </TouchableOpacity>

      {expandedSection === 'new-card' && (
        <View style={styles.accordionContent}>
          {/* Secure card inputs - SDK handles data collection */}
          <View style={styles.inputWrapper}>
            <CardHolderInput placeholder="Cardholder Name" />
          </View>
          <View style={styles.inputWrapper}>
            <CardNumberInput placeholder="Card Number" />
          </View>
          <View style={styles.row}>
            <View style={styles.inputWrapper}>
              <CardExpirationMonthInput placeholder="MM" />
            </View>
            <View style={styles.inputWrapper}>
              <CardExpirationYearInput placeholder="YY" />
            </View>
            <View style={styles.inputWrapper}>
              <CardCVVInput placeholder="CVV" />
            </View>
          </View>
        </View>
      )}
    </View>
  );

  // Show loader while initializing
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
          Lite Payment Example: Select one payment option at a time - use a
          saved card, choose an alternative payment method, or enter new card
          details.
        </Text>

        {/* Saved Cards Accordion */}
        {renderCardsSection()}

        {/* Payment Methods Accordion */}
        {renderPaymentMethodsSection()}

        {/* New Card Form Accordion */}
        {renderNewCardSection()}

        {/* Payment Button */}
        <TouchableOpacity
          style={[styles.button, !isPaymentEnabled() && styles.buttonDisabled]}
          disabled={isProcessing || !isPaymentEnabled()}
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
    padding: 16,
  },
  scrollContent: {
    flexGrow: 1,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Accordion styles
  accordionContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  accordionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  accordionIcon: {
    fontSize: 16,
    color: '#666',
  },
  accordionContent: {
    padding: 16,
    backgroundColor: '#fff',
  },
  // Saved card styles
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedItem: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  cardIcon: {
    width: 40,
    height: 25,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardText: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
  },
  cardSubText: {
    fontSize: 12,
    color: '#555',
  },
  cvvContainer: {
    width: 80,
    marginLeft: 8,
  },
  // Payment method styles
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  methodIcon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  methodText: {
    fontSize: 14,
    fontWeight: '500',
  },
  // New card form styles
  inputWrapper: {
    marginBottom: 12,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  // Button styles
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#aaa',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
