import { invoke } from '@tauri-apps/api';
import * as fs from '@tauri-apps/api/fs';
import * as path from '@tauri-apps/api/path';

import type { Quiz } from '@/models/Quiz';
import type { QuizConfiguration } from '@/models/QuizConfiguration';

const FILE_NAME = 'quiz.json';

export async function read(quizId: Quiz['id']) {
  const dir = await getDataDir(quizId);
  const filePath = await path.join(dir, FILE_NAME);
  const fileExists = await fs.exists(filePath);

  if (fileExists) {
    const text = await fs.readTextFile(filePath);
    const content = parse(text) as QuizConfiguration;
    content.basePath = content?.basePath?.replace(/^\//, '');

    return content;
  }
}

export async function save(quizId: Quiz['id'], configuration: QuizConfiguration) {
  const dir = await getDataDir(quizId);
  await fs.createDir(dir, { recursive: true });
  const filePath = await path.join(dir, FILE_NAME);
  configuration.basePath = `/${configuration.basePath}`;
  await fs.writeTextFile(filePath, JSON.stringify(configuration));
  await invoke('quiz_update_configuration', { id: quizId, checked: true });
}

async function getDataDir(quizId: Quiz['id']) {
  const appDataDirPath = await path.appDataDir();
  const dir = await path.join(appDataDirPath, 'builder', quizId.toString(), 'data');

  return dir;
}

function parse(content: string) {
  try {
    return JSON.parse(content);
  } catch {
    return {};
  }
}
