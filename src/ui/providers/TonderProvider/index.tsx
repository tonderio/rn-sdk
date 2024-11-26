// @ts-nocheck
import React, { useEffect, useMemo, useState } from 'react';
import Tonder from '../../../core/Tonder';
import type { ISDKBaseConfig, SDKInstance } from '../../../types';
import { SDKType } from '../../../types';
import { SkyflowProvider } from 'skyflow-react-native';
import SkyflowContainerWrapper from '../SkyflowContainerWrapper';
import { ThreeDSWebView } from '../../components/WebView/ThreeDSWebView';
import { EnrollmentContainer } from '../../../core/EnrollmentContainer';
import PaymentLiteContainer from '../../../core/PaymentLiteContainer';
import PaymentInlineContainer from '../../../core/PaymentInlineContainer';
import uiWrapper from './uiWrapper';
import { tonderContext } from './context';

export interface ITonderProvider {
  config: ISDKBaseConfig;
}

const TonderProvider: React.FC<React.PropsWithChildren<ITonderProvider>> = <
  T extends SDKType,
>({
  children,
  config,
}) => {
  const [skyflowConfig, setSkyflowConfig] = useState<any | null>(null);
  const [state, setState] = useState<Readonly<any>>(() => {});
  const [threeDSConfig, setThreeDSConfig] = useState<{
    url?: string;
    onComplete?: () => void;
    returnURL?: string;
  }>({});

  const tonder = useMemo(() => new Tonder(config), [config]);
  const sdk: SDKInstance<T> = useMemo(() => {
    if (config.type === SDKType.ENROLLMENT) {
      return new EnrollmentContainer(
        tonder,
        setSkyflowConfig
      ) as SDKInstance<T>;
    }
    if (config.type === SDKType.LITE) {
      return new PaymentLiteContainer(
        tonder,
        setSkyflowConfig
      ) as SDKInstance<T>;
    }
    return new PaymentInlineContainer(
      tonder,
      setSkyflowConfig
    ) as SDKInstance<T>;
  }, [tonder, setSkyflowConfig]);
  const uiSDKWrapper = useMemo(() => uiWrapper(tonder), [tonder]);

  useEffect(() => {
    const unsubscribe = tonder.subscribe(() => {
      setState(tonder.getState());
    });

    return () => {
      unsubscribe();
    };
  }, [tonder]);

  useEffect(() => {
    if (!tonder) return;

    const unsubscribeShow = tonder.on(
      'show3DS',
      ({ url, onComplete, returnURL }) => {
        setThreeDSConfig({ url, onComplete, returnURL });
      }
    );
    const unsubscribeHide = tonder.on('hide3DS', ({}) => {
      setThreeDSConfig({ url: '' });
    });

    return () => {
      unsubscribeShow();
      unsubscribeHide();
    };
  }, [tonder]);

  const contextValue = useMemo(
    () => ({
      sdk: sdk as SDKInstance<T>,
      uiWrapper: uiSDKWrapper,
      state,
    }),
    [sdk, state, uiSDKWrapper]
  );

  return (
    <tonderContext.Provider value={contextValue}>
      <SkyflowProvider config={skyflowConfig}>
        <SkyflowContainerWrapper contextValue={contextValue}>
          <ThreeDSWebView
            url={threeDSConfig.url}
            onComplete={() => {
              threeDSConfig.onComplete?.();
            }}
            returnURL={threeDSConfig.returnURL!}
          />
          {children}
        </SkyflowContainerWrapper>
      </SkyflowProvider>
    </tonderContext.Provider>
  );
};

export default React.memo(TonderProvider);
