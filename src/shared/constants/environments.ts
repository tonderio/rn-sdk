const TONDER_URL_BY_MODE = Object.freeze({
  production: 'https://app.tonder.io',
  sandbox: 'https://sandbox.tonder.io',
  stage: 'https://stage.tonder.io',
  development: 'http://192.168.68.102:8000',
});

const getPayFlowLoadingUrlByMode = (mode: string) => {
  if (mode === 'production') {
    return 'https://payflow.tonder.io/loading';
  } else if (mode === 'stage') {
    return 'https://stage-payflow.tonder.io/loading';
  }
  return 'https://dev-payflow.tonder.io/loading';
};

const getStaticAssetsUrlByMode = (mode: string) => {
  if (mode === 'production') {
    return 'https://d35a75syrgujp0.cloudfront.net';
  }
  return 'https://static.staging.tonder.io';
};

export {
  TONDER_URL_BY_MODE,
  getPayFlowLoadingUrlByMode,
  getStaticAssetsUrlByMode,
};
