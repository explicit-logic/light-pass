import { invoke } from '@tauri-apps/api';

export type Quiz = {
  id: number;
  name: string;
  localeCount: number;
  mainLanguage?: string;
};

export async function getMany() {
  const items = (await invoke('quiz_many')) as Quiz[];

  return items;
}

export async function getOne(id: Quiz['id']) {
  const item = (await invoke('quiz_one', { id })) as Quiz;

  return item;
}

export async function create(data: { name: string }) {
  const quiz = (await invoke('quiz_create', data)) as Quiz;

  return quiz;
}

export async function update(id: Quiz['id'], data: { name: string }) {
  const quiz = (await invoke('quiz_update', { ...data, id })) as Quiz;

  return quiz;
}

export async function remove(id: Quiz['id']) {
  await invoke('quiz_delete', { id });
}
