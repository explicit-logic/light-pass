import * as fs from '@tauri-apps/api/fs';
import * as path from '@tauri-apps/api/path';

import type { Quiz } from '@/models/Quiz';
import { QuizConfiguration } from '@/models/QuizConfiguration';

const FILE_NAME = 'quiz.json';

export async function create(quizId: Quiz['id'], configuration: Partial<QuizConfiguration>) {
  const defaultConfig = await readDefault();
  const dir = await getDataDir(quizId);
  const filePath = await path.join(dir, FILE_NAME);

  await fs.createDir(dir, { recursive: true });
  const data = merge(defaultConfig, configuration);
  const text = QuizConfiguration.toText(data);
  await fs.writeTextFile(filePath, text);
}

export async function createFromQuiz(quiz: Pick<Quiz, 'id' | 'repo'>) {
  await create(quiz.id, { quizId: quiz.id, basePath: quiz.repo });
}

export async function read(quizId: Quiz['id']) {
  const dir = await getDataDir(quizId);
  const filePath = await path.join(dir, FILE_NAME);
  const fileExists = await fs.exists(filePath);

  if (fileExists) {
    const text = await fs.readTextFile(filePath);

    return QuizConfiguration.fromText(text);
  }
}

async function readDefault() {
  const filePath = await path.resolveResource(`template/data/${FILE_NAME}`);
  const fileExists = await fs.exists(filePath);

  if (fileExists) {
    const text = await fs.readTextFile(filePath);

    return QuizConfiguration.fromText(text);
  }
}

export async function save(quizId: Quiz['id'], configuration: Partial<QuizConfiguration>) {
  const dir = await getDataDir(quizId);
  await fs.createDir(dir, { recursive: true });
  const filePath = await path.join(dir, FILE_NAME);
  const source = await read(quizId);

  if (!source) {
    await create(quizId, configuration);
  } else {
    const data = merge(source, configuration);
    const text = QuizConfiguration.toText(data);
    await fs.writeTextFile(filePath, text);
  }
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

function merge(source: QuizConfiguration | undefined, target: Partial<QuizConfiguration>) {
  if (!source) return target;

  for (const [field, value] of Object.entries(target)) {
    // @ts-expect-error it's okay
    source[field] = value;
  }

  return source;
}
