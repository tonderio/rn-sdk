import TonderError from '../shared/utils/errors';
import { HttpClient } from '../infrastructure';
import { ErrorKeyEnum } from '../shared';
import type { IConfig } from 'skyflow-react-native';
import { Env, LogLevel } from 'skyflow-react-native';

export class SkyflowService {
  private readonly BASE_PATH = '/api/v1/vault-token';
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  /**
   * Gets a Skyflow vault token
   * @param signal Optional AbortSignal for request cancellation
   * @throws {TonderError} If token fetch fails
   */
  async getVaultToken(signal?: AbortSignal): Promise<string> {
    try {
      const response = await this.http.get<{ token: string }>(this.BASE_PATH, {
        signal,
      } as RequestInit);

      if (!response.token) {
        throw new TonderError({ code: ErrorKeyEnum.INVALID_VAULT_TOKEN });
      }

      return response.token;
    } catch (error) {
      throw new TonderError({
        code: ErrorKeyEnum.VAULT_TOKEN_ERROR,
        details: error,
      });
    }
  }

  async createSkyflowConfig(merchantData: any): Promise<IConfig> {
    return {
      vaultID: merchantData.vault_id,
      vaultURL: merchantData.vault_url,
      options: {
        logLevel: LogLevel.ERROR,
        env: Env.DEV,
      },
      getBearerToken: async () => await this.getVaultToken(),
    };
  }
}
