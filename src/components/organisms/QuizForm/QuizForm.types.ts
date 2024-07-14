import type { FIELDS, ORDERS } from '@/constants/configuration';
import type { TIME_LIMIT_TYPES } from '@/constants/configuration';
import type { languages } from '@/constants/languages';

export type TimeLimitType = (typeof TIME_LIMIT_TYPES)[keyof typeof TIME_LIMIT_TYPES] | null;

export type EditFormData = {
  fields: (typeof FIELDS)[keyof typeof FIELDS][];
  language: keyof typeof languages;
  name: string;
  order: (typeof ORDERS)[keyof typeof ORDERS];
  description?: string;
  timeLimit: {
    type?: TimeLimitType;
    duration: number;
  };
};

export type CreateFormData = {
  description?: string;
  language: keyof typeof languages;
  name: string;
};

export type SettingsFormData = {
  locales: {
    language: keyof typeof languages;
    main: boolean;
    url: string;
  }[];
};
