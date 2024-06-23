import type { languages } from '@/constants/languages';

export type EditFormData = {
  language: keyof typeof languages;
  name: string;
  description?: string;
};

export type CreateFormData = {
  description?: string;
  language: keyof typeof languages;
  name: string;
};
