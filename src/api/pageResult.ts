import { invoke } from '@tauri-apps/api';

import { PageResult } from '@/models/PageResult';

export async function getMany(responderId: PageResult['responderId']) {
  const items = (await invoke('page_result_many', { responderId })) as PageResult[];

  return items.map((item) => new PageResult(item));
}

export async function save(data: Pick<PageResult, 'responderId' | 'page' | 'score' | 'threshold' | 'verified'>) {
  const item = (await invoke('page_result_save', data)) as PageResult;

  return new PageResult(item);
}
