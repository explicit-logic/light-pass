import { invoke } from '@tauri-apps/api';

import { Correction } from '@/models/Correction';

export async function getManyOnPage(responderId: Correction['responderId'], page?: Correction['page']) {
  if (!page) return [];
  const items = (await invoke('correction_many_on_page', { responderId, page })) as Correction[];

  return items.map((item) => new Correction(item));
}

export async function save(data: Pick<Correction, 'responderId' | 'page' | 'question' | 'mark' | 'note' | 'verified'>) {
  const item = (await invoke('correction_save', data)) as Correction;

  return new Correction(item);
}

export async function saveMark(data: Pick<Correction, 'responderId' | 'page' | 'question' | 'mark'>) {
  await invoke('correction_save_mark', data);
}
