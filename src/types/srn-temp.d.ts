declare module 'skyflow-react-native' {
  import type { StylesBaseVariant } from '../types';
  export type IConfig = {
    vaultID: string;
    vaultURL: string;
    getBearerToken: () => Promise<string>;
    options?: Record<string, any>;
  };

  export enum LogLevel {
    WARN = 'WARN',
    INFO = 'INFO',
    DEBUG = 'DEBUG',
    ERROR = 'ERROR',
  }

  export enum Env {
    DEV = 'DEV',
    PROD = 'PROD',
  }

  export const CardNumberElement: any;
  export const CardHolderNameElement: any;
  export const ExpirationMonthElement: any;
  export const ExpirationYearElement: any;

  export const CvvElement: any;

  export interface ISkyflowProvider {
    config: IConfig;
  }
  export const SkyflowProvider: React.FC<{ children: React.ReactNode }>;
  export const useCollectContainer: () => any;
  // export const useComposableContainer: () => any;

  export const useSkyflow: () => any;

  export interface IInsertRecord {
    table: string;
    fields: Record<string, any>;
  }
  export interface IInsertRecordInput {
    records: IInsertRecord[];
  }

  export interface IUpsertInput {
    table: string;
    column: string;
  }

  export interface ICollectOptions {
    tokens?: boolean;
    additionalFields?: IInsertRecordInput;
    upsert?: IUpsertInput[];
  }
  export interface CollectContainer {
    collect(options?: ICollectOptions): Promise<unknown>;
  }

  export enum ValidationRuleType {
    REGEX_MATCH_RULE = 'REGEX_MATCH_RULE',
    LENGTH_MATCH_RULE = 'LENGTH_MATCH_RULE',
  }
  export interface StylesFocusVariant {
    focus?: Record<string, any>;
  }
  export interface CollectInputStylesVariant
    extends StylesBaseVariant,
      StylesFocusVariant {
    complete?: Record<string, any>;
    invalid?: Record<string, any>;
    empty?: Record<string, any>;
    container?: Record<string, any>;
  }

  export interface CollectLabelStylesVariant
    extends StylesBaseVariant,
      StylesFocusVariant {
    requiredAsterisk?: Record<string, any>;
  }
}
