import * as fs from '@tauri-apps/api/fs';
import * as path from '@tauri-apps/api/path';

import { binaryToBase64 } from '@/helpers/toBase64';
import { request } from './request';

// Types
import type { ProcessParams } from '@/types/deployment.types';

const ACTIONS_CONFIG_PATH = '.github/workflows/nextjs.yml';
const BRANCH_NAME = 'main';
const MODES = { FILE: '100644', FOLDER: '040000' } as const;
const TYPE = { BLOB: 'blob', TREE: 'tree' } as const;

const foldersToClean = ['data', 'messages'];

type Tree = {
  path: string;
  mode: (typeof MODES)[keyof typeof MODES];
  type: (typeof TYPE)[keyof typeof TYPE];
  sha?: string | null;
  content?: string;
  url?: string;
};

interface GhTree {
  sha: string;
  url: string;
  tree: Tree[];
}

type LastCommit = {
  object: {
    sha: string;
  };
};

export async function pushContent({ owner, repo, quizId }: ProcessParams) {
  const basePathParts = await getBasePathParts(quizId);
  const files = await getFiles(basePathParts);

  const treeObj: Record<Tree['path'], Tree> = {};

  const actionsConfigExists = await checkActionsConfigExists({ owner, repo });

  if (!actionsConfigExists) {
    const content = await readActionsConfig();

    treeObj[ACTIONS_CONFIG_PATH] = {
      content,
      mode: MODES.FILE,
      path: ACTIONS_CONFIG_PATH,
      type: TYPE.BLOB,
    };
  }

  for (const folderToClean of foldersToClean) {
    const { tree: oldTree } = await request<GhTree>(`/repos/${owner}/${repo}/git/trees/${BRANCH_NAME}:${folderToClean}?recursive=true`, {
      method: 'GET',
    });
    for (const old of oldTree) {
      const { mode, type } = old;
      if (type === TYPE.BLOB) {
        const filePath = `${folderToClean}/${old.path}`;
        treeObj[filePath] = { path: filePath, sha: null, mode, type };
      }
    }
  }

  for (const file of files) {
    const content = await getContent([...basePathParts, ...file]);
    const sha = await createBlob({ owner, repo }, content);

    const filePath = file.join('/');
    treeObj[filePath] = { path: filePath, sha, mode: MODES.FILE, type: TYPE.BLOB };
  }

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
      tree: Object.values(treeObj),
    }),
  });

  // Create a commit that uses the tree created above
  const { sha: commitSha } = await request<{ sha: string }>(`/repos/${owner}/${repo}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({
      message: `Upd ${new Date().toLocaleString('en-UK')}`,
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

async function checkActionsConfigExists({ owner, repo }: { owner: string; repo: string }) {
  try {
    await request(`/repos/${owner}/${repo}/contents/${ACTIONS_CONFIG_PATH}`, {
      method: 'GET',
    });

    return true;
  } catch (error) {
    if ((error as { status: number }).status === 404) {
      return false;
    }
    throw error;
  }
}

async function createBlob({ owner, repo }: Pick<ProcessParams, 'owner' | 'repo'>, content: string) {
  const { sha } = await request<{ sha: string }>(`/repos/${owner}/${repo}/git/blobs`, {
    method: 'POST',
    body: JSON.stringify({
      content,
      encoding: 'base64',
    }),
  });

  return sha;
}

async function getContent(filePathParts: string[]) {
  const filePath = await path.join(...filePathParts);
  const contents = await fs.readBinaryFile(filePath);
  const base64 = binaryToBase64(contents);

  return base64;
}

async function getBasePathParts(quizId: number) {
  const appDataDirPath = await path.appDataDir();
  return [appDataDirPath, 'builder', quizId.toString()];
}

async function getFiles(basePathParts: string[]) {
  try {
    const directoryPath = await path.join(...basePathParts);
    const entries = await fs.readDir(directoryPath, { recursive: true });

    const files: string[][] = [];
    processEntries(entries, files);

    return files;
  } catch {
    return [];
  }
}

function processEntries(entries: fs.FileEntry[], files: string[][] = [], root: string[] = []) {
  for (const entry of entries) {
    if (!entry.name || entry.name.startsWith('.')) {
      continue;
    }

    if (entry.children) {
      processEntries(entry.children, files, [...root, entry.name]);
    } else {
      files.push([...root, entry.name]);
    }
  }
}

export async function readActionsConfig() {
  const filePath = await path.resolveResource(`template/${ACTIONS_CONFIG_PATH}`);
  const fileExists = await fs.exists(filePath);

  if (!fileExists) {
    throw new Error('Configuration file for CI not found');
  }
  const content = await fs.readTextFile(filePath);

  return content;
}
