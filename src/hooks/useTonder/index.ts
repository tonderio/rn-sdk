import useTonderContext from '../../ui/providers/TonderProvider/hook';
import { SDKType } from '../../types';

const useTonder = <T extends SDKType>() => {
  const { sdk } = useTonderContext<T>();

  return sdk;
};

export default useTonder;
