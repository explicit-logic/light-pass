import { invoke } from '@tauri-apps/api';

import type { languages } from '@/constants/languages';

import { Locale } from '@/models/Locale';

export type LocaleCreate = Pick<Locale, 'quizId' | 'language' | 'url' | 'main'>;

export async function getMany(quizId: Locale['quizId']) {
  const items = (await invoke('locale_many', { quizId })) as Locale[];

  return items.map((item) => new Locale(item));
}

export async function getOne(quizId: Locale['quizId'], language: Locale['language']) {
  const item = (await invoke('locale_one', { quizId, language })) as Locale;

  return new Locale(item);
}

export async function create(data: LocaleCreate) {
  const locale = (await invoke('locale_create', data)) as Locale;

  return new Locale(locale);
}

export async function removeAll(quizId: Locale['quizId']) {
  await invoke('locale_delete_many', { quizId });
}
