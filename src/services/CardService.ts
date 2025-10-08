import type {
  ICardsSummaryResponse,
  ICustomerCardsResponse,
  ISaveCardResponse,
  ISaveCardSkyflowRequest,
} from '../types';
import TonderError from '../shared/utils/errors';
import { HttpClient } from '../infrastructure';
import { MESSAGES_EN, ErrorKeyEnum } from '../shared';

export class CardService {
  private readonly BASE_PATH = '/api/v1/business';
  private readonly http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }
  /**
   * Fetches customer cards from the API
   * @throws {TonderError} If the request fails
   */
  async fetchCustomerCards(
    customerToken: string,
    secureToken: string,
    businessId: string | number
  ): Promise<ICustomerCardsResponse> {
    this.validateSecureToken(secureToken);
    try {
      return await this.http.get<ICustomerCardsResponse>(
        `${this.BASE_PATH}/${businessId}/cards/`,
        {
          headers: this.buildAuthHeaders(secureToken, customerToken),
        }
      );
    } catch (error) {
      throw new TonderError({
        code: ErrorKeyEnum.FETCH_CARDS_ERROR,
        details: error,
      });
    }
  }

  /**
   * Saves a customer card
   * @throws {TonderError} If the request fails
   */
  async saveCustomerCard(
    customerToken: string,
    secureToken: string,
    businessId: string | number,
    cardData: ISaveCardSkyflowRequest
  ): Promise<ISaveCardResponse> {
    this.validateSecureToken(secureToken);

    try {
      return await this.http.post<ISaveCardResponse>(
        `${this.BASE_PATH}/${businessId}/cards/`,
        cardData,
        {
          headers: this.buildAuthHeaders(secureToken, customerToken),
        }
      );
    } catch (error) {
      throw new TonderError({
        code: ErrorKeyEnum.SAVE_CARD_ERROR,
        details: error,
      });
    }
  }

  /**
   * Removes a customer card
   * @throws {TonderError} If the request fails
   */
  async removeCustomerCard(
    customerToken: string,
    secureToken: string,
    skyflowId: string,
    businessId: string | number
  ): Promise<string> {
    this.validateSecureToken(secureToken);

    try {
      await this.http.delete(
        `${this.BASE_PATH}/${businessId}/cards/${skyflowId}/`,
        {
          headers: this.buildAuthHeaders(secureToken, customerToken),
        }
      );

      return MESSAGES_EN.REMOVE_CARD;
    } catch (error) {
      return MESSAGES_EN.REMOVE_CARD;
      // throw new TonderError({
      //   code: ErrorKeyEnum.REMOVE_CARD_ERROR,
      //   details: error,
      // });
    }
  }

  /**
   * get a card summary
   * @throws {TonderError} If the request fails
   */
  async getCardSummary(
    customerToken: string,
    secureToken: string,
    skyflowId: string,
    businessId: string | number
  ): Promise<ICardsSummaryResponse> {
    this.validateSecureToken(secureToken);

    try {
      return await this.http.get(
        `${this.BASE_PATH}/${businessId}/cards/${skyflowId}/summary`,
        {
          headers: this.buildAuthHeaders(secureToken, customerToken),
        }
      );
    } catch (error) {
      throw new TonderError({
        code: ErrorKeyEnum.SAVE_CARD_ERROR,
        details: error,
      });
    }
  }

  private validateSecureToken(token: string): void {
    if (!token) {
      throw new TonderError({ code: ErrorKeyEnum.SECURE_TOKEN_INVALID });
    }
  }

  /**
   * Builds authentication headers for card operations
   */
  private buildAuthHeaders(
    secureToken: string,
    customerToken: string
  ): Record<string, string> {
    return {
      'Authorization': `Bearer ${secureToken}`,
      'User-token': customerToken,
    };
  }
}
