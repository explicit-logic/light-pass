import { invoke } from '@tauri-apps/api';
import * as fs from '@tauri-apps/api/fs';
import * as path from '@tauri-apps/api/path';

import { DEFAULT_LANGUAGE } from '@/constants/languages';
import { STATES } from '@/constants/locales';
import type { Messages } from './messages.types';

import { setValue } from '@/helpers/setValue';
import type { Locale } from '@/models/Locale';
import type { Quiz } from '@/models/Quiz';

export async function read(quizId: Quiz['id'], language: Locale['language']) {
  const dir = await getMessagesDir(quizId);
  const filePath = await path.join(dir, `${language}.json`);
  const fileExists = await fs.exists(filePath);

  if (fileExists) {
    const content = await fs.readTextFile(filePath);

    return parse(content) as Messages;
  }
}

type CreateData = {
  id: Quiz['id'];
  name: Quiz['name'];
  description: Quiz['description'];
};

export async function create(quiz: CreateData, language: Locale['language']) {
  const messages = await readDefaultMessages(language);

  setValue(messages, 'Metadata.applicationName', quiz.name);
  setValue(messages, 'Metadata.title.default', quiz.name);
  setValue(messages, 'Metadata.title.template', `%s | ${quiz.name}`);
  setValue(messages, 'Metadata.description', quiz.description);
  setValue(messages, 'Home.title', quiz.name);

  const dir = await getMessagesDir(quiz.id);
  await fs.createDir(dir, { recursive: true });
  const filePath = await path.join(dir, `${language}.json`);
  await fs.writeTextFile(filePath, JSON.stringify(messages));

  await invoke('locale_update_state', { quizId: quiz.id, language, state: STATES.TEXT_COMPLETED, checked: true });

  return messages;
}

async function readDefaultMessages(language: Locale['language']) {
  const messageFilePath = await path.resolveResource(`template/messages/${language}.json`);
  const messageFileExists = await fs.exists(messageFilePath);

  if (messageFileExists) {
    const content = await fs.readTextFile(messageFilePath);

    return parse(content) as Messages;
  }

  const messageDefaultFilePath = await path.resolveResource(`template/messages/${DEFAULT_LANGUAGE}.json`);
  const content = await fs.readTextFile(messageDefaultFilePath);

  return parse(content) as Messages;
}

async function getMessagesDir(quizId: Quiz['id']) {
  const appDataDirPath = await path.appDataDir();
  const dir = await path.join(appDataDirPath, 'builder', quizId.toString(), 'messages');

  return dir;
}

function parse(content: string) {
  try {
    return JSON.parse(content);
  } catch {
    return {};
  }
}
