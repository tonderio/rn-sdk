import type { IPaymentMethodResponse } from '../types';
import TonderError from '../shared/utils/errors';
import { HttpClient } from '../infrastructure';
import { ErrorKeyEnum } from '../shared';

export class PaymentMethodService {
  private readonly BASE_PATH = '/api/v1/payment_methods';
  private readonly DEFAULT_PAGE_SIZE = '10000';
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }
  /**
   * Fetches available payment methods
   * @param params Optional parameters for filtering payment methods
   * @throws {TonderError} If the request fails
   */
  async fetchPaymentMethods(
    params: Record<string, string> = {
      status: 'active',
      pagesize: this.DEFAULT_PAGE_SIZE,
    }
  ): Promise<IPaymentMethodResponse> {
    try {
      const queryString = new URLSearchParams(params).toString();

      return await this.http.get<IPaymentMethodResponse>(
        `${this.BASE_PATH}?${queryString}`
      );
    } catch (error) {
      throw new TonderError({
        code: ErrorKeyEnum.FETCH_PAYMENT_METHODS_ERROR,
        details: error,
      });
    }
  }
}
