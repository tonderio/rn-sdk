import { HttpClient } from './HttpClient';
import type { ISDKBaseConfig } from '../types';
import {
  CardService,
  CheckoutService,
  CustomerService,
  OpenPayService,
  PaymentMethodService,
  SkyflowService,
  TokenService,
  BusinessService,
  MercadoPagoService,
  TransactionService,
} from '../services';

export class ServiceManager {
  private readonly http: HttpClient;

  readonly business: BusinessService;
  readonly card: CardService;
  readonly checkout: CheckoutService;
  readonly customer: CustomerService;
  readonly paymentMethod: PaymentMethodService;
  readonly skyflow: SkyflowService;
  readonly token: TokenService;
  readonly openPay: OpenPayService;
  readonly mercadoPago: MercadoPagoService;
  readonly transaction: TransactionService;

  constructor(config: ISDKBaseConfig) {
    this.http = new HttpClient({
      apiKey: config.apiKey,
      mode: config.mode,
    });

    this.business = new BusinessService(this.http);
    this.card = new CardService(this.http);
    this.checkout = new CheckoutService(this.http);
    this.customer = new CustomerService(this.http);
    this.paymentMethod = new PaymentMethodService(this.http);
    this.skyflow = new SkyflowService(this.http);
    this.token = new TokenService(this.http);
    this.openPay = new OpenPayService();
    this.mercadoPago = new MercadoPagoService();
    this.transaction = new TransactionService(this.http);
  }

  public cleanup(): void {
    this.http.cleanup();
  }
}
