import type {
  IBaseResponse,
  ICardsSummaryResponse,
  ICustomerCardsResponse,
  IEnrollment,
  ISaveCardResponse,
  SDKOptions,
} from '../../types';
import TonderError from '../../shared/utils/errors';
import { ErrorKeyEnum, MESSAGES_ES } from '../../shared';
import { executeCallback } from '../../shared/utils/common';
import BaseEnrollment from '../../core/BaseEnrollment';
import { SDKType } from '../../types';
import Tonder from '../../core/Tonder';
import { getCardType } from '../../shared/catalog/cardBrandCatalog';

export class EnrollmentContainer implements IEnrollment {
  #tonderClient: Tonder;
  #baseSDK: BaseEnrollment;

  constructor(tonderClient: Tonder) {
    this.#tonderClient = tonderClient;
    this.#baseSDK = new BaseEnrollment(
      tonderClient,
      tonderClient.getState,
      tonderClient.setState
    );
  }

  public create = async (
    data: SDKOptions<SDKType.ENROLLMENT>
  ): Promise<{ error?: TonderError }> => {
    return await this.#baseSDK.create(data);
  };

  public saveCustomerCard = async (): Promise<
    IBaseResponse<ISaveCardResponse>
  > => {
    const currentCallbacks = this.#baseSDK.getState().callbacks;
    try {
      await this.#baseSDK.setState({
        isProcessing: true,
      });
      await executeCallback({
        callbacks: currentCallbacks,
        callback: 'beforeSave',
        throwError: true,
      });

      const cardFields = await this.#baseSDK
        .getState()
        .skyflowContainer.collect();
      const card_data = cardFields?.records[0]?.fields;
      const response = await this.#baseSDK.saveCard(card_data.skyflow_id);

      await this.#baseSDK.setState({
        isProcessing: false,
      });
      await executeCallback({
        callbacks: currentCallbacks,
        callback: 'onFinishSave',
        data: { response },
      });
      return { response };
    } catch (error) {
      let err;
      let message = MESSAGES_ES.SAVE_CARD_PROCESS_ERROR;
      if (
        (error && 'message' in error ? error?.message : '').includes(
          'Incomplete inputs'
        )
      ) {
        err = new TonderError({
          code: ErrorKeyEnum.INVALID_CARD_DATA,
          details: error,
        });
        message = MESSAGES_ES.INVALID_CARD_DATA;
      } else {
        err =
          error instanceof TonderError
            ? error
            : new TonderError({
                code: ErrorKeyEnum.SAVE_CARD_PROCESS_ERROR,
                details: error,
              });
      }
      await this.#baseSDK.setState({
        error: error as TonderError,
        isProcessing: false,
        message: message,
      });

      await executeCallback({
        callbacks: currentCallbacks,
        callback: 'onFinishSave',
        data: { error: err },
      });
      return { error: err };
    }
  };

  reset = (): void => {
    this.#tonderClient.reset();
  };

  public getCardSummary = async (
    id: string
  ): Promise<IBaseResponse<ICardsSummaryResponse>> => {
    try {
      const response = await this.#baseSDK.getCardSummary(id);
      return { response };
    } catch (error) {
      return { error: error as TonderError };
    }
  };

  public getCustomerCards = async (): Promise<
    IBaseResponse<ICustomerCardsResponse>
  > => {
    try {
      const merchantId = this.#tonderClient.getBusinessPK();
      const secureToken: string = this.#tonderClient.getSecureToken();
      const customer_auth_token: string | undefined =
        this.#tonderClient.getCustomerAuthToken();

      const response = await this.#tonderClient
        .getService()
        .card.fetchCustomerCards(customer_auth_token, secureToken, merchantId);

      return {
        response: {
          ...response,
          cards: response.cards.map((ic) => ({
            ...ic,
            icon: getCardType(ic.fields.card_scheme),
          })),
        },
      };
    } catch (error) {
      return { error: error as TonderError };
    }
  };
}
