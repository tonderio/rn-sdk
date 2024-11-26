import type { GetBusinessResponse } from '../types';
import TonderError from '../shared/utils/errors';
import { HttpClient } from '../infrastructure';
import { ErrorKeyEnum } from '../shared';

export class BusinessService {
  private readonly BASE_PATH = '/api/v1/payments/business';
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  /**
   * Fetches business information from the API
   * @param signal Optional AbortSignal for request cancellation
   * @returns Business information
   * @throws {TonderError} If the request fails
   */
  async fetchBusiness(signal?: AbortSignal): Promise<GetBusinessResponse> {
    try {
      return await this.http.get<GetBusinessResponse>(
        `${this.BASE_PATH}/${this.http.getApiKey()}`,
        { signal } as RequestInit
      );
    } catch (error) {
      throw new TonderError({
        code: ErrorKeyEnum.FETCH_BUSINESS_ERROR,
        details: error,
      });
    }
  }
}
