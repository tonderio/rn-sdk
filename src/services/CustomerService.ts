import type { ICustomer, ICustomerResponse } from '../types';
import TonderError from '../shared/utils/errors';
import { HttpClient } from '../infrastructure';
import { ErrorKeyEnum } from '../shared';

export class CustomerService {
  private readonly BASE_PATH = '/api/v1/customer/';
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }
  /**
   * Registers a new customer or fetches existing one
   * @param customer Customer data
   * @param signal Optional AbortSignal for request cancellation
   * @throws {TonderError} If registration/fetch fails or validation fails
   */
  async registerOrFetchCustomer(
    customer: ICustomer,
    signal?: AbortSignal
  ): Promise<ICustomerResponse> {
    try {
      this.validateCustomerData(customer);

      return await this.http.post<ICustomerResponse>(this.BASE_PATH, customer, {
        signal,
      } as RequestInit);
    } catch (error) {
      console.error('CUSTOMER_OPERATION_ERROR', error);
      throw new TonderError({
        code: ErrorKeyEnum.CUSTOMER_OPERATION_ERROR,
        details: error,
      });
    }
  }

  /**
   * Validates customer data before processing
   * @throws {TonderError} If customer data is invalid
   */
  private validateCustomerData(customer: ICustomer): void {
    if (!customer.email) {
      throw new TonderError({ code: ErrorKeyEnum.INVALID_EMAIL });
    }

    if (!this.isValidEmail(customer.email)) {
      throw new TonderError({ code: ErrorKeyEnum.INVALID_EMAIL });
    }
  }

  /**
   * Validates email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
