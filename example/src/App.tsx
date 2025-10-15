import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TonderProvider, SDKType } from '@tonder.io/rn-sdk';
import FullPaymentScreen from './FullPaymentScreen';
import FullEnrollmentScreen from './FullEnrollmentScreen';
import LitePaymentScreen from './LitePaymentScreen';
import HomeScreen from './screens/HomeScreen';
import FullPaymentCustomizationScreen from './FullPaymentCustomizationScreen';
import FullEnrollmentCustomizationScreen from './FullEnrollmentCustomizationScreen';
import FullEnrollmentButtonScreen from './FullEnrollmentButtonScreen';
import FullPaymentButtonScreen from './FullPaymentButtonScreen';
import LitePaymentCustomizationScreen from './LitePaymentCustomizationScreen';
import LitePaymentFullScreen from './LitePaymentFullScreen';
import LiteEnrollmentScreen from './LiteEnrollmentScreen';

import { BusinessConfig } from './business';
import LitePaymentSavedCardsScreen from './LitePaymentSavedCardsScreen';
import LiteEnrollmentUpdateCVVScreen from './LiteEnrollmentUpdateCVVScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export type RootStackParamList = {
  FullPaymentScreen: undefined;
  FullEnrollmentScreen: undefined;
  LitePaymentScreen: undefined;
  FullPaymentCustomizationScreen: undefined;
  FullEnrollmentCustomizationScreen: undefined;
  FullEnrollmentButtonScreen: undefined;
  LitePaymentCustomizationScreen: undefined;
  LitePaymentFullScreen: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

const apiPublicKey = BusinessConfig.apiKey;
const mode = BusinessConfig.mode;
function FullPayScreen() {
  return (
    <TonderProvider
      config={{
        type: SDKType.INLINE,
        mode: mode,
        apiKey: apiPublicKey,
      }}
    >
      <FullPaymentScreen />
    </TonderProvider>
  );
}

function FullPayCustomScreen({}) {
  return (
    <TonderProvider
      config={{
        type: SDKType.INLINE,
        mode: mode,
        apiKey: apiPublicKey,
      }}
    >
      <FullPaymentCustomizationScreen />
    </TonderProvider>
  );
}

function FullPayBTNScreen({}) {
  return (
    <TonderProvider
      config={{
        type: SDKType.INLINE,
        mode: mode,
        apiKey: apiPublicKey,
      }}
    >
      <FullPaymentButtonScreen />
    </TonderProvider>
  );
}

function FullEnrollScreen() {
  return (
    <TonderProvider
      config={{
        type: SDKType.ENROLLMENT,
        mode: mode,
        apiKey: apiPublicKey,
      }}
    >
      <FullEnrollmentScreen />
    </TonderProvider>
  );
}

function FullEnrollCustomScreen({}) {
  return (
    <TonderProvider
      config={{
        type: SDKType.ENROLLMENT,
        mode: mode,
        apiKey: apiPublicKey,
      }}
    >
      <FullEnrollmentCustomizationScreen />
    </TonderProvider>
  );
}

function FullEnrollBTNScreen({}) {
  return (
    <TonderProvider
      config={{
        type: SDKType.ENROLLMENT,
        mode: mode,
        apiKey: apiPublicKey,
      }}
    >
      <FullEnrollmentButtonScreen />
    </TonderProvider>
  );
}

function LiteEnrollScreen({}) {
  return (
    <TonderProvider
      config={{
        type: SDKType.ENROLLMENT,
        mode: mode,
        apiKey: apiPublicKey,
      }}
    >
      <LiteEnrollmentScreen />
    </TonderProvider>
  );
}

function LiteEnrollUpdateCVVScreen({}) {
  return (
    <TonderProvider
      config={{
        type: SDKType.ENROLLMENT,
        mode: mode,
        apiKey: apiPublicKey,
      }}
    >
      <LiteEnrollmentUpdateCVVScreen />
    </TonderProvider>
  );
}

function LitePayScreen() {
  return (
    <TonderProvider
      config={{
        type: SDKType.LITE,
        mode: mode,
        apiKey: apiPublicKey,
      }}
    >
      <LitePaymentScreen />
    </TonderProvider>
  );
}

function LitePayCustomScreen({}) {
  return (
    <TonderProvider
      config={{
        type: SDKType.LITE,
        mode: mode,
        apiKey: apiPublicKey,
      }}
    >
      <LitePaymentCustomizationScreen />
    </TonderProvider>
  );
}

function LitePayFullScreen({}) {
  return (
    <TonderProvider
      config={{
        type: SDKType.LITE,
        mode: mode,
        apiKey: apiPublicKey,
      }}
    >
      <LitePaymentFullScreen />
    </TonderProvider>
  );
}

function LitePayWithCardScreen({}) {
  return (
    <TonderProvider
      config={{
        type: SDKType.LITE,
        mode: mode,
        apiKey: apiPublicKey,
      }}
    >
      <LitePaymentSavedCardsScreen />
    </TonderProvider>
  );
}
export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: '#0277FF' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
          }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="FullPaymentScreen" component={FullPayScreen} />
          <Stack.Screen
            name="FullPaymentButtonScreen"
            component={FullPayBTNScreen}
          />
          <Stack.Screen
            name="FullPaymentCustomizationScreen"
            component={FullPayCustomScreen}
          />
          <Stack.Screen
            name="FullEnrollmentScreen"
            component={FullEnrollScreen}
          />
          <Stack.Screen
            name="FullEnrollmentButtonScreen"
            component={FullEnrollBTNScreen}
          />
          <Stack.Screen
            name="FullEnrollmentCustomizationScreen"
            component={FullEnrollCustomScreen}
          />
          <Stack.Screen
            name="LiteEnrollmentScreen"
            component={LiteEnrollScreen}
          />

          <Stack.Screen name="LitePaymentScreen" component={LitePayScreen} />
          <Stack.Screen
            name="LitePaymentCustomizationScreen"
            component={LitePayCustomScreen}
          />
          <Stack.Screen
            name="LitePaymentFullScreen"
            component={LitePayFullScreen}
          />
          <Stack.Screen
            name="LitePaymentSavedCardsScreen"
            component={LitePayWithCardScreen}
          />
          <Stack.Screen
            name="LiteEnrollmentUpdateCVVScreen"
            component={LiteEnrollUpdateCVVScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
