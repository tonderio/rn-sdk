// @ts-nocheck
import React from 'react';
import { ITonderContext, SDKType } from '../../../types';
import { tonderContext } from '../TonderProvider/context';

interface InnerProviderProps {
  children: React.ReactNode;
  container: any;
  contextValue: ITonderContext<SDKType>;
}

const InnerProvider = ({ children, contextValue }: InnerProviderProps) => {
  return (
    <tonderContext.Provider
      value={{
        ...contextValue,
      }}
    >
      {children}
    </tonderContext.Provider>
  );
};

export default InnerProvider;
