import { getStaticAssetsUrlByMode } from '../constants/environments';
import { PAYMENT_METHODS } from '../constants/paymentMethods';
import { clearSpace } from '../utils/stringUtils';

const PAYMENT_METHODS_CATALOG: {
  [key: string]: { label: string; icon: string };
} = {
  [PAYMENT_METHODS.SORIANA]: {
    label: 'Soriana',
    icon: '/payment_methods/soriana.png',
  },
  [PAYMENT_METHODS.OXXO]: {
    label: 'Oxxo',
    icon: '/payment_methods/oxxo.png',
  },
  [PAYMENT_METHODS.CODI]: {
    label: 'CoDi',
    icon: '/payment_methods/codi.png',
  },
  [PAYMENT_METHODS.MERCADOPAGO]: {
    label: 'Mercado Pago',
    icon: '/payment_methods/mercadopago.png',
  },
  [PAYMENT_METHODS.OXXOPAY]: {
    label: 'Oxxo Pay',
    icon: '/payment_methods/oxxopay.png',
  },
  [PAYMENT_METHODS.SPEI]: {
    label: 'SPEI',
    icon: '/payment_methods/spei.png',
  },
  [PAYMENT_METHODS.PAYPAL]: {
    label: 'Paypal',
    icon: '/payment_methods/paypal.png',
  },
  [PAYMENT_METHODS.COMERCIALMEXICANA]: {
    label: 'Comercial Mexicana',
    icon: '/payment_methods/comercial_exicana.png',
  },
  [PAYMENT_METHODS.BANCOMER]: {
    label: 'Bancomer',
    icon: '/payment_methods/bancomer.png',
  },
  [PAYMENT_METHODS.WALMART]: {
    label: 'Walmart',
    icon: '/payment_methods/walmart.png',
  },
  [PAYMENT_METHODS.BODEGA]: {
    label: 'Bodega Aurrera',
    icon: '/payment_methods/bodega_aurrera.png',
  },
  [PAYMENT_METHODS.SAMSCLUB]: {
    label: 'Sam´s Club',
    icon: '/payment_methods/sams_club.png',
  },
  [PAYMENT_METHODS.SUPERAMA]: {
    label: 'Superama',
    icon: '/payment_methods/superama.png',
  },
  [PAYMENT_METHODS.CALIMAX]: {
    label: 'Calimax',
    icon: '/payment_methods/calimax.png',
  },
  [PAYMENT_METHODS.EXTRA]: {
    label: 'Tiendas Extra',
    icon: '/payment_methods/tiendas_extra.png',
  },
  [PAYMENT_METHODS.CIRCULOK]: {
    label: 'Círculo K',
    icon: '/payment_methods/circulo_k.png',
  },
  [PAYMENT_METHODS.SEVEN11]: {
    label: '7 Eleven',
    icon: '/payment_methods/7_eleven.png',
  },
  [PAYMENT_METHODS.TELECOMM]: {
    label: 'Telecomm',
    icon: '/payment_methods/telecomm.png',
  },
  [PAYMENT_METHODS.BANORTE]: {
    label: 'Banorte',
    icon: '/payment_methods/banorte.png',
  },
  [PAYMENT_METHODS.BENAVIDES]: {
    label: 'Farmacias Benavides',
    icon: '/payment_methods/farmacias_benavides.png',
  },
  [PAYMENT_METHODS.DELAHORRO]: {
    label: 'Farmacias del Ahorro',
    icon: '/payment_methods/farmacias_ahorro.png',
  },
  [PAYMENT_METHODS.ELASTURIANO]: {
    label: 'El Asturiano',
    icon: '/payment_methods/asturiano.png',
  },
  [PAYMENT_METHODS.WALDOS]: {
    label: 'Waldos',
    icon: '/payment_methods/waldos.png',
  },
  [PAYMENT_METHODS.ALSUPER]: {
    label: 'Alsuper',
    icon: '/payment_methods/al_super.png',
  },
  [PAYMENT_METHODS.KIOSKO]: {
    label: 'Kiosko',
    icon: '/payment_methods/kiosko.png',
  },
  [PAYMENT_METHODS.STAMARIA]: {
    label: 'Farmacias Santa María',
    icon: '/payment_methods/farmacias_santa_maria.png',
  },
  [PAYMENT_METHODS.LAMASBARATA]: {
    label: 'Farmacias la más barata',
    icon: '/payment_methods/farmacias_barata.png',
  },
  [PAYMENT_METHODS.FARMROMA]: {
    label: 'Farmacias Roma',
    icon: '/payment_methods/farmacias_roma.png',
  },
  [PAYMENT_METHODS.FARMUNION]: {
    label: 'Pago en Farmacias Unión',
    icon: '/payment_methods/farmacias_union.png',
  },
  [PAYMENT_METHODS.FARMATODO]: {
    label: 'Pago en Farmacias Farmatodo',
    icon: '/payment_methods/farmacias_farmatodo.png	',
  },
  [PAYMENT_METHODS.SFDEASIS]: {
    label: 'Pago en Farmacias San Francisco de Asís',
    icon: '/payment_methods/farmacias_san_francisco.png',
  },
  [PAYMENT_METHODS.FARM911]: {
    label: 'Farmacias 911',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.FARMECONOMICAS]: {
    label: 'Farmacias Economicas',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.FARMMEDICITY]: {
    label: 'Farmacias Medicity',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.RIANXEIRA]: {
    label: 'Rianxeira',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.WESTERNUNION]: {
    label: 'Western Union',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.ZONAPAGO]: {
    label: 'Zona Pago',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.CAJALOSANDES]: {
    label: 'Caja Los Andes',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.CAJAPAITA]: {
    label: 'Caja Paita',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.CAJASANTA]: {
    label: 'Caja Santa',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.CAJASULLANA]: {
    label: 'Caja Sullana',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.CAJATRUJILLO]: {
    label: 'Caja Trujillo',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.EDPYME]: {
    label: 'Edpyme',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.KASNET]: {
    label: 'KasNet',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.NORANDINO]: {
    label: 'Norandino',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.QAPAQ]: {
    label: 'Qapaq',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.RAIZ]: {
    label: 'Raiz',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.PAYSER]: {
    label: 'Paysera',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.WUNION]: {
    label: 'Western Union',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.BANCOCONTINENTAL]: {
    label: 'Banco Continental',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.GMONEY]: {
    label: 'Go money',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.GOPAY]: {
    label: 'Go pay',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.WU]: {
    label: 'Western Union',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.PUNTOSHEY]: {
    label: 'Puntoshey',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.AMPM]: {
    label: 'Ampm',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.JUMBOMARKET]: {
    label: 'Jumbomarket',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.SMELPUEBLO]: {
    label: 'Smelpueblo',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.BAM]: {
    label: 'Bam',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.REFACIL]: {
    label: 'Refacil',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.ACYVALORES]: {
    label: 'Acyvalores',
    icon: '/payment_methods/store.png',
  },
  [PAYMENT_METHODS.SAFETYPAYCASH]: {
    label: 'Paga en Efectivo',
    icon: '/payment_methods/cash_apm_sp.png',
  },
  [PAYMENT_METHODS.SAFETYPAYTRANSFER]: {
    label: 'Paga por Transferencia',
    icon: '/payment_methods/transfer_apm_sp.png',
  },
};

type PaymentMethodKey = keyof typeof PAYMENT_METHODS_CATALOG;

export const getPaymentMethodDetails = (
  scheme_data: string,
  mode: string
): { label: string; icon: string } => {
  const scheme: PaymentMethodKey = clearSpace(scheme_data.toUpperCase());
  const _default = {
    icon: '/payment_methods/store.png',
    label: '',
  };
  const details = PAYMENT_METHODS_CATALOG[scheme] || _default;
  return {
    ...details,
    icon: `${getStaticAssetsUrlByMode(mode)}${details.icon}`,
  };
};
