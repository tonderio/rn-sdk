import React from 'react';
import { ThreeDSWebView } from '../../components/WebView/ThreeDSWebView';
import { SkyflowProvider } from 'skyflow-react-native';
import useTonderContext from './hook';

const TonderProviderWrapper: React.FC<
  React.PropsWithChildren<{
    threeDSConfig: {
      url?: string;
      onComplete?: () => void;
      returnURL?: string;
    };
  }>
> = ({ threeDSConfig, children }) => {
  const { state } = useTonderContext();
  return (
    <SkyflowProvider config={state?.skyflowConfig}>
      {!!threeDSConfig.url && (
        <ThreeDSWebView
          url={threeDSConfig.url}
          onComplete={() => {
            threeDSConfig.onComplete?.();
          }}
          returnURL={threeDSConfig.returnURL!}
        />
      )}
      {children}
    </SkyflowProvider>
  );
};

export default React.memo(TonderProviderWrapper);
