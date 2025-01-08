import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ProcessButton } from '../../components/Button/ProcessButton';
import { NewCardForm } from '../../components/CardForm';
import CardFormSkeleton from '../../components/Skeleton/CardFormSkeleton';
import { DEFAULT_PAYMENT_CONTAINER } from '../../styles/payment';
import { buildBaseStyleText } from '../../../shared/utils/styleUtils';
import useTonderContext from '../../providers/TonderProvider/hook';
import { SDKType } from '../../../types';

export interface ITonderEnrollmentProps {}
const TonderEnrollment: React.FC<ITonderEnrollmentProps> = () => {
  const { sdk, state } = useTonderContext<SDKType.ENROLLMENT>();

  const onSave = async () => {
    try {
      await sdk.saveCustomerCard();
    } catch (error) {
      console.error('[TonderEnrollment | onSave | ERROR]', error);
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
        {state?.isCreated && (
          <NewCardForm
            showSaveOption={false}
            saveCard={false}
            onSaveCardChange={() => {}}
            style={state?.customization?.styles?.cardForm}
            labels={state?.customization?.labels}
            placeholders={state?.customization?.placeholders}
            events={state?.events}
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

        {state?.customization?.saveButton?.show && (
          <ProcessButton
            text={state?.customization?.saveButton?.text || 'Pagar'}
            style={state?.customization?.styles?.paymentButton}
            onPress={onSave}
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

export default TonderEnrollment;
