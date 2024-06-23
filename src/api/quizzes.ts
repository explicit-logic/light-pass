import { updateBasePath } from '@/api/configuration';
import { reset as resetDeploymentProcess } from '@/api/deploymentProcess';
import { removeAll as removeAllLocales } from '@/api/locales';
import { invoke } from '@tauri-apps/api';
import * as fs from '@tauri-apps/api/fs';
import * as path from '@tauri-apps/api/path';

import type { MODES } from '@/constants/deployment';
import type { languages } from '@/constants/languages';
import type { STATES } from '@/constants/quizzes';
import { Quiz } from '@/models/Quiz';

export type Website = {
  owner: string;
  repo: string;
};

export async function getMany() {
  const items = (await invoke('quiz_many')) as Quiz[];

  return items.map((item) => new Quiz(item));
}

export async function getMode(id: Quiz['id']) {
  const mode = (await invoke('quiz_mode', { id })) as (typeof MODES)[keyof typeof MODES];

  return mode;
}

export async function updateMode(id: Quiz['id'], mode: (typeof MODES)[keyof typeof MODES]) {
  await invoke('quiz_update_mode', { id, mode });
}

export async function getOne(id: Quiz['id']) {
  const item = (await invoke('quiz_one', { id })) as Quiz;

  return new Quiz(item);
}

export async function create(data: { name: string; description: string }) {
  const quiz = (await invoke('quiz_create', data)) as Quiz;

  return new Quiz(quiz);
}

export async function update(id: Quiz['id'], data: { name: string; description: string; language: keyof typeof languages }) {
  const quiz = (await invoke('quiz_update', { ...data, id })) as Quiz;

  return new Quiz(quiz);
}

export async function remove(id: Quiz['id']) {
  const appDataDirPath = await path.appDataDir();
  const directoryPath = await path.join(appDataDirPath, 'builder', id.toString());
  const directoryExists = await fs.exists(directoryPath);
  if (directoryExists) {
    await fs.removeDir(directoryPath, { recursive: true });
  }

  await resetDeploymentProcess(id);
  await removeAllLocales(id);

  await invoke('quiz_delete', { id });
}

export async function updateState(id: Quiz['id'], state: (typeof STATES)[keyof typeof STATES], checked = false) {
  await invoke('quiz_update_state', {
    id,
    state,
    checked,
  });
}

export async function getWebsite(id: Quiz['id']) {
  const item = (await invoke('quiz_website', { id })) as Website;

  return item;
}

export async function updateRepo(id: Quiz['id'], repo: string) {
  await invoke('quiz_update_repo', { id, repo });
  await updateBasePath(id, repo);
}

export async function updateOwner(id: Quiz['id'], owner: string) {
  await invoke('quiz_update_owner', { id, owner });
}
