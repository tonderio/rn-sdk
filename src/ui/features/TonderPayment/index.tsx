import React, { useEffect, useRef, useState } from 'react';
import useTonderContext from '../../providers/TonderProvider/hook';
import { SDKType } from '../../../types';
import CardFormSkeleton from '../../components/Skeleton/CardFormSkeleton';
import {
  Animated,
  Image,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { DEFAULT_PAYMENT_CONTAINER } from '../../styles/payment';
import { buildBaseStyleText } from '../../../shared/utils/styleUtils';
import SavedCardsList from '../../components/SavedCardsList';
import { ProcessButton } from '../../components/Button/ProcessButton';
import PaymentMethodsList from '../../components/PaymentMethodsList';
import { NewCardForm } from '../../components/CardForm';
import { RadioButton } from '../../components/RadioButton';
import { getCardType } from '../../../shared/catalog/cardBrandCatalog';
import { toCurrency } from '../../../shared/utils/numberUtils';

export interface ITonderPaymentProps {}
const TonderPayment: React.FC<ITonderPaymentProps> = () => {
  const { uiWrapper, sdk, state } = useTonderContext<SDKType.INLINE>();
  const [deletingCards, setDelitingCards] = useState<string[]>([]);

  // Animación para NewCardForm
  const animationScale = useRef(new Animated.Value(0)).current;
  const animationOpacity = useRef(new Animated.Value(0)).current;

  const isNewCardSelected =
    state?.uiData?.selectedMethod === 'new' &&
    state?.isCreated &&
    state?.customization?.cardForm?.show;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(animationScale, {
        toValue: isNewCardSelected ? 1 : 0,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }),
      Animated.timing(animationOpacity, {
        toValue: isNewCardSelected ? 1 : 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isNewCardSelected, animationScale, animationOpacity]);

  const handleMethodSelect = (methodId: string, type: string) => {
    uiWrapper.updateMethod(type, methodId);
  };

  const handleSaveCardChange = (value: boolean) => {
    uiWrapper.updateSaveCard(value);
  };

  const onDeleteCard = async (cardId: string) => {
    try {
      setDelitingCards((prev) => [...prev, ...[cardId]]);
      await uiWrapper.removeCustomerCard(cardId);
      setDelitingCards((prev) => {
        return prev.filter((it) => it !== cardId);
      });
    } catch (error) {
      setDelitingCards((prev) => {
        return prev.filter((it) => it !== cardId);
      });
    }
  };

  const onPayment = async () => {
    try {
      await sdk.payment();
    } catch (error) {
      console.error('[TonderPayment | onPayment | Error]: ', error);
    }
  };

  if (!state?.isCreating && !state?.isCreated) {
    return null;
  }
  return (
    <View style={styles.container}>
      {state?.isCreating && (
        <CardFormSkeleton
          style={state?.customization?.styles?.skeletonCard}
          message={state?.message}
        />
      )}
      <View
        style={{
          ...DEFAULT_PAYMENT_CONTAINER.base,
          ...(state?.isCreating ? { minHeight: 210 } : {}),
          ...(state?.customization?.styles?.sdkCard?.base || {}),
        }}
      >
        {state?.customization?.saveCards?.showSaved && state?.isCreated && (
          <SavedCardsList
            style={state?.customization?.styles?.savedCards}
            expirationLabel={state?.customization?.labels?.expirationCard}
            cards={state.uiData?.cards}
            selectedMethod={state?.uiData?.card || ''}
            onMethodSelect={(methodId) => {
              handleMethodSelect(methodId, 'card');
            }}
            onDeleteCard={onDeleteCard}
            deletingCards={deletingCards}
            showDeleteButton={state?.customization?.saveCards?.showDeleteOption}
            cvvProps={{
              style: state?.customization?.styles?.cardForm,
              label: state?.customization?.labels?.cvv,
              placeholder: state?.customization?.placeholders?.cvv,
              onBlur: state?.events?.cvvEvents?.onBlur,
              onFocus: state?.events?.cvvEvents?.onFocus,
              onChange: state?.events?.cvvEvents?.onChange,
            }}
          />
        )}

        {state?.customization?.cardForm?.show && (
          <TouchableOpacity
            style={{
              ...styles.newCardSection,
              ...state?.customization?.styles?.paymentRadio?.base,
            }}
            onPress={() => handleMethodSelect('new', '')}
            activeOpacity={0.7}
          >
            <RadioButton
              value="new"
              selected={state?.uiData?.selectedMethod === 'new'}
              onSelect={() => handleMethodSelect('new', '')}
              style={{
                base: state?.customization?.styles?.paymentRadio?.radioBase,
                selected:
                  state?.customization?.styles?.paymentRadio?.radioSelected,
                inner: state?.customization?.styles?.paymentRadio?.radioInner,
              }}
            />
            <Image
              source={{ uri: getCardType('') }}
              style={{
                ...styles.cardImage,
                ...(state?.customization?.styles?.paymentRadio?.cardIcon || {}),
              }}
            />
            <Text
              style={{
                ...styles.newCardText,
                ...buildBaseStyleText(
                  state?.customization?.styles?.paymentRadio
                ),
              }}
            >
              {state?.customization?.labels?.payWithCard || 'Pagar con tarjeta'}
            </Text>
          </TouchableOpacity>
        )}

        {state?.customization?.cardForm?.show && (
          <Animated.View
            style={[
              styles.animatedFormContainer,
              {
                opacity: animationOpacity,
                transform: [{ scaleY: animationScale }],
              },
            ]}
          >
            {state?.uiData?.selectedMethod === 'new' && state?.isCreated && (
              <NewCardForm
                showSaveOption={
                  state?.customization?.saveCards?.showSaveCardOption
                }
                saveCard={state?.uiData?.saveCard || false}
                onSaveCardChange={handleSaveCardChange}
                style={state?.customization?.styles?.cardForm}
                labels={state?.customization?.labels}
                placeholders={state?.customization?.placeholders}
                events={state?.events}
              />
            )}
          </Animated.View>
        )}
        {state?.customization?.paymentMethods?.show && (
          <PaymentMethodsList
            methods={state?.uiData.paymentMethods}
            selectedMethod={state?.uiData?.payment_method || ''}
            onMethodSelect={(methodId) => {
              handleMethodSelect(methodId, 'payment_method');
            }}
            style={state?.customization?.styles?.paymentMethods}
          />
        )}

        {state?.customization?.showMessages &&
          state?.message &&
          state?.message !== '' &&
          state?.error && (
            <View
              style={{
                ...styles.messageContainer,
                ...(state?.customization?.styles?.errorMessage?.base || {}),
              }}
            >
              <Text
                style={{
                  ...styles.errorText,
                  ...buildBaseStyleText(
                    state?.customization?.styles?.errorMessage
                  ),
                }}
              >
                {state?.message}
              </Text>
            </View>
          )}

        {state?.customization?.showMessages &&
          state?.message &&
          state?.message !== '' &&
          !state?.error && (
            <View
              style={{
                ...styles.messageContainer,
                ...(state?.customization?.styles?.successMessage?.base || {}),
              }}
            >
              <Text
                style={{
                  ...styles.successText,
                  ...buildBaseStyleText(
                    state?.customization?.styles?.successMessage
                  ),
                }}
              >
                {state?.message}
              </Text>
            </View>
          )}

        {state?.customization?.paymentButton?.show && (
          <ProcessButton
            text={`${state?.customization?.paymentButton?.text || 'Pagar'} ${state?.paymentData.cart.total && state?.customization?.paymentButton?.showAmount ? toCurrency(state?.paymentData.cart.total) : ''}`}
            style={state?.customization?.styles?.paymentButton}
            onPress={onPayment}
            isLoading={state?.isProcessing}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    minHeight: 210,
  },
  newCardSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  cardImage: {
    width: 32,
    height: 20,
    marginLeft: 15,
  },
  newCardText: {
    fontSize: 12,
    color: '#1D1D1D',
    marginLeft: 15,
  },
  messageContainer: {
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
  successText: {
    color: '#3bc635',
    fontSize: 12,
  },
  animatedFormContainer: {
    overflow: 'hidden',
  },
});

export default TonderPayment;
