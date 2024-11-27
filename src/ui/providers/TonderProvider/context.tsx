// @ts-nocheck
import React from 'react';
import type { ITonderContext, SDKInstance } from '../../../types';
import { SDKType } from '../../../types';
import { IUIWrapper } from './uiWrapper';

export const tonderContext = React.createContext<ITonderContext<SDKType>>({
  sdk: {} as SDKInstance<SDKType>,
  state: {},
  uiWrapper: {} as IUIWrapper,
});
