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
              title="Lite payment with secure inputs"
              onPress={() => {
                navigation.navigate('LitePaymentScreen');
              }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Lite payment with customization"
              onPress={() => {
                navigation.navigate('LitePaymentCustomizationScreen');
              }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Lite payment with all sdk methods"
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
              title="Prebuilt UI for Enrollment"
              onPress={() => {
                navigation.navigate('FullEnrollmentScreen');
              }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Enrrollment with button"
              onPress={() => {
                navigation.navigate('FullEnrollmentButtonScreen');
              }}
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Enrollment with customization"
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
