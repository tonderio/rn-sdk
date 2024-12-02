import type {
  IBaseResponse,
  IEnrollment,
  ISaveCardResponse,
  SDKOptions,
} from '../../types';
import TonderError from '../../shared/utils/errors';
import { ErrorKeyEnum, MESSAGES_ES } from '../../shared';
import React from 'react';
import { executeCallback } from '../../shared/utils/common';
import BaseEnrollment from '../../core/BaseEnrollment';
import { SDKType } from '../../types';
import Tonder from '../../core/Tonder';

export class EnrollmentContainer implements IEnrollment {
  #tonderClient: Tonder;
  #baseSDK: BaseEnrollment;

  constructor(
    tonderClient: Tonder,
    setSkyflowConfig: React.Dispatch<React.SetStateAction<any>>
  ) {
    this.#tonderClient = tonderClient;
    this.#baseSDK = new BaseEnrollment(
      tonderClient,
      tonderClient.getState,
      tonderClient.setState,
      setSkyflowConfig
    );
  }

  public create = async (
    data: SDKOptions<SDKType.ENROLLMENT>
  ): Promise<{ error?: TonderError }> => {
    return await this.#baseSDK.create(data);
  };

  public saveCustomerCard = async(): Promise<IBaseResponse<ISaveCardResponse>> => {
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
  }

  reset = (): void => {
    this.#tonderClient.reset();
  };
}
