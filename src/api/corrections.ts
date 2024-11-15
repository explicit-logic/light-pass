import { invoke } from '@tauri-apps/api';

import { Correction } from '@/models/Correction';

export async function evaluate(data: Pick<Correction, 'responderId' | 'page' | 'question' | 'points'>) {
  return (await invoke('correction_evaluate', data)) as number;
}

export async function getManyOnPage(responderId: Correction['responderId'], page?: Correction['page']) {
  if (!page) return [];
  const items = (await invoke('correction_many_on_page', { responderId, page })) as Correction[];

  return items.map((item) => new Correction(item));
}

export async function savePoints(data: Pick<Correction, 'responderId' | 'page' | 'question' | 'points'>) {
  await invoke('correction_save_points', data);
}
