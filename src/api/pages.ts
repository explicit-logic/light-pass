import { exists, readDir, readTextFile } from '@tauri-apps/api/fs';
import { appDataDir, join } from '@tauri-apps/api/path';

async function getBasePathParts(quizId: number, language: string) {
  const appDataDirPath = await appDataDir();
  const basePathParts = [appDataDirPath, 'builder', quizId.toString(), 'data', language];

  return basePathParts;
}

export async function getSlugs(quizId: number, language: string) {
  try {
    const basePathParts = await getBasePathParts(quizId, language);
    const directoryPath = await join(...basePathParts);
    const entries = await readDir(directoryPath);

    const slugs = [];

    for (const entry of entries) {
      if (!entry?.name || entry?.name?.startsWith('.')) {
        continue;
      }
      const filePath = await join(...basePathParts, entry.name, `${entry.name}.json`);
      const fileExists = await exists(filePath);

      if (fileExists) {
        slugs.push(entry.name);
      }
    }

    return slugs.sort();
  } catch {
    return [];
  }
}

export async function getPageData(quizId: number, language: string, slug?: string) {
  if (!slug) {
    return {
      formData: [],
    };
  }

  const basePathParts = await getBasePathParts(quizId, language);
  const filePath = await join(...basePathParts, slug, `${slug}.json`);

  try {
    const text = await readTextFile(filePath);
    return JSON.parse(text) as PageConfig;
  } catch {
    return {
      formData: [],
    };
  }
}
