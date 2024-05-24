import type { languages } from '@/constants/languages';

export type EditFormData = {
  locales: {
    language: keyof typeof languages;
    main: boolean;
    url: string;
  }[];
  name: string;
  description?: string;
};

export type CreateFormData = {
  description?: string;
  languages: (keyof typeof languages)[];
  name: string;
};
