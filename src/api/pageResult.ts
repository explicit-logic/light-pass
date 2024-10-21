import { invoke } from '@tauri-apps/api';

import { PageResult } from '@/models/PageResult';

export async function autoEvaluate(data: Pick<PageResult, 'responderId' | 'page' | 'questionCount'>) {
  await invoke('page_result_auto_evaluate', data);
}

export async function getMany(responderId: PageResult['responderId']) {
  const items = (await invoke('page_result_many', { responderId })) as PageResult[];

  return items.map((item) => new PageResult(item));
}

export async function save(data: Pick<PageResult, 'responderId' | 'page' | 'points' | 'questionCount' | 'verified'>) {
  const item = (await invoke('page_result_save', data)) as PageResult;

  return new PageResult(item);
}

export async function saveQuestionCount(data: Pick<PageResult, 'responderId' | 'page' | 'questionCount'>) {
  await invoke('page_result_save_question_count', data);
}
