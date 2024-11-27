import type {
  IStartCheckoutRequest,
  IStartCheckoutIdRequest,
  ICreateOrderResponse,
  ICreatePaymentResponse,
  ICheckoutResponse,
  ICreatePaymentRequest,
  ICreateOrderRequest,
} from '../types';
import TonderError from '../shared/utils/errors';
import { HttpClient } from '../infrastructure';
import { ErrorKeyEnum } from '../shared';

export class CheckoutService {
  private readonly BASE_PATHS = {
    orders: '/api/v1/orders/',
    payments: '/api/v1/business',
    checkout: '/api/v1/checkout-router/',
  } as const;

  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }
  /**
   * Creates a new order
   * @param orderItems Order data to create
   * @throws {TonderError} If order creation fails
   */
  async createOrder(
    orderItems: ICreateOrderRequest
  ): Promise<ICreateOrderResponse> {
    try {
      this.validateOrderData(orderItems);

      return await this.http.post<ICreateOrderResponse>(
        this.BASE_PATHS.orders,
        orderItems
      );
    } catch (error) {
      throw new TonderError({
        code: ErrorKeyEnum.CREATE_ORDER_ERROR,
        details: error,
      });
    }
  }

  /**
   * Creates a new payment
   * @param paymentItems Payment data to create
   * @throws {TonderError} If payment creation fails
   */
  async createPayment(
    paymentItems: ICreatePaymentRequest
  ): Promise<ICreatePaymentResponse> {
    try {
      this.validatePaymentData(paymentItems);

      return await this.http.post<ICreatePaymentResponse>(
        `${this.BASE_PATHS.payments}/${paymentItems.business_pk}/payments/`,
        paymentItems
      );
    } catch (error) {
      throw new TonderError({
        code: ErrorKeyEnum.CREATE_PAYMENT_ERROR,
        details: error,
      });
    }
  }

  /**
   * Starts or continues a checkout process
   * @param routerItems Checkout data or checkout ID
   * @param deviceSessionId Optional device session ID for MercadoPago
   * @throws {TonderError} If checkout process fails
   */
  async startCheckoutRouter(
    routerItems: IStartCheckoutRequest | IStartCheckoutIdRequest,
    deviceSessionId?: string
  ): Promise<ICheckoutResponse> {
    try {
      const payload = {
        ...routerItems,
        ...(deviceSessionId ? { mp_device_session_id: deviceSessionId } : {}),
      };

      return await this.http.post<ICheckoutResponse>(
        this.BASE_PATHS.checkout,
        payload
      );
    } catch (error) {
      throw new TonderError({
        code: ErrorKeyEnum.START_CHECKOUT_ERROR,
        details: error,
      });
    }
  }

  /**
   * Validates order data before creation
   * @throws {TonderError} If order data is invalid
   */
  private validateOrderData(orderItems: ICreateOrderRequest): void {
    if (!orderItems.business) {
      throw new TonderError({ code: ErrorKeyEnum.BUSINESS_ID_REQUIRED });
    }

    if (!orderItems.amount || orderItems.amount <= 0) {
      throw new TonderError({ code: ErrorKeyEnum.INVALID_AMOUNT });
    }

    if (!orderItems.items?.length) {
      throw new TonderError({ code: ErrorKeyEnum.INVALID_ITEMS });
    }
  }

  /**
   * Validates payment data before creation
   * @throws {TonderError} If payment data is invalid
   */
  private validatePaymentData(paymentItems: ICreatePaymentRequest): void {
    if (!paymentItems.business_pk) {
      throw new TonderError({ code: ErrorKeyEnum.BUSINESS_ID_REQUIRED });
    }

    if (!paymentItems.client_id) {
      throw new TonderError({ code: ErrorKeyEnum.CLIENT_ID_REQUIRED });
    }

    if (!paymentItems.amount || paymentItems.amount <= 0) {
      throw new TonderError({ code: ErrorKeyEnum.INVALID_AMOUNT });
    }
  }
}
