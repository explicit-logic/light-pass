import { invoke } from '@tauri-apps/api';

import type { languages } from '@/constants/languages';

export type Locale = {
  quizId: number;
  language: keyof typeof languages;
  url: string;
  main: boolean;
};

export async function getMany(quizId: Locale['quizId']) {
  const items = (await invoke('locale_many', { quizId })) as Locale[];

  return items;
}

export async function getOne(quizId: Locale['quizId'], language: Locale['language']) {
  const item = (await invoke('locale_one', { quizId, language })) as Locale;

  return item;
}

export async function create(data: Locale) {
  const locale = (await invoke('locale_create', data)) as Locale;

  return locale;
}

export async function removeAll(quizId: Locale['quizId']) {
  await invoke('locale_delete_many', { quizId });
}
