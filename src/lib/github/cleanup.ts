import { request } from './request';

// Types
import type { ProcessParams } from '@/types/deployment.types';

interface GhTree {
  sha: string;
  url: string;
  tree: {
    path: string;
    mode: string;
    type: string;
    sha: string;
    url: string;
  }[];
}

interface LastCommit {
  object: {
    sha: string;
  };
}

interface RootTree {
  tree: {
    sha: string;
  };
}

const BRANCH_NAME = 'main';

const foldersToDelete = ['data', 'messages'];

const TYPE = { BLOB: 'blob', TREE: 'tree' };

export async function cleanup({ owner, repo }: ProcessParams) {
  // Get the sha of the last commit on BRANCH_NAME
  const {
    object: { sha: currentCommitSha },
  } = await request<LastCommit>(`/repos/${owner}/${repo}/git/refs/heads/${BRANCH_NAME}`, {
    method: 'GET',
  });

  // Get the sha of the root tree on the commit retrieved previously
  const {
    tree: { sha: treeSha },
  } = await request<RootTree>(`/repos/${owner}/${repo}/git/commits/${currentCommitSha}`, {
    method: 'GET',
  });

  // Get the tree corresponding to the folder that must be deleted.
  // Uses the recursive query parameter to retrieve all files whatever the depth.
  // The result might come back truncated if the number of hits is big.
  // This truncated output case is NOT handled.

  const oldTrees: Record<string, GhTree['tree']> = {};
  for (const folderToDelete of foldersToDelete) {
    const { tree: oldTree } = await request<GhTree>(`/repos/${owner}/${repo}/git/trees/${BRANCH_NAME}:${folderToDelete}?recursive=true`, {
      method: 'GET',
    });
    oldTrees[folderToDelete] = oldTree;
  }

  // Create a tree to edit the content of the repository, basically select all files
  // in the previous tree and mark them with sha=null to delete them.
  // The folder only exists in git if it has a file in its offspring.
  const newTree = [];

  for (const [folderToDelete, oldTree] of Object.entries(oldTrees)) {
    for (const { type, path, mode } of oldTree) {
      if (type === TYPE.BLOB) {
        newTree.push({ path: `${folderToDelete}/${path}`, sha: null, mode, type });
      }
    }
  }

  // Create a new tree with the file offspring of the target folder removed
  const { sha: newTreeSha } = await request<{ sha: string }>(`/repos/${owner}/${repo}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({
      base_tree: treeSha,
      tree: newTree,
    }),
  });

  // Create a commit that uses the tree created above
  const { sha: newCommitSha } = await request<{ sha: string }>(`/repos/${owner}/${repo}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({
      message: 'Clean Up',
      tree: newTreeSha,
      parents: [currentCommitSha],
    }),
  });

  await request<GhTree>(`/repos/${owner}/${repo}/git/refs/heads/${BRANCH_NAME}`, {
    method: 'POST',
    body: JSON.stringify({
      sha: newCommitSha,
    }),
  });
}
