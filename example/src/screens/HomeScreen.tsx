import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View, ScrollView } from 'react-native';
import { colors } from '../color';
import { Collapse } from '../components/Collapse';
import Button from '../components/Button';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <ScrollView accessibilityLabel="app-root" style={styles.container}>
      <Collapse title="Full Inline payment">
        <>
          <View style={styles.buttonContainer}>
            <Button
              title="Prebuilt UI"
              onPress={() => {
                navigation.navigate('FullPaymentScreen');
              }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Prebuilt UI with Button"
              onPress={() => {
                navigation.navigate('FullPaymentButtonScreen');
              }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Prebuilt UI with customization"
              onPress={() => {
                navigation.navigate('FullPaymentCustomizationScreen');
              }}
            />
          </View>
        </>
      </Collapse>
      <Collapse title="Lite Payment">
        <>
          <View style={styles.buttonContainer}>
            <Button
              title="Prebuilt UI (multi-step)"
              onPress={() => {
                navigation.navigate('LitePaymentScreen');
              }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Card element only"
              onPress={() => {
                navigation.navigate('LitePaymentCustomizationScreen');
              }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Multiline Card element only"
              onPress={() => {
                navigation.navigate('LitePaymentFullScreen');
              }}
            />
          </View>
        </>
      </Collapse>
      <Collapse title="Full Enrollment">
        <>
          <View style={styles.buttonContainer}>
            <Button
              title="Prebuilt UI for Subscription"
              onPress={() => {
                navigation.navigate('FullEnrollmentScreen');
              }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Customer Sheet"
              onPress={() => {
                navigation.navigate('FullEnrollmentButtonScreen');
              }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Prebuilt UI (multi-step) (deferred intent)"
              onPress={() => {
                navigation.navigate('FullEnrollmentCustomizationScreen');
              }}
            />
          </View>
        </>
      </Collapse>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
  },
  buttonContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomColor: colors.light_gray,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
