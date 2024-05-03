import type { languages } from '@/constants/languages';

export type FormData = {
  locales: {
    language: keyof typeof languages;
    main: boolean;
    url: string;
  }[];
  name: string;
};
