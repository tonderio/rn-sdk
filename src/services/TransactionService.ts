import type { ITransaction } from '../types';
import TonderError from '../shared/utils/errors';
import { HttpClient } from '../infrastructure';
import { ErrorKeyEnum } from '../shared';

export class TransactionService {
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  async verifyTransactionStatus(verifyUrl: string): Promise<ITransaction> {
    try {
      return await this.http.get<ITransaction>(`${verifyUrl}`);
    } catch (error) {
      throw new TonderError({
        code: ErrorKeyEnum.FETCH_TRANSACTION_ERROR,
        details: error,
      });
    }
  }
}
