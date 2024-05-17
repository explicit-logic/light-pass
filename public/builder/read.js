(function (window) {
  "use strict";

  const API = window.__TAURI__;
  const { readDir, readTextFile } = API.fs;
  const { join, appDataDir } = API.path;

  const urlParams = new URLSearchParams(window.location.search);
  const quizId = Number(urlParams.get('quiz_id'));
  const language = urlParams.get('language');

  async function getBasePathParts() {
    const appDataDirPath = await appDataDir();
    return [appDataDirPath, 'builder', quizId.toString(), 'data', language];
  }

  async function getSlugs() {
    try {
      const basePathParts = await getBasePathParts();
      const directoryPath = await join(...basePathParts);
      const entries = await readDir(directoryPath);

      const slugs = [];

      for (const entry of entries) {
        if (entry.name.startsWith('.')) {
          continue;
        }
        const filePath = await join(...basePathParts, entry.name, `${entry.name}.json`);
        const fileExists = await API.fs.exists(filePath);

        if (fileExists) {
          slugs.push(entry.name);
        }
      }

      return slugs;
    } catch {
      return [];
    }
  }

  async function getPageData(slug) {
    const basePathParts = await getBasePathParts();
    const filePath = await join(...basePathParts, slug, `${slug}.json`);

    const content = await readTextFile(filePath);

    return content;
  }

  window.getPageData = getPageData;
  window.getSlugs = getSlugs;
})(window);
