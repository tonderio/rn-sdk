import TonderError from '../../shared/utils/errors';
import { MESSAGES_ES, ErrorKeyEnum } from '../../shared';
import type {
  ISaveCardResponse,
  SDKOptions,
  IEnrollmentCustomizationOptions,
} from '../../types';
import { SDKType } from '../../types';
import BaseSDK from '../../core/BaseSDK';
import type Tonder from '../../core/Tonder';
import React from 'react';

class BaseEnrollment extends BaseSDK {
  #defaultCustomization: IEnrollmentCustomizationOptions = {
    saveButton: {
      show: true,
      text: 'Guardar',
    },
    showMessages: true,
  };
  constructor(
    tonderClient: Tonder,
    getState: () => Readonly<any>,
    setState: (newState: Partial<any>) => void,
    setSkyflowConfig: React.Dispatch<React.SetStateAction<any>>
  ) {
    super(tonderClient, getState, setState, setSkyflowConfig);
  }

  public create = async (
    data: SDKOptions<SDKType.ENROLLMENT>
  ): Promise<{ error?: TonderError }> => {
    try {
      await this.setState({
        ...data,
        isCreated: false,
        isCreating: true,
        customization: {
          ...this.#defaultCustomization,
          ...(data.customization || {}),
          saveButton: {
            ...this.#defaultCustomization.saveButton,
            ...(data.customization?.saveButton || {}),
          },
        },
        ...(data.customer ? { customer: data.customer } : {}),
        ...(data.secureToken ? { secureToken: data.secureToken } : {}),
      });

      await this.getInitialData();

      await this.initializeProviders({ mercadoPago: false });

      await this.setState({
        isCreated: true,
        isCreating: false,
      });

      return {};
    } catch (error) {
      const err =
        error instanceof TonderError
          ? error
          : new TonderError({
              code: ErrorKeyEnum.CREATE_ERROR,
              details: error,
            });

      await this.setState({
        error: error as TonderError,
        message: MESSAGES_ES[ErrorKeyEnum.ERROR_LOAD_ENROLLMENT_FORM],
      });

      return { error: err };
    }
  };

  public saveCard = async (cardId?: string): Promise<ISaveCardResponse> => {
    if (cardId) {
      const secureToken = this.tonderClient.getSecureToken();
      const businessId = this.tonderClient.getBusinessPK();
      const customerToken = this.tonderClient.getCustomerAuthToken();
      const response = await this.tonderClient
        .getService()
        .card.saveCustomerCard(customerToken, secureToken, businessId, {
          skyflow_id: cardId!,
        });
      await this.setState({
        message: MESSAGES_ES.CARD_SAVED_SUCCESSFULLY,
      });

      return response;
    }
    throw new TonderError({ code: ErrorKeyEnum.INVALID_CARD_DATA });
  };
}

export default BaseEnrollment;
