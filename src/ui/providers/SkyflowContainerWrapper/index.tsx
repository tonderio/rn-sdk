import { useEffect } from 'react';
import { useCollectContainer } from 'skyflow-react-native';
import useTonderContext from '../TonderProvider/hook';
import { SDKType } from '@tonder.io/rn-sdk';

const SkyflowContainerWrapper = () => {
  const { uiWrapper, sdk, state } = useTonderContext<SDKType.INLINE>();
  const container = useCollectContainer();
  const savedCardContainer = useCollectContainer();

  useEffect(() => {
    if (state?.isCreated && container) {
      uiWrapper.setSkyFlowContainer(undefined);
      setTimeout(() => {
        uiWrapper.setSkyFlowContainer(container);
      }, 20);
    }
  }, [
    state?.isCreated,
    sdk,
    uiWrapper,
    state?.skyflowConfig,
    container,
    savedCardContainer,
  ]);

  return null;
};

export default SkyflowContainerWrapper;
