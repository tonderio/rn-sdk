import { PAYMENT_METHODS } from '../constants/paymentMethods';
import { clearSpace } from '../utils/stringUtils';

const PAYMENT_METHODS_CATALOG: {
  [key: string]: { label: string; icon: string };
} = {
  [PAYMENT_METHODS.SORIANA]: {
    label: 'Soriana',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/soriana.png',
  },
  [PAYMENT_METHODS.OXXO]: {
    label: 'Oxxo',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/oxxo.png',
  },
  [PAYMENT_METHODS.CODI]: {
    label: 'CoDi',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/codi.png',
  },
  [PAYMENT_METHODS.MERCADOPAGO]: {
    label: 'Mercado Pago',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/mercadopago.png',
  },
  [PAYMENT_METHODS.OXXOPAY]: {
    label: 'Oxxo Pay',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/oxxopay.png',
  },
  [PAYMENT_METHODS.SPEI]: {
    label: 'SPEI',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/spei.png',
  },
  [PAYMENT_METHODS.PAYPAL]: {
    label: 'Paypal',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/paypal.png',
  },
  [PAYMENT_METHODS.COMERCIALMEXICANA]: {
    label: 'Comercial Mexicana',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/comercial_exicana.png',
  },
  [PAYMENT_METHODS.BANCOMER]: {
    label: 'Bancomer',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/bancomer.png',
  },
  [PAYMENT_METHODS.WALMART]: {
    label: 'Walmart',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/walmart.png',
  },
  [PAYMENT_METHODS.BODEGA]: {
    label: 'Bodega Aurrera',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/bodega_aurrera.png',
  },
  [PAYMENT_METHODS.SAMSCLUB]: {
    label: 'Sam´s Club',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/sams_club.png',
  },
  [PAYMENT_METHODS.SUPERAMA]: {
    label: 'Superama',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/superama.png',
  },
  [PAYMENT_METHODS.CALIMAX]: {
    label: 'Calimax',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/calimax.png',
  },
  [PAYMENT_METHODS.EXTRA]: {
    label: 'Tiendas Extra',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/tiendas_extra.png',
  },
  [PAYMENT_METHODS.CIRCULOK]: {
    label: 'Círculo K',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/circulo_k.png',
  },
  [PAYMENT_METHODS.SEVEN11]: {
    label: '7 Eleven',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/7_eleven.png',
  },
  [PAYMENT_METHODS.TELECOMM]: {
    label: 'Telecomm',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/telecomm.png',
  },
  [PAYMENT_METHODS.BANORTE]: {
    label: 'Banorte',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/banorte.png',
  },
  [PAYMENT_METHODS.BENAVIDES]: {
    label: 'Farmacias Benavides',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/farmacias_benavides.png',
  },
  [PAYMENT_METHODS.DELAHORRO]: {
    label: 'Farmacias del Ahorro',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/farmacias_ahorro.png',
  },
  [PAYMENT_METHODS.ELASTURIANO]: {
    label: 'El Asturiano',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/asturiano.png',
  },
  [PAYMENT_METHODS.WALDOS]: {
    label: 'Waldos',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/waldos.png',
  },
  [PAYMENT_METHODS.ALSUPER]: {
    label: 'Alsuper',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/al_super.png',
  },
  [PAYMENT_METHODS.KIOSKO]: {
    label: 'Kiosko',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/kiosko.png',
  },
  [PAYMENT_METHODS.STAMARIA]: {
    label: 'Farmacias Santa María',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/farmacias_santa_maria.png',
  },
  [PAYMENT_METHODS.LAMASBARATA]: {
    label: 'Farmacias la más barata',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/farmacias_barata.png',
  },
  [PAYMENT_METHODS.FARMROMA]: {
    label: 'Farmacias Roma',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/farmacias_roma.png',
  },
  [PAYMENT_METHODS.FARMUNION]: {
    label: 'Pago en Farmacias Unión',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/farmacias_union.png',
  },
  [PAYMENT_METHODS.FARMATODO]: {
    label: 'Pago en Farmacias Farmatodo',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/farmacias_farmatodo.png	',
  },
  [PAYMENT_METHODS.SFDEASIS]: {
    label: 'Pago en Farmacias San Francisco de Asís',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/farmacias_san_francisco.png',
  },
  [PAYMENT_METHODS.FARM911]: {
    label: 'Farmacias 911',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.FARMECONOMICAS]: {
    label: 'Farmacias Economicas',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.FARMMEDICITY]: {
    label: 'Farmacias Medicity',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.RIANXEIRA]: {
    label: 'Rianxeira',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.WESTERNUNION]: {
    label: 'Western Union',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.ZONAPAGO]: {
    label: 'Zona Pago',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.CAJALOSANDES]: {
    label: 'Caja Los Andes',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.CAJAPAITA]: {
    label: 'Caja Paita',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.CAJASANTA]: {
    label: 'Caja Santa',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.CAJASULLANA]: {
    label: 'Caja Sullana',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.CAJATRUJILLO]: {
    label: 'Caja Trujillo',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.EDPYME]: {
    label: 'Edpyme',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.KASNET]: {
    label: 'KasNet',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.NORANDINO]: {
    label: 'Norandino',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.QAPAQ]: {
    label: 'Qapaq',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.RAIZ]: {
    label: 'Raiz',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.PAYSER]: {
    label: 'Paysera',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.WUNION]: {
    label: 'Western Union',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.BANCOCONTINENTAL]: {
    label: 'Banco Continental',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.GMONEY]: {
    label: 'Go money',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.GOPAY]: {
    label: 'Go pay',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.WU]: {
    label: 'Western Union',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.PUNTOSHEY]: {
    label: 'Puntoshey',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.AMPM]: {
    label: 'Ampm',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.JUMBOMARKET]: {
    label: 'Jumbomarket',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.SMELPUEBLO]: {
    label: 'Smelpueblo',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.BAM]: {
    label: 'Bam',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.REFACIL]: {
    label: 'Refacil',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.ACYVALORES]: {
    label: 'Acyvalores',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
  },
  [PAYMENT_METHODS.SAFETYPAYCASH]: {
    label: 'Paga en Efectivo',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/cash_apm_sp.png',
  },
  [PAYMENT_METHODS.SAFETYPAYTRANSFER]: {
    label: 'Paga por Transferencia',
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/transfer_apm_sp.png',
  },
};

type PaymentMethodKey = keyof typeof PAYMENT_METHODS_CATALOG;

export const getPaymentMethodDetails = (
  scheme_data: string
): { label: string; icon: string } => {
  const scheme: PaymentMethodKey = clearSpace(scheme_data.toUpperCase());
  const _default = {
    icon: 'https://d35a75syrgujp0.cloudfront.net/payment_methods/store.png',
    label: '',
  };
  return PAYMENT_METHODS_CATALOG[scheme] || _default;
};
