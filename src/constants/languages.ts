export const languages = Object.freeze({
  en: 'English',
  uk: 'Українська',
  zh: '中文',
  hi: 'हिन्दी',
  es: 'Español',
  de: 'Deutsch',
  it: 'Italiano',
  fr: 'Français',
  pl: 'Polski',
  pt: 'Português',
  ar: 'العربية',
  cs: 'Čeština',
  el: 'Ελληνικά',
  fa: 'فارسی',
  hu: 'Magyar',
  id: 'Bahasa Indonesia',
  ja: '日本語',
  ko: '한국어',
  nl: 'Nederlands',
  ro: 'Română',
  ru: 'Русский',
  sv: 'Svenska',
  th: 'ไทย',
  tr: 'Türkçe',
  vi: 'Tiếng Việt',
  da: 'Dansk',
  no: 'Norsk',
  sq: 'Shqip',
  sw: 'Kiswahili',
  ur: 'اردو',
  ms: 'Bahasa Melayu',
  fi: 'Suomi',
  he: 'עברית',
  is: 'Íslenska',
  mn: 'Монгол',
  sk: 'Slovenčina',
} as const);

export const languagesArray = Object.entries(languages).map(([id, name]) => ({ id, name })) as {
  id: keyof typeof languages;
  name: string;
}[];

export const DEFAULT_LANGUAGE = 'en';

export type LanguageType = keyof typeof languages;
