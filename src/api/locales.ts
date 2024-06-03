import { invoke } from '@tauri-apps/api';

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

export async function upsert(data: LocaleCreate) {
  const locale = (await invoke('locale_upsert', data)) as Locale;

  return new Locale(locale);
}

export async function updateUrl(data: { quizId: Locale['quizId']; language: Locale['language']; url: Locale['url'] }) {
  await invoke('locale_update_url', data);
}

export async function remove(quizId: Locale['quizId'], language: Locale['language']) {
  await invoke('locale_delete_one', { quizId, language });
}

export async function removeAll(quizId: Locale['quizId']) {
  await invoke('locale_delete_many', { quizId });
}
