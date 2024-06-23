import type { FIELDS, ORDERS } from '@/constants/configuration';
import type { languages } from '@/constants/languages';

export type EditFormData = {
  fields: (typeof FIELDS)[keyof typeof FIELDS][];
  language: keyof typeof languages;
  name: string;
  order: (typeof ORDERS)[keyof typeof ORDERS];
  description?: string;
};

export type CreateFormData = {
  description?: string;
  language: keyof typeof languages;
  name: string;
};
