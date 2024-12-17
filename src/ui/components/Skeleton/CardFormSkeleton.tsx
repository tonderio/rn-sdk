import React from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';
import type { ISkeletonCardStyles, StylesBaseVariant } from '@tonder.io/rn-sdk';
import { buildBaseStyleText } from '../../../shared/utils/styleUtils';

const SkeletonItem = ({
  styleItem,
  interpolatedColor,
}: {
  styleItem?: StylesBaseVariant;
  interpolatedColor: Animated.AnimatedInterpolation<string | number>;
}) => (
  <Animated.View
    style={[
      styles.skeletonLoader,
      ...(styleItem?.base ? [styleItem.base] : []),
      { backgroundColor: interpolatedColor },
    ]}
  />
);

const CardFormSkeleton = ({
  message,
  style,
  errorMessageStyle,
}: {
  message?: string;
  style?: ISkeletonCardStyles;
  errorMessageStyle?: StylesBaseVariant;
}) => {
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 750,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 750,
          easing: Easing.ease,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const interpolatedColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: style?.animatedBGColors || ['#e0e0e0', '#dddddd'],
  });

  return (
    <View
      style={{
        ...styles.container,
        ...(style?.base || {}),
        ...styles.containerBase,
      }}
    >
      <SkeletonItem
        styleItem={style?.fullField}
        interpolatedColor={interpolatedColor}
      />
      <SkeletonItem
        styleItem={style?.fullField}
        interpolatedColor={interpolatedColor}
      />
      <View
        style={{
          ...styles.collectRow,
          ...(style?.compactRow?.base || {}),
        }}
      >
        <Animated.View
          style={[
            styles.skeletonLoader,
            ...(style?.compactField?.base ? [style?.compactField?.base] : []),
            styles.skeletonLoaderItem,
            { backgroundColor: interpolatedColor },
          ]}
        />
        <Animated.View
          style={[
            styles.skeletonLoader,
            ...(style?.compactField?.base ? [style?.compactField?.base] : []),
            styles.skeletonLoaderItem,
            { backgroundColor: interpolatedColor },
          ]}
        />
        <Animated.View
          style={[
            styles.skeletonLoader,
            ...(style?.compactField?.base ? [style?.compactField?.base] : []),
            styles.skeletonLoaderItem,
            { backgroundColor: interpolatedColor },
          ]}
        />
      </View>
      {!!message && (
        <View
          style={{
            ...styles.errorContainer,
            ...(errorMessageStyle?.base || {}),
          }}
        >
          <Text
            style={{
              ...styles.errorText,
              ...buildBaseStyleText(errorMessageStyle),
            }}
          >
            {message}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerBase: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  },
  container: {
    backgroundColor: '#F9F9F9',
    padding: 20,
    flex: 1,
    gap: 20,
  },
  collectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    gap: 10,
  },
  skeletonLoader: {
    height: 35,
    borderRadius: 8,
    marginVertical: 2,
    marginHorizontal: 10,
  },
  skeletonLoaderItem: {
    flex: 1,
    marginVertical: 0,
    marginHorizontal: 0,
  },
  errorContainer: {
    paddingHorizontal: 20,
    marginVertical: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default CardFormSkeleton;
