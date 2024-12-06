import React, { useEffect } from 'react';
import { useCollectContainer } from 'skf-rnad';
import InnerProvider from '../InnerProvider';
import type { ITonderContext } from '../../../types';
import { SDKType } from '../../../types';

interface SkyflowContainerWrapperProps {
  children: React.ReactNode;
  contextValue: ITonderContext<SDKType>;
}

const SkyflowContainerWrapper = ({
  children,
  contextValue,
}: SkyflowContainerWrapperProps) => {
  const container = useCollectContainer();

  useEffect(() => {
    if (contextValue?.state?.isCreated && container) {
      contextValue.uiWrapper.setSkyFlowContainer(container);
    }
  }, [
    contextValue?.state?.isCreated,
    contextValue.sdk,
    contextValue.uiWrapper,
  ]);

  return (
    <InnerProvider container={container} contextValue={contextValue}>
      {children}
    </InnerProvider>
  );
};

export default SkyflowContainerWrapper;
