import { request } from './request';

// Types
import type { ProcessParams } from '@/types/deployment.types';

export async function enablePages({ owner, repo }: ProcessParams) {
  return await request(`/repos/${owner}/${repo}/pages`, {
    method: 'POST',
    body: JSON.stringify({
      build_type: 'workflow',
      source: {
        branch: 'main',
        path: '/',
      },
    }),
  });
}
