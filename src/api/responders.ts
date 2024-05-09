import { invoke } from '@tauri-apps/api';

export type Responder = {
  id: number;
  clientId: string;
  quizId: number;

  completed: boolean;
  connectedAt: Date;

  locale: string;
  platform: PlatformType;
  progress: number;
  timeZone: string;

  userAgent: string;

  email: string;
  name: string;
  theme?: ThemeModeType;
  group?: string;

  startAt?: Date;
  finishAt?: Date;

  context: {
    slugs: string[];
  };
};

export async function getMany() {
  const items = (await invoke('responder_many')) as Responder[];

  return items;
}

export async function getOne(id: Responder['id']) {
  const item = (await invoke('responder_one', { id })) as Responder;

  return item;
}

export async function create(data: Exclude<Responder, 'id'>) {
  const responder = (await invoke('responder_create', data)) as Responder;

  return responder;
}

export async function update(id: Responder['id'], data: Partial<Responder>) {
  const quiz = (await invoke('quiz_update', { ...data, id })) as Responder;

  return quiz;
}

export async function remove(id: Responder['id']) {
  await invoke('responder_delete_one', { id });
}
