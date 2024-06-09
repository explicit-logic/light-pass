import * as fs from '@tauri-apps/api/fs';
import * as path from '@tauri-apps/api/path';

import { request } from './request';

// Types
import type { ProcessParams } from '@/types/deployment.types';

const FILENAME = '.github/workflows/nextjs.yml';
const BRANCH_NAME = 'main';
const MODES = { FILE: '100644', FOLDER: '040000' } as const;
const TYPE = { BLOB: 'blob', TREE: 'tree' } as const;

type LastCommit = {
  object: {
    sha: string;
  };
};

export async function setupCI({ repo, owner }: Pick<ProcessParams, 'owner' | 'repo'>) {
  const content = await readContent();
  if (!content) return;

  // Get the sha of the last commit on BRANCH_NAME
  const {
    object: { sha: baseTreeSha },
  } = await request<LastCommit>(`/repos/${owner}/${repo}/git/refs/heads/${BRANCH_NAME}`, {
    method: 'GET',
  });

  // Create a tree to edit the content of the repository
  const { sha: treeSha } = await request<{ sha: string }>(`/repos/${owner}/${repo}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({
      base_tree: baseTreeSha,
      tree: [
        {
          path: FILENAME,
          content,
          mode: MODES.FILE,
          type: TYPE.BLOB,
        },
      ],
    }),
  });

  // Create a commit that uses the tree created above
  const { sha: commitSha } = await request<{ sha: string }>(`/repos/${owner}/${repo}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({
      message: 'Setup CI',
      parents: [baseTreeSha],
      tree: treeSha,
    }),
  });

  // Make BRANCH_NAME point to the created commit
  await request(`/repos/${owner}/${repo}/git/refs/heads/${BRANCH_NAME}`, {
    method: 'POST',
    body: JSON.stringify({
      sha: commitSha,
    }),
  });
}

async function readContent() {
  const filePath = await path.resolveResource(`template/${FILENAME}`);
  const fileExists = await fs.exists(filePath);

  if (!fileExists) {
    throw new Error('Configuration file for CI not found');
  }
  const content = await fs.readTextFile(filePath);

  return content;
}
