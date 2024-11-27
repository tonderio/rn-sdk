import { clearSpace } from '../utils/stringUtils';

const CARD_BRAND_CATALOG: {
  [key: string]: string;
} = {
  visa: 'https://d35a75syrgujp0.cloudfront.net/cards/visa.png',
  mastercard: 'https://d35a75syrgujp0.cloudfront.net/cards/mastercard.png',
  americanexpress:
    'https://d35a75syrgujp0.cloudfront.net/cards/american_express.png',
  default: 'https://d35a75syrgujp0.cloudfront.net/cards/default_card.png',
};

export const getCardType = (scheme: string) => {
  const scheme_clean = clearSpace(scheme).toLowerCase();
  return CARD_BRAND_CATALOG[scheme_clean] || CARD_BRAND_CATALOG.default;
};
