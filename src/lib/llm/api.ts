import ky from 'ky';

import type { Model } from './types';

// Config
import { API_URL } from './config';

interface CompletionParams {
  prompt: string;
  n_predict?: number;
  stream?: boolean;
}

export async function getModels() {
  const items = await ky
    .get<Model[]>(`${API_URL}/models`, {
      timeout: false,
    })
    .json();
  const models = items.map(({ id, name, description }) => ({ id, name, description }));

  return models;
}

export async function completion(params: CompletionParams) {
  const result = await ky
    .post(`${API_URL}/completion`, {
      json: params,
      timeout: false,
    })
    .text();
  console.log(result);

  return result;
}
