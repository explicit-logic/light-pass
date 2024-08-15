import { invoke } from '@tauri-apps/api';
import * as fs from '@tauri-apps/api/fs';
import * as path from '@tauri-apps/api/path';

import type { Locale } from '@/models/Locale';
import type { Quiz } from '@/models/Quiz';

export async function clear(quizId: Quiz['id'], language: Locale['language']) {
  const appDataDirPath = await path.appDataDir();
  const dir = await path.join(appDataDirPath, 'builder', quizId.toString(), 'data', language);
  const dirExists = await fs.exists(dir);
  if (dirExists) {
    await fs.removeDir(dir, { recursive: true });
  }
  await invoke('locale_update_question_counter', {
    quizId,
    language,
    pageCount: 0,
    questionCount: 0,
  });
}
