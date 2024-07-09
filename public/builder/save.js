(function (window) {
  "use strict";

  const API = window.__TAURI__;
  const { invoke } = API;
  const { createDir, removeDir, writeTextFile } = API.fs;
  const { join, appDataDir } = API.path;

  const urlParams = new URLSearchParams(window.location.search);
  const quizId = Number(urlParams.get('quiz_id'));
  const language = urlParams.get('language');

  async function getBasePathParts() {
    const appDataDirPath = await appDataDir();
    return [appDataDirPath, 'builder', quizId.toString(), 'data', language];
  }

  async function save(fbInstances) {
    const basePathParts = await getBasePathParts();
    const basePath = await join(...basePathParts);

    const basePathExists = await API.fs.exists(basePath);
    if (basePathExists) {
      await removeDir(basePath, { recursive: true });
    }

    const entries = Object.entries(fbInstances);
    const pageCount = entries.length;
    let questionCount = 0;

    for (const [slug, fbInstance] of entries) {
      const formData = fbInstance.actions.getData();
      for (const item of formData) {
        if (['header', 'paragraph'].includes(item.type)) continue;
        questionCount++;
      }
      for (const item of formData) {
        if (item.label) {
          item.label = item.label.replaceAll('<br>', '');
          item.label = item.label.replaceAll('&nbsp;', ' ');
        }
      }

      const directoryPath = await join(...basePathParts, slug);
      const filePath = await join(...basePathParts, slug, `${slug}.json`);

      await createDir(directoryPath, { recursive: true });
      await writeTextFile(filePath, JSON.stringify({ formData }));
    }

    await invoke('locale_update_question_counter', {
      quizId,
      language,
      pageCount,
      questionCount,
    });
  }

  window.save = save;
})(window);
