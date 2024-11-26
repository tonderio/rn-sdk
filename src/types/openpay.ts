export interface IOpenPay {
  setId: (merchantId: string) => void;
  setApiKey: (apiKey: string) => void;
  setSandboxMode: (isSandbox: boolean) => void;
  deviceData: {
    setup: (options?: { signal?: AbortSignal }) => Promise<string>;
  };
}
