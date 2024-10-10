import { invoke } from '@tauri-apps/api';

import { Answer } from '@/models/Answer';

export async function getMany(responderId: Answer['responderId']) {
  const items = (await invoke('answer_many', { responderId })) as Answer[];

  return items.map((item) => new Answer(item));
}

export async function getOne(responderId: Answer['responderId'], page: Answer['page']) {
  const item = (await invoke('answer_one', { responderId, page })) as Answer;

  return new Answer(item);
}

export async function save(data: Pick<Answer, 'responderId' | 'page' | 'answer'>) {
  const answer = (await invoke('answer_save', data)) as Answer;

  return new Answer(answer);
}
