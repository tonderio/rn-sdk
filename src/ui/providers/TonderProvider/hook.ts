// @ts-nocheck
import { useContext } from 'react';
import { ITonderContext, SDKType } from '../../../types';
import { tonderContext } from './context';

const useTonderContext = <T extends SDKType>(): ITonderContext<T> => {
  return useContext(tonderContext);
};

export default useTonderContext;
