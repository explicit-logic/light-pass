import { Quiz } from '@/models/Quiz';
import { invoke } from '@tauri-apps/api';

export async function getMany() {
  const items = (await invoke('quiz_many')) as Quiz[];

  return items.map((item) => new Quiz(item));
}

export async function getOne(id: Quiz['id']) {
  const item = (await invoke('quiz_one', { id })) as Quiz;

  return new Quiz(item);
}

export async function create(data: { name: string; description: string }) {
  const quiz = (await invoke('quiz_create', data)) as Quiz;

  return new Quiz(quiz);
}

export async function update(id: Quiz['id'], data: { name: string; description: string }) {
  const quiz = (await invoke('quiz_update', { ...data, id })) as Quiz;

  return new Quiz(quiz);
}

export async function remove(id: Quiz['id']) {
  await invoke('quiz_delete', { id });
}
