import type { Locale } from '@/models/Locale';
import type { SettingsFormData } from '../QuizForm.types';

export function getChanges(source: Locale[], target: SettingsFormData['locales']) {
  const deleted: Locale[] = [];
  const sourceLang = source.reduce<{ [key: string]: boolean }>((acc, curr) => {
    acc[curr.language] = true;
    return acc;
  }, {});
  const targetLang = target.reduce<{ [key: string]: boolean }>((acc, curr) => {
    acc[curr.language] = true;
    return acc;
  }, {});

  const created = target.filter((targetLocale) => !sourceLang[targetLocale.language]);
  const updated = target.filter((targetLocale) => sourceLang[targetLocale.language]);

  for (const sourceLocale of source) {
    if (!targetLang[sourceLocale.language]) {
      deleted.push(sourceLocale);
    }
  }

  return {
    created,
    deleted,
    updated,
  };
}
