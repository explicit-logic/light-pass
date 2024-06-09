import { invoke } from '@tauri-apps/api';
import * as fs from '@tauri-apps/api/fs';
import * as path from '@tauri-apps/api/path';

import type { Quiz } from '@/models/Quiz';
import { QuizConfiguration } from '@/models/QuizConfiguration';

const FILE_NAME = 'quiz.json';

export async function read(quizId: Quiz['id']) {
  const dir = await getDataDir(quizId);
  const filePath = await path.join(dir, FILE_NAME);
  const fileExists = await fs.exists(filePath);

  if (fileExists) {
    const text = await fs.readTextFile(filePath);

    return QuizConfiguration.fromText(text);
  }
}

export async function save(quizId: Quiz['id'], configuration: QuizConfiguration) {
  const dir = await getDataDir(quizId);
  await fs.createDir(dir, { recursive: true });
  const filePath = await path.join(dir, FILE_NAME);
  const text = QuizConfiguration.toText(configuration);
  await fs.writeTextFile(filePath, text);
  await invoke('quiz_update_configuration', { id: quizId, checked: true });
}

export async function updateBasePath(quizId: Quiz['id'], basePath: QuizConfiguration['basePath']) {
  const configuration = await read(quizId);
  if (!configuration) return;

  configuration.basePath = basePath;

  await save(quizId, configuration);
}

async function getDataDir(quizId: Quiz['id']) {
  const appDataDirPath = await path.appDataDir();
  const dir = await path.join(appDataDirPath, 'builder', quizId.toString(), 'data');

  return dir;
}
