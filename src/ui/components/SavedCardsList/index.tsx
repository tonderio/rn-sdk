// @ts-nocheck
import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
} from 'react-native';
import { getCardType } from '../../../shared/catalog/cardBrandCatalog';
import { RadioButton } from '../RadioButton';
import type { ICard, StylesSavedCardsVariant } from '../../../types';
import { Trash2 } from 'lucide-react-native';
import { buildBaseStyleText } from '../../../shared/utils/styleUtils';

interface SavedCardsListProps {
  cards: ICard[];
  selectedMethod: string;
  onMethodSelect: (methodId: string) => void;
  onDeleteCard: (cardId: string) => Promise<void>;
  deletingCards?: string[];
  style?: StylesSavedCardsVariant;
  showDeleteButton?: boolean;
}

const SavedCardsList: React.FC<SavedCardsListProps> = ({
  cards,
  selectedMethod,
  onMethodSelect,
  onDeleteCard,
  deletingCards,
  showDeleteButton = true,
  style,
}) => {
  if (!cards.length) return null;

  const replaceTextCardNumber = (cardNumber: string) => {
    const carArr = cardNumber.split('-');
    const last = carArr[carArr.length - 1];
    return `• • • •  ${last}`;
  };
  return (
    <View style={{ ...styles.container, ...(style?.base || {}) }}>
      {cards.map((card) => (
        <View key={card.fields.skyflow_id} style={styles.cardItem}>
          <RadioButton
            style={{
              base: style?.radioBase,
              selected: style?.radioSelected,
              inner: style?.radioInner,
            }}
            value={card.fields.skyflow_id}
            selected={selectedMethod === card.fields.skyflow_id}
            onSelect={() => onMethodSelect(card.fields.skyflow_id)}
          />
          <Image
            source={{ uri: getCardType(card.fields.card_scheme) }}
            style={{ ...styles.cardImage, ...(style?.cardIcon || {}) }}
          />
          <View style={styles.cardInfo}>
            <Text
              style={{
                ...styles.cardNumber,
                ...buildBaseStyleText(style),
              }}
            >
              {replaceTextCardNumber(card.fields.card_number)}
            </Text>
            <Text
              style={{
                ...styles.cardExpiration,
                ...buildBaseStyleText(style),
              }}
            >
              Exp. {card.fields.expiration_month}/{card.fields.expiration_year}
            </Text>
          </View>
          {(deletingCards || []).includes(card.fields.skyflow_id) && (
            <ActivityIndicator color="#000000" size="small" />
          )}
          {!(deletingCards || []).includes(card.fields.skyflow_id) &&
            showDeleteButton && (
              <TouchableOpacity
                onPress={() => onDeleteCard(card.fields.skyflow_id)}
                style={{
                  ...styles.deleteButton,
                  ...(style?.deleteButton || {}),
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Trash2
                  size={style?.deleteIcon?.fontSize || 16}
                  color={style?.deleteIcon?.color || '#000000'}
                />
              </TouchableOpacity>
            )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  cardImage: {
    width: 32,
    height: 20,
    marginLeft: 15,
  },
  cardInfo: {
    flex: 1,
    marginLeft: 15,
  },
  cardNumber: {
    fontSize: 12,
    color: '#1D1D1D',
  },
  cardExpiration: {
    fontSize: 12,
    color: '#1D1D1D',
  },
  deleteButton: {
    padding: 10,
  },
});

export default SavedCardsList;
