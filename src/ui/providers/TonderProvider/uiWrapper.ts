import type Tonder from '../../../core/Tonder';
import { executeCallback } from '../../../shared/utils/common';
import { MESSAGES_EN } from '../../../shared';

export interface IUIWrapper {
  removeCustomerCard: (cardId: string) => Promise<void>;
  updateMethod: (method: string, value: string) => void;
  updateSaveCard: (value: boolean) => void;
  setSkyFlowContainer: (value: any) => void;
}

const uiWrapper = (tonder: Tonder): IUIWrapper => ({
  removeCustomerCard: async (cardId: string) => {
    const callbacks = tonder.getState().callbacks;
    try {
      await executeCallback({
        callbacks,
        callback: 'beforeDeleteCard',
        throwError: true,
      });

      await tonder
        .getService()
        .card.removeCustomerCard(
          tonder.getCustomerAuthToken(),
          tonder.getSecureToken(),
          cardId,
          tonder.getBusinessPK()
        );

      tonder.updateUIState({
        cards: tonder
          .getState()
          .uiData.cards.filter(
            (card: any) => card.fields.skyflow_id !== cardId
          ),
      });
      await executeCallback({
        callbacks,
        callback: 'onFinishDeleteCard',
        data: { response: MESSAGES_EN.REMOVE_CARD },
      });
    } catch (error) {
      await executeCallback({
        callbacks,
        callback: 'onFinishDeleteCard',
        data: { error: error },
      });
    }
  },
  updateMethod: (method: string, value: string) => {
    tonder.updateUIState({
      ...(method === 'card'
        ? { card: value }
        : method === 'payment_method'
          ? { paymentMethod: value }
          : {}),
      selectedMethod: method === '' ? 'new' : method,
    });
  },
  updateSaveCard: (value: boolean) => {
    tonder.updateUIState({ saveCard: value });
  },
  setSkyFlowContainer: (value: any) => {
    tonder.setState({ skyflowContainer: value });
  },
});

export default uiWrapper;
