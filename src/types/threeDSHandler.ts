import type { ICheckoutResponse, ITransaction } from '.';
import type TonderError from '../shared/utils/errors';

export interface IThreeDSHandler {
  verifyTransaction(): Promise<ITransaction>;
  handle3DS(
    payload: ICheckoutResponse,
    returnURL: string,
    onFinish: (response: ITransaction | TonderError) => Promise<void>
  ): void;
}
