import { getPaymentMethodDetails } from '../catalog/paymentMethodsCatalog';
import { defaultTo, get } from './stringUtils';

export const getPaymentMethodsWithDetails = (response, mode: string) => {
  return defaultTo(get(response, 'results'), [])
    .filter((pmItem) => pmItem.category.toLowerCase() !== 'cards')
    .map((pmItem) => {
      return {
        id: pmItem.pk,
        payment_method: pmItem.payment_method,
        priority: pmItem.priority,
        category: pmItem.category,
        ...getPaymentMethodDetails(pmItem.payment_method, mode),
      };
    })
    .sort((a, b) => a.priority - b.priority);
};
