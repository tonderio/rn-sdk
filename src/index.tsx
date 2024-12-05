import { NativeModules, Platform } from 'react-native';

const LINKING_ERROR =
  `The package '@tonder.io/rn-sdk' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const RnSdk = NativeModules.RnSdk
  ? NativeModules.RnSdk
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      }
    );

export function multiply(a: number, b: number): Promise<number> {
  return RnSdk.multiply(a, b);
}

export * from './ui/components/Input/CardHolderInput';
export * from './ui/components/Input/CardExpirationMonthInput';
export * from './ui/components/Input/CardExpirationDateInput';
export * from './ui/components/Input/CardExpirationYearInput';
export * from './ui/components/Input/CardCVVInput';
export * from './ui/components/Input/CardNumberInput';
export { default as TonderProvider } from './ui/providers/TonderProvider';
export { default as useTonder } from './hooks/useTonder';
export { default as TonderPayment } from './ui/features/TonderPayment';
export { default as TonderEnrollment } from './ui/features/TonderEnrollment';
export { default as TonderError } from './shared/utils/errors';
export * from './types';
