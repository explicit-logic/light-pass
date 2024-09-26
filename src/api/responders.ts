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

export async function complete(data: Pick<Responder, 'quizId' | 'clientId'>) {
  await invoke('responder_complete', data);
}

export async function connect(data: Pick<Responder, 'quizId' | 'clientId' | 'language' | 'platform' | 'userAgent' | 'timezone' | 'theme'>) {
  const responder = (await invoke('responder_connect', data)) as Responder;

  return new Responder(responder);
}

export async function identify(data: Pick<Responder, 'quizId' | 'clientId' | 'email' | 'name' | 'group' | 'context'>) {
  await invoke('responder_identify', data);
}

export async function remove(responder: Pick<Responder, 'id' | 'quizId'>) {
  await invoke('responder_delete_one', { id: responder.id, quizId: responder.quizId });
}

export async function updateProgress(data: Pick<Responder, 'quizId' | 'clientId' | 'progress'>) {
  const responder = (await invoke('responder_update_progress', data)) as Responder;

  return new Responder(responder);
}
