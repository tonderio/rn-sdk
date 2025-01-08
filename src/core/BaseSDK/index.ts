import type Tonder from '../Tonder';
import type { ICustomer, ICustomerResponse } from '../../types';
import TonderError from '../../shared/utils/errors';
import { ErrorKeyEnum } from '../../shared';
import React from 'react';

class BaseSDK {
  tonderClient: Tonder;
  getState: () => Readonly<any>;
  setState: (newState: Partial<any>) => void;
  private readonly setSkyflowConfig: React.Dispatch<React.SetStateAction<any>>;

  constructor(
    tonderClient: Tonder,
    getState: () => Readonly<any>,
    setState: (newState: Partial<any>) => void,
    setSkyflowConfig: React.Dispatch<React.SetStateAction<any>>
  ) {
    this.tonderClient = tonderClient;
    this.setSkyflowConfig = setSkyflowConfig;
    this.getState = getState;
    this.setState = setState;
  }

  public async getInitialData(): Promise<void> {
    const merchantData = await this.tonderClient
      .getService()
      .business.fetchBusiness();

    await this.setState({ merchantData });

    // Init customer, if it's exist in state
    try {
      await this.getOrRegisterCustomer(
        this.getState().paymentData?.customer || this.getState().customer
      );
    } catch (e) {}
  }

  protected async getOrRegisterCustomer(
    customer?: ICustomer
  ): Promise<ICustomerResponse | null> {
    try {
      const customerInput = customer;
      if (customerInput && Object.keys(customerInput).length > 0) {
        const customerData = await this.tonderClient
          .getService()
          .customer.registerOrFetchCustomer(customerInput as ICustomer);
        await this.setState({ customerData });
        return customerData;
      }
      console.log('Customer data was not provided, skipping get/register.');
      return null;
    } catch (error) {
      if (error instanceof TonderError) {
        throw error;
      }
      throw new TonderError({ code: ErrorKeyEnum.STATE_ERROR, details: error });
    }
  }

  public async initializeProviders(providers?: {
    mercadoPago?: boolean;
  }): Promise<void> {
    if (providers?.mercadoPago) {
      this.initMercadoPago();
    }
    await this.initSkyflow();
  }

  private initMercadoPago() {
    const merchantData = this.getState().merchantData;
    // Init mercado pago, if it's active
    if (!!merchantData?.mercado_pago && !!merchantData?.mercado_pago?.active) {
      this.tonderClient.getService().mercadoPago.injectMercadoPagoSecurity();
    }
  }

  private async initSkyflow() {
    const merchantData = this.getState().merchantData;
    if (merchantData?.vault_id && merchantData?.vault_url) {
      const skyflowConfig = await this.tonderClient
        .getService()
        .skyflow.createSkyflowConfig(
          merchantData,
          this.tonderClient.getConfig().mode
        );

      this.setSkyflowConfig(skyflowConfig);

      await this.setState({ skyflowConfig });
    }
  }
}

export default BaseSDK;
