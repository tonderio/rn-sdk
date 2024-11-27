// @ts-nocheck

export class OpenPayService {
  async getDeviceSessionId(
    merchantId: string,
    publicKey: string,
    isSandbox: boolean = true,
    signal?: AbortSignal
  ): Promise<string> {
    // var openpay = new Openpay(' your merchant id ', ' your private key ', [ isProduction ]);
    // if (typeof global.OpenPay === 'undefined') {
    //   throw new Error('OpenPay scripts must be loaded first');
    // }
    //
    // const openpay = global.OpenPay;
    // openpay.setId(merchantId);
    // openpay.setApiKey(publicKey);
    // openpay.setSandboxMode(isSandbox);
    // return await openpay.deviceData.setup({ signal });
    return new Promise((r) => r(''));
  }
}
