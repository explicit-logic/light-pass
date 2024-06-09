import { request } from './request';

// Types
import type { ProcessParams } from '@/types/deployment.types';

export async function deleteRepo({ owner, repo }: Pick<ProcessParams, 'owner' | 'repo'>) {
  return await request(`/repos/${owner}/${repo}`, {
    method: 'DELETE',
  });
}
