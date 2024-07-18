(function (window) {
  "use strict";

  const API = window.__TAURI__;
  const { invoke } = API;
  const { readDir, readTextFile, createDir, removeDir, removeFile, writeTextFile } = API.fs;
  const { join, appDataDir } = API.path;

  const urlParams = new URLSearchParams(window.location.search);
  const quizId = Number(urlParams.get('quiz_id'));
  const language = urlParams.get('language');

  const PAGES_CONFIG_FILENAME = 'pages.json';
  let pagesConfig = {};

  let basePathParts;
  async function getBasePathParts() {
    if (basePathParts) return basePathParts;
    const appDataDirPath = await appDataDir();
    basePathParts = [appDataDirPath, 'builder', quizId.toString(), 'data', language];

    return basePathParts;
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

      return slugs.sort();
    } catch {
      return [];
    }
  }

  async function getPageData(slug) {
    const basePathParts = await getBasePathParts();
    const filePath = await join(...basePathParts, slug, `${slug}.json`);

    try {
      const text = await readTextFile(filePath);
      return JSON.parse(text);
    } catch {
      return {};
    }
  }

  async function updateQuestionCounter() {
    const slugs = await getSlugs();

    const pageCount = slugs.length;
    let questionCount = 0;
    for (const slug of slugs) {
      const { formData } = await getPageData(slug);

      if (formData && formData.length) {
        for (const item of formData) {
          if (['header', 'paragraph'].includes(item.type)) continue;
          questionCount++;
        }
      }
    }

    await invoke('locale_update_question_counter', {
      quizId,
      language,
      pageCount,
      questionCount,
    });
  }

  async function removePage(slug) {
    const basePathParts = await getBasePathParts();
    const directoryPath = await join(...basePathParts, slug);
    const directoryPathExists = await API.fs.exists(directoryPath);
    if (directoryPathExists) {
      await removeDir(directoryPath, { recursive: true });
    }
  }

  async function getPageFileNames(slug) {
    try {
      const basePathParts = await getBasePathParts();
      const directoryPath = await join(...basePathParts, slug);
      const entries = await readDir(directoryPath);
      const fileNames = [];

      const configFileName = `${slug}.json`;

      for (const entry of entries) {
        if (entry.name.startsWith('.') || entry.name === configFileName) {
          continue;
        }

        fileNames.push(entry.name);
      }

      return fileNames;
    } catch {
      return [];
    }
  }

  async function savePage(slug, formData = []) {
    const basePathParts = await getBasePathParts();
    const directoryPath = await join(...basePathParts, slug);
    const filePath = await join(...basePathParts, slug, `${slug}.json`);
    const filteredFormData = [];

    const fileNames = await getPageFileNames(slug);

    const srcMap = {};

    for (const item of formData) {
      if (item.label) {
        item.label = item.label.replaceAll('<br>', '');
        item.label = item.label.replaceAll('&nbsp;', ' ');
        if (item.label === 'Image') {
          item.label = '';
        }
      }

      if (item.type === 'image') {
        if (!item.src || !fileNames.includes(item.src)) continue;
        srcMap[item.src] = true;
        filteredFormData.push(item);
      } else {
        filteredFormData.push(item);
      }
    }

    for (const fileName of fileNames) {
      if (!srcMap[fileName]) {
        const filePath = await join(...basePathParts, slug, fileName);
        await removeFile(filePath);
      }
    }

    try {
      await createDir(directoryPath, { recursive: true });
      await writeTextFile(filePath, JSON.stringify({ formData: filteredFormData }));
    } catch (error) {
      console.error(error);
    }
  }

  function increaseSequence() {
    const { sequence = 0 } = pagesConfig;
    pagesConfig.sequence = sequence + 1;

    return pagesConfig.sequence;
  }

  function getPagesConfig() {
    return pagesConfig;
  }

  async function loadPagesConfig() {
    const basePathParts = await getBasePathParts();
    const filePath = await join(...basePathParts, PAGES_CONFIG_FILENAME);

    try {
      const text = await readTextFile(filePath);
      pagesConfig = JSON.parse(text);
    } catch {
      pagesConfig = {};
    } finally {
      return pagesConfig;
    }
  }

  async function savePagesConfig(active) {
    const basePathParts = await getBasePathParts();
    const directoryPath = await join(...basePathParts);
    await createDir(directoryPath, { recursive: true });
    const filePath = await join(...basePathParts, PAGES_CONFIG_FILENAME);
    await writeTextFile(filePath, JSON.stringify({ ...pagesConfig, active }));
  }

  for (const [name, fn] of Object.entries({
    increaseSequence,
    getBasePathParts,
    getPageData,
    getPagesConfig,
    getSlugs,
    loadPagesConfig,
    removePage,
    savePage,
    savePagesConfig,
    updateQuestionCounter,
  })) {
    window[name] = fn;
  }
})(window);
