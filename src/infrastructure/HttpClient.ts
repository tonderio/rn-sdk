import type { IApiConfig } from '../types';
import TonderError from '../shared/utils/errors';
import { TONDER_URL_BY_MODE, ErrorKeyEnum } from '../shared';

export class HttpClient {
  private readonly baseUrl: string;
  protected readonly apiKey: string;
  private abortController: AbortController;

  constructor(config: IApiConfig) {
    this.validateConfig(config);
    this.apiKey = config.apiKey;
    this.baseUrl = TONDER_URL_BY_MODE[config.mode];
    this.abortController = new AbortController();
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  private validateConfig(config: IApiConfig): void {
    if (!config.apiKey) {
      throw new TonderError({
        code: ErrorKeyEnum.MERCHANT_CREDENTIAL_REQUIRED,
      });
    }
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': `Token ${this.apiKey}`,
        ...options.headers,
      } as HeadersInit);

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: headers,
        signal: options.signal || this.abortController.signal,
      } as RequestInit);
      if (!response.ok) {
        throw await this.handleRequestError(response);
      }
      if (response.status === 204) {
        return {} as T;
      }
      return response.json();
    } catch (error) {
      throw this.handleError(error);
    }
  }

  get<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  post<T>(
    endpoint: string,
    data: unknown,
    options: RequestInit = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  delete<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }
  private async handleRequestError(response: Response): Promise<never> {
    const errorData = await response.json().catch(() => ({}));

    throw new TonderError({
      code: `HTTP_${response.status}`,
      details: errorData,
      message: errorData.detail || 'Request failed',
    });
  }

  private handleError(error: unknown): never {
    if (error instanceof TonderError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new TonderError({
          code: ErrorKeyEnum.REQUEST_ABORTED,
          details: error,
        });
      }

      throw new TonderError({
        code: ErrorKeyEnum.REQUEST_FAILED,
        details: error,
      });
    }

    throw new TonderError({ code: ErrorKeyEnum.UNKNOWN_ERROR, details: error });
  }

  /**
   * Cleanup method to abort any pending requests
   */
  public cleanup(): void {
    this.abortController.abort();
  }
}
