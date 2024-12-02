import React, { useState } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import SavedCardsList from '../../components/SavedCardsList';
import { ProcessButton } from '../../components/Button/ProcessButton';
import PaymentMethodsList from '../../components/PaymentMethodsList';
import { NewCardForm } from '../../components/CardForm';
import { RadioButton } from '../../components/RadioButton';
import { getCardType } from '../../../shared/catalog/cardBrandCatalog';
import CardFormSkeleton from '../../components/Skeleton/CardFormSkeleton';
import { DEFAULT_PAYMENT_CONTAINER } from '../../styles/payment';
import { buildBaseStyleText } from '../../../shared/utils/styleUtils';
import { toCurrency } from '../../../shared/utils/numberUtils';
import useTonderContext from '../../providers/TonderProvider/hook';
import { SDKType } from '../../../types';

export interface ITonderPaymentProps {}
const TonderPayment: React.FC<ITonderPaymentProps> = () => {
  const { uiWrapper, sdk, state } = useTonderContext<SDKType.INLINE>();
  const [deletingCards, setDelitingCards] = useState<string[]>([]);

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
      console.error('[TonderPayment | onDeleteCard | ERROR]', error);
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
      {state?.isCreating && <CardFormSkeleton message={state?.message} />}
      <View
        style={{
          ...DEFAULT_PAYMENT_CONTAINER.base,
          ...(state?.isCreating ? { minHeight: 210 } : {}),
          ...(state?.customization?.styles?.sdkCard?.base || {}),
        }}
      >
        {state?.customization?.saveCards?.showSaved && (
          <SavedCardsList
            style={state?.customization?.styles?.savedCards}
            cards={state.uiData?.cards}
            selectedMethod={state?.uiData?.card || ''}
            onMethodSelect={(methodId) => {
              handleMethodSelect(methodId, 'card');
            }}
            onDeleteCard={onDeleteCard}
            deletingCards={deletingCards}
            showDeleteButton={state?.customization?.saveCards?.showDeleteOption}
          />
        )}

        {state?.customization?.cardForm?.show && (
          <View
            style={{
              ...styles.newCardSection,
              ...state?.customization?.styles?.paymentRadio?.base,
            }}
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
              Pagar con tarjeta
            </Text>
          </View>
        )}

        {state?.uiData?.selectedMethod === 'new' &&
          state?.isCreated &&
          state?.customization?.cardForm?.show && (
            <NewCardForm
              showSaveOption={
                state?.customization?.saveCards?.showSaveCardOption
              }
              saveCard={state?.uiData?.saveCard || false}
              onSaveCardChange={handleSaveCardChange}
              style={state?.customization?.styles?.cardForm}
              labels={state?.customization?.labels}
              placeholders={state?.customization?.placeholders}
            />
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
  },
  newCardSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
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
});

export default TonderPayment;
