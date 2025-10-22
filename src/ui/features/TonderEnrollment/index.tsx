import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated } from 'react-native';
import CardFormSkeleton from '../../components/Skeleton/CardFormSkeleton';
import useTonderContext from '../../providers/TonderProvider/hook';
import { SDKType } from '../../../types';
import { NewCardForm } from '../../components/CardForm';
import { DEFAULT_PAYMENT_CONTAINER } from '../../styles/payment';
import { buildBaseStyleText } from '../../../shared/utils/styleUtils';
import { ProcessButton } from '../../components/Button/ProcessButton';

export interface ITonderEnrollmentProps {}
const TonderEnrollment: React.FC<ITonderEnrollmentProps> = () => {
  const { sdk, state } = useTonderContext<SDKType.ENROLLMENT>();

  // Animación para NewCardForm
  const animationScale = useRef(new Animated.Value(0)).current;
  const animationOpacity = useRef(new Animated.Value(0)).current;

  const isCardFormVisible = state?.isCreated;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(animationScale, {
        toValue: isCardFormVisible ? 1 : 0,
        useNativeDriver: true,
        friction: 8,
        tension: 40,
      }),
      Animated.timing(animationOpacity, {
        toValue: isCardFormVisible ? 1 : 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isCardFormVisible, animationScale, animationOpacity]);

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
        <Animated.View
          style={[
            styles.animatedFormContainer,
            {
              opacity: animationOpacity,
              transform: [{ scaleY: animationScale }],
            },
          ]}
        >
          {state?.isCreated && (
            <NewCardForm
              showSaveOption={false}
              saveCard={false}
              onSaveCardChange={() => {}}
              style={{
                ...(state?.customization?.styles?.cardForm || {}),
                base: {
                  ...styles.containerForm,
                  ...(state?.customization?.styles?.cardForm?.base || {}),
                },
              }}
              labels={state?.customization?.labels}
              placeholders={state?.customization?.placeholders}
              events={state?.events}
            />
          )}
        </Animated.View>
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
    minHeight: 210,
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
  containerForm: {
    height: 'auto',
    minHeight: 190,
  },
  animatedFormContainer: {
    overflow: 'hidden',
  },
});

export default TonderEnrollment;
