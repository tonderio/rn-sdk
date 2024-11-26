import { StyleSheet } from 'react-native';

// TODO: CHECK INTER FAMILY
const DEFAULT_SKYFLOW_INPUT_STYLES = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 12,
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderRadius: 5,
    color: '#1d1d1d',
    backgroundColor: 'white',
    // fontFamily: 'Inter',
  },
  complete: {
    color: '#4caf50',
  },
  invalid: {
    borderWidth: 1,
    borderColor: 'f44336',
  },
  empty: {},
  focus: {},
});

const DEFAULT_SKYFLOW_lABEL_STYLES = {
  base: {
    fontSize: 12,
    fontWeight: 500,
    // fontFamily: 'Inter',
  },
};

const DEFAULT_SKYFLOW_ERROR_TEXT_STYLES = StyleSheet.create({
  base: {
    fontWeight: 500,
    color: '#f44336',
    marginTop: 0,
    paddingVertical: 0,
    fontSize: 12,
  },
});

const SKYFLOW_HIDDEN_ERROR_TEXT_STYLES = {
  base: {
    color: 'transparent',
    display: 'none',
    // fontFamily: 'Inter',
  },
};

export {
  DEFAULT_SKYFLOW_INPUT_STYLES,
  DEFAULT_SKYFLOW_lABEL_STYLES,
  DEFAULT_SKYFLOW_ERROR_TEXT_STYLES,
  SKYFLOW_HIDDEN_ERROR_TEXT_STYLES,
};
