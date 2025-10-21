import { StyleSheet } from 'react-native';

// TODO: CHECK INTER FAMILY
const DEFAULT_INPUT_CONTAINER_STYLES = StyleSheet.create({
  base: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flex: 1,
    marginVertical: 5,
  },
});

const DEFAULT_PAYMENT_CONTAINER = StyleSheet.create({
  base: {
    backgroundColor: '#F9F9F9',
    borderWidth: 1,
    borderColor: '#e3e3e3',
    width: '100%',
    marginBottom: 10,
    minHeight: 210,
  },
});
export { DEFAULT_INPUT_CONTAINER_STYLES, DEFAULT_PAYMENT_CONTAINER };
