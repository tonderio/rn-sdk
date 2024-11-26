import type { IGetSecureTokenResponse } from '../types';
import TonderError from '../shared/utils/errors';
import { HttpClient } from '../infrastructure';
import { ErrorKeyEnum } from '../shared';

export class TokenService {
  private readonly BASE_PATH = '/api/secure-token/';
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }
  /**
   * Gets a secure token for authenticated operations
   * @param secretApiKey Authorization token
   * @param signal Optional AbortSignal for request cancellation
   * @throws {TonderError} If secure token fetch fails
   */
  async getSecureToken(
    secretApiKey: string,
    signal?: AbortSignal
  ): Promise<IGetSecureTokenResponse> {
    try {
      this.validateToken(secretApiKey);

      return await this.http.post<IGetSecureTokenResponse>(this.BASE_PATH, {}, {
        headers: {
          Authorization: `Token ${secretApiKey}`,
        },
        signal,
      } as RequestInit);
    } catch (error) {
      throw new TonderError({
        code: ErrorKeyEnum.SECURE_TOKEN_ERROR,
        details: error,
      });
    }
  }

  private validateToken(token: string): void {
    if (!token) {
      throw new TonderError({ code: ErrorKeyEnum.INVALID_SECRET_API_KEY });
    }
  }
}
