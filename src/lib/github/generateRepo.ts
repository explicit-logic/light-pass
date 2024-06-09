import { request } from './request';

// Types
import type { ProcessParams } from '@/types/deployment.types';

const TEMPLATE_OWNER = 'explicit-logic';
const TEMPLATE_REPO = 'light-pass-template';

export async function generateRepo({ repo }: ProcessParams) {
  const response = await request<unknown>(`/repos/${TEMPLATE_OWNER}/${TEMPLATE_REPO}/generate`, {
    method: 'POST',
    body: JSON.stringify({
      name: repo,
      description: '',
      include_all_branches: false,
      private: false,
    }),
  });

  return response;
}
