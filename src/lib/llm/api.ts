import ky from 'ky';

// Config
import { API_URL } from './config';

type CompletionParams = {
  prompt: string;
  n_predict?: number;
  stream?: boolean;
};

export async function completion(params: CompletionParams) {
  const result = await ky
    .post(`${API_URL}/completion`, {
      json: params,
      timeout: false,
    })
    .json();
  console.log(result);

  return result;
}
