// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Image,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { getCardType } from '../../../shared/catalog/cardBrandCatalog';
import { RadioButton } from '../RadioButton';
import {
  type ICard,
  type InputProps,
  type StylesSavedCardsVariant,
} from '../../../types';
import { Trash2 } from 'lucide-react-native';
import { buildBaseStyleText } from '../../../shared/utils/styleUtils';
import { CardCVVInput } from '@tonder.io/rn-sdk';

interface SavedCardsListProps {
  cards: ICard[];
  selectedMethod: string;
  cvvProps: InputProps;
  onMethodSelect: (methodId: string) => void;
  onDeleteCard: (cardId: string) => Promise<void>;
  deletingCards?: string[];
  style?: StylesSavedCardsVariant;
  showDeleteButton?: boolean;
  expirationLabel?: string;
}

interface CardItemProps {
  card: ICard;
  selectedMethod: string;
  onMethodSelect: (methodId: string) => void;
  onDeleteCard: (cardId: string) => Promise<void>;
  deletingCards?: string[];
  showDeleteButton: boolean;
  style?: StylesSavedCardsVariant;
  expirationLabel: string;
  isLastItem: boolean;
  replaceTextCardNumber: (cardNumber: string) => string;
  cvvProps: InputProps;
}

const CardItem: React.FC<CardItemProps> = ({
  card,
  selectedMethod,
  onMethodSelect,
  onDeleteCard,
  deletingCards,
  showDeleteButton,
  style,
  expirationLabel,
  isLastItem,
  replaceTextCardNumber,
  cvvProps,
}) => {
  const isSelected = selectedMethod === card.fields.skyflow_id;
  const animationScale = useRef(new Animated.Value(0)).current;
  const animationOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(animationScale, {
        toValue: isSelected ? 1 : 0,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }),
      Animated.timing(animationOpacity, {
        toValue: isSelected ? 1 : 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isSelected, animationScale, animationOpacity]);

  return (
    <View
      style={[
        styles.cardItem,
        { ...{ ...(style?.cardItem?.base || {}) } },
        isLastItem && styles.cardItemContainerLast,
      ]}
    >
      <TouchableOpacity
        style={[styles.cardItemPreview]}
        onPress={() => onMethodSelect(card.fields.skyflow_id)}
        activeOpacity={0.7}
      >
        <RadioButton
          style={{
            base: style?.radioBase,
            selected: style?.radioSelected,
            inner: style?.radioInner,
          }}
          value={card.fields.skyflow_id}
          selected={isSelected}
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
            {expirationLabel} {card.fields.expiration_month}/
            {card.fields.expiration_year}
          </Text>
        </View>
        {(deletingCards || []).includes(card.fields.skyflow_id) && (
          <ActivityIndicator color="#000000" size="small" />
        )}
        {!(deletingCards || []).includes(card.fields.skyflow_id) &&
          showDeleteButton && (
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                onDeleteCard(card.fields.skyflow_id);
              }}
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
      </TouchableOpacity>

      {/* Contenido expandible del accordion */}
      <Animated.View
        style={[
          styles.expandedContent,
          {
            opacity: animationOpacity,
            transform: [{ scaleY: animationScale }],
          },
        ]}
      >
        {isSelected && (
          <View style={styles.expandedContentInner}>
            <View style={styles.expandedBodyInner}>
              <CardCVVInput
                style={cvvProps?.style}
                label={cvvProps?.label}
                placeholder={cvvProps?.placeholder}
                onBlur={cvvProps?.onBlur}
                onChange={cvvProps?.onChange}
                onFocus={cvvProps?.onFocus}
                cardId={card.fields.skyflow_id}
              />
            </View>
          </View>
        )}
      </Animated.View>
    </View>
  );
};

const SavedCardsList: React.FC<SavedCardsListProps> = ({
  cards,
  selectedMethod,
  onMethodSelect,
  onDeleteCard,
  deletingCards,
  showDeleteButton = true,
  style,
  expirationLabel = 'Exp.',
  cvvProps,
}) => {
  if (!cards.length) return null;

  const replaceTextCardNumber = (cardNumber: string) => {
    const carArr = cardNumber.split('-');
    const last = carArr[carArr.length - 1];
    return `• • • •  ${last}`;
  };
  return (
    <View style={{ ...styles.container, ...(style?.base || {}) }}>
      {cards.map((card, index) => (
        <CardItem
          key={card.fields.skyflow_id}
          card={card}
          selectedMethod={selectedMethod}
          onMethodSelect={onMethodSelect}
          onDeleteCard={onDeleteCard}
          deletingCards={deletingCards}
          showDeleteButton={showDeleteButton}
          style={style}
          expirationLabel={expirationLabel}
          isLastItem={index === cards.length - 1}
          replaceTextCardNumber={replaceTextCardNumber}
          cvvProps={cvvProps}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
  },
  cardItemPreview: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardItemContainerLast: {
    borderBottomWidth: 0,
  },
  cardItem: {
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
  expandedContent: {},
  expandedContentInner: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  expandedBodyInner: {
    paddingHorizontal: 10,
    minHeight: 75,
    maxWidth: '60%',
  },
});

export default SavedCardsList;
