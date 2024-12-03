import type {
  ICard,
  ICustomerResponse,
  IPaymentMethod,
  ISDKBaseConfig,
} from '../../types';
import { ServiceManager } from '../../infrastructure';
import TonderError from '../../shared/utils/errors';
import { ErrorKeyEnum } from '../../shared';

class Tonder {
  private config: ISDKBaseConfig;
  public service: ServiceManager;
  private state: any;
  private subscribers: (() => void)[] = [];
  private eventListeners: Map<string, Set<(data: any) => void>> = new Map();

  constructor(config: ISDKBaseConfig) {
    this.initData(config);
  }

  private initData(config) {
    this.service = new ServiceManager(config);
    this.config = {
      ...config,
    };
    this.state = {};
    this.eventListeners = new Map();
  }

  getConfig(): Readonly<ISDKBaseConfig> {
    return Object.freeze({ ...this.config });
  }
  getService(): ServiceManager {
    return this.service;
  }

  public getCustomerAuthToken(): string {
    const customerData: ICustomerResponse | undefined = this.state.customerData;
    if (!customerData?.auth_token) {
      throw new TonderError({
        code: ErrorKeyEnum.CUSTOMER_AUTH_TOKEN_NOT_VALID,
      });
    }
    return customerData.auth_token!;
  }

  public getSecureToken(): string {
    return this.state.secureToken;
  }

  public getBusinessPK(): string {
    return this.state.merchantData?.business?.pk;
  }

  public getState = (): Readonly<any> => {
    return Object.freeze({ ...this.state });
  };

  public setState = (newState: Partial<any>): void => {
    this.state = { ...this.state, ...newState };
    this.notifySubscribers();
  };

  public updateUIState({
    card,
    paymentMethod,
    selectedMethod,
    cards,
    paymentMethods,
    saveCard,
  }: {
    card?: string;
    paymentMethod?: string;
    selectedMethod?: string;
    cards?: ICard[];
    paymentMethods?: IPaymentMethod[];
    saveCard?: boolean;
  }) {
    const selected_data = {
      ...(selectedMethod && selectedMethod !== ''
        ? {
            ...(card && card !== ''
              ? { card, payment_method: '' }
              : paymentMethod && paymentMethod !== ''
                ? { payment_method: paymentMethod, card: '' }
                : { card: '', payment_method: '' }),
          }
        : {}),
    };
    const new_state = {
      uiData: {
        ...(this.state.uiData || {}),
        ...selected_data,
        ...(selectedMethod ? { selectedMethod } : {}),
        ...(saveCard !== undefined ? { saveCard } : {}),
        ...(cards ? { cards } : {}),
        ...(paymentMethods ? { paymentMethods } : {}),
      },
    };

    this.setState(new_state);
  }

  public subscribe(callback: () => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    };
  }

  public emit = (eventName: string, data: any): void => {
    try {
      const listeners = this.eventListeners.get(eventName);
      if (listeners) {
        listeners.forEach((listener) => listener(data));
      }
    } catch (e) {
      console.error('[Tonder | emit | ERROR]', e);
    }
  };

  public on(eventName: string, listener: (data: any) => void): () => void {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, new Set());
    }
    this.eventListeners.get(eventName)!.add(listener);

    return () => {
      this.eventListeners.get(eventName)?.delete(listener);
    };
  }

  private notifySubscribers() {
    this.subscribers.forEach((callback) => callback());
  }

  public reset() {
    // this.subscribers = [];
    this.eventListeners.clear();
    this.initData(this.config);
    this.notifySubscribers();
  }
}

export default Tonder;
