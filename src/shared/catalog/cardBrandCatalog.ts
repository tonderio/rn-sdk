import { getStaticAssetsUrlByMode } from '../constants/environments';
import { clearSpace } from '../utils/stringUtils';

const CARD_BRAND_CATALOG: {
  [key: string]: string;
} = {
  visa: '/cards/visa.png',
  mastercard: '/cards/mastercard.png',
  americanexpress: '/cards/american_express.png',
  default: '/cards/default_card.png',
};

export const getCardType = (scheme: string, mode: string) => {
  const scheme_clean = clearSpace(scheme).toLowerCase();
  const path = CARD_BRAND_CATALOG[scheme_clean] || CARD_BRAND_CATALOG.default;
  return `${getStaticAssetsUrlByMode(mode)}${path}`;
};
