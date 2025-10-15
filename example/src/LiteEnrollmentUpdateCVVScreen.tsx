import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  Alert,
  View,
  Image,
} from 'react-native';
import {
  type ICustomer,
  SDKType,
  CardCVVInput,
  useTonder,
  type ICard,
} from '@tonder.io/rn-sdk';
import { useEffect, useState } from 'react';
import { getSecureToken } from './utils/utils';
import { BusinessConfig } from './business';

export default function LiteEnrollmentUpdateCVVScreen() {
  // Do not share your API secret key.
  const apiSecretKey = BusinessConfig.apiSecretKey;
  const customerData: ICustomer = {
    email: 'test@example.com',
    firstName: 'david',
    lastName: 'her',
  };
  const { create, saveCustomerCard, reset, getCardSummary, getCustomerCards } =
    useTonder<SDKType.ENROLLMENT>();

  const [isProcessing, setIsProcessing] = useState(false);
  const [cards, setCards] = useState<ICard[]>([]);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    const token = await getSecureTokenFromBackend();
    await createSDK(token);
    await getSavedCards();
  };

  const getSavedCards = async () => {
    const { response } = await getCustomerCards();
    if (response?.cards) {
      setCards(response.cards);
    }
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
    // GET summary card
    await handleGetSummaryCard(response.skyflow_id);
    // Reset the state and regenerate the SDK to use it again.
    reset();
    await initialize();
  };

  const handleGetSummaryCard = async (id: string) => {
    const { response, error } = await getCardSummary(id);
    if (error) {
      //Manage error
      Alert.alert('Error', 'Failed to get summary card');
      console.error('Error get summary card: ', error);
      return;
    }
    console.log('Response get summary: ', response);
  };

  // Select a card for update CVV
  const handleCardSelect = (cardId: string) => {
    setSelectedCard(cardId);
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />
      <ScrollView style={styles.scrollContent}>
        <Text>
          Lite Enrollment - Update CVV: This screen displays previously saved
          cards and allows users to update the CVV for a selected card. Select a
          card to reveal the CVV input field and securely update the security
          code. This demonstrates how to retrieve saved cards and update their
          CVV using the Lite Enrollment SDK with custom UI.
        </Text>
        {/* Cards List */}
        <View style={styles.cardsContainer}>
          {cards.length > 0 &&
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
            ))}
        </View>
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
});
