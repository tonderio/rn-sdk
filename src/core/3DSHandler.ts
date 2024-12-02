// @ts-nocheck
import type {
  ICheckoutResponse,
  ISDKBaseConfig,
  IThreeDSHandler,
  ITransaction,
} from '../types';
import { ServiceManager } from '../infrastructure';
import TonderError from '../shared/utils/errors';
import { ErrorKeyEnum } from '../shared';
import { get } from '../shared/utils/stringUtils';

export class ThreeDSHandler implements IThreeDSHandler {
  protected readonly service: ServiceManager;
  private payload?: ICheckoutResponse;
  private onFinish: (response: ITransaction | TonderError) => Promise<void>;
  emit3DS: (eventName: string, data: any) => void;
  resumeCheckout: (checkoutId: string) => Promise<ICheckoutResponse>;
  returnURL?: string;
  private verifyURL: string;
  constructor(
    protected readonly config: ISDKBaseConfig,
    service: ServiceManager,
    emit3DS: (eventName: string, data: any) => void,
    resumeCheckout: (checkoutId: string) => Promise<ICheckoutResponse>
  ) {
    this.service = service;
    this.emit3DS = emit3DS;
    this.resumeCheckout = resumeCheckout;
    this.verifyURL = '';
  }

  public async verifyTransaction(): Promise<ITransaction> {
    try {
      return await this.service.transaction.verifyTransactionStatus(
        this.verifyURL!
      );
    } catch (error) {
      throw error;
    }
  }

  public async handle3DS(
    payload: ICheckoutResponse,
    returnURL: string,
    onFinish: (response: ITransaction | TonderError) => Promise<void>
  ): Promise<ITransaction> {
    try {
      this.onFinish = onFinish;
      this.returnURL = returnURL;
      await this.setPayload(payload);
      // const iframe = this.payload?.next_action?.iframe_resources?.iframe;
      // const threeDsChallenge = this.payload?.next_action?.three_ds_challenge;

      // if (iframe) {
      //   // TODO: PENDING IMPLEMENT FOR IFRAMES - LIKE WEB SDK - JOIN TO handleRedirect
      //   await this.loadIframe();
      //   return;
      // } else if (threeDsChallenge) {
      //   // TODO: PENDING IMPLEMENT FOR IFRAMES - LIKE WEB SDK - JOIN TO handleRedirect
      //   await this.handle3dsChallenge();
      //   return;
      // } else {
      //   return await this.handleRedirect();
      // }
      const url = this.getRedirectUrl();

      if (!url) {
        const url_verify = this.payload.actions.find(
          (it) => it.name === 'verify_transaction_status'
        );
        await this.saveVerifyTransactionUrl(get(url_verify, 'url'));
      } else {
        this.saveVerifyTransactionUrl();
      }

      if (
        this.payload?.provider === 'nuvei' &&
        ['Success', 'Authorized'].includes(this.payload?.transaction_status)
      ) {
        this.emit3DS('hide3DS', {});
        await this.removeVerifyTransactionUrl();
        await this.onFinish(this.payload);
      }

      const trx_response = await this.verifyTransaction();
      if (!url) {
        this.emit3DS('hide3DS', {});
        await this.removeVerifyTransactionUrl();
        await this.onFinish(trx_response!);
        return trx_response;
      }

      this.emit3DS('show3DS', {
        url,
        returnURL: this.returnURL,
        onComplete: async () => {
          const response = await this.verifyTransaction();
          const transaction_status = response?.transaction_status || '';
          if (
            response?.decline?.error_type === 'Hard' ||
            response?.checkout?.is_route_finished ||
            ['Success', 'Authorized'].includes(transaction_status) ||
            (['Pending'].includes(transaction_status) &&
              !!response?.payment_method?.is_apm)
          ) {
            this.emit3DS('hide3DS', {});
            await this.removeVerifyTransactionUrl();
            await this.onFinish(response!);
          } else {
            try {
              const retry_checkout = await this.resumeCheckout(
                response?.checkout?.id!
              );
              this.setPayload(retry_checkout);

              await this.handle3DS(
                retry_checkout,
                this.returnURL,
                this.onFinish
              );
            } catch (error) {
              this.emit3DS('hide3DS', {});
              await this.removeVerifyTransactionUrl();
              await this.onFinish(error as TonderError);
            }
          }
        },
      });
      return trx_response;
    } catch (error) {
      await this.removeVerifyTransactionUrl();
      const err = new TonderError({
        code: ErrorKeyEnum.THREEDS_REDIRECTION_ERROR,
        details: error,
      });
      this.emit3DS('hide3DS', {});
      await this.onFinish(err);
      throw err;
    }
  }
  private async setPayload(payload: ICheckoutResponse): Promise<void> {
    this.payload = payload;
  }

  private getRedirectUrl(): string | undefined {
    return this.payload?.next_action?.redirect_to_url?.url;
  }
  private async saveVerifyTransactionUrl(urlData?: string): Promise<void> {
    const url =
      urlData ||
      this.payload?.next_action?.redirect_to_url
        ?.verify_transaction_status_url ||
      this.payload?.next_action?.iframe_resources
        ?.verify_transaction_status_url;

    if (url) {
      this.verifyURL = url;
    }
  }

  private async removeVerifyTransactionUrl(): Promise<void> {
    this.verifyURL = '';
  }

  private async loadIframe() {}
  private async handle3dsChallenge() {}
}
