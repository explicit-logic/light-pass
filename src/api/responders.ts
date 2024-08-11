import { Responder } from '@/models/Responder';
import { invoke } from '@tauri-apps/api';

export async function getMany(quizId: Responder['quizId'], filters: { q?: string } = {}) {
  const items = (await invoke('responder_many', { quizId, ...filters })) as Responder[];

  return items.map((item) => new Responder(item));
}

export async function getOne(id: Responder['id']) {
  const item = (await invoke('responder_one', { id })) as Responder;

  return new Responder(item);
}

export async function createManually(data: Pick<Responder, 'quizId' | 'language' | 'name' | 'email' | 'group'>) {
  const responder = (await invoke('responder_create_manually', data)) as Responder;

  return new Responder(responder);
}

export async function create(data: Omit<Responder, 'id'>) {
  const responder = (await invoke('responder_create', data)) as Responder;

  return new Responder(responder);
}

export async function remove(responder: Pick<Responder, 'id' | 'quizId'>) {
  await invoke('responder_delete_one', { id: responder.id, quizId: responder.quizId });
}
