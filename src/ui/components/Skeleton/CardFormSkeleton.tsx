import React from 'react';
import { View, StyleSheet, Animated, Easing, Text } from 'react-native';

const CardFormSkeleton = ({ message }: { message?: string }) => {
  const animatedValue = new Animated.Value(0);

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
    outputRange: ['#e0e0e0', '#f0f0f0'],
  });

  const SkeletonItem = () => (
    <Animated.View
      style={[styles.skeletonLoader, { backgroundColor: interpolatedColor }]}
    />
  );

  return (
    <View style={styles.container}>
      <SkeletonItem />
      <SkeletonItem />
      <View style={styles.collectRow}>
        <Animated.View
          style={[
            styles.skeletonLoaderItem,
            { backgroundColor: interpolatedColor },
          ]}
        />
        <Animated.View
          style={[
            styles.skeletonLoaderItem,
            { backgroundColor: interpolatedColor },
          ]}
        />
        <Animated.View
          style={[
            styles.skeletonLoaderItem,
            { backgroundColor: interpolatedColor },
          ]}
        />
      </View>
      {!!message && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{message}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#F9F9F9',
    padding: 20,
    flex: 1,
    gap: 20,
    zIndex: 1,
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
    height: 35,
    borderRadius: 8,
    flex: 1,
  },
  errorContainer: {
    paddingHorizontal: 11,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});

export default CardFormSkeleton;
