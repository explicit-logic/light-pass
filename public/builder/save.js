(function (window) {
  "use strict";

  const API = window.__TAURI__;
  const { invoke } = API;
  const { createDir, removeDir, writeTextFile } = API.fs;
  const { join, appDataDir } = API.path;

  const urlParams = new URLSearchParams(window.location.search);
  const quizId = Number(urlParams.get('quiz_id'));
  const language = urlParams.get('language');

  async function save(fbInstances) {
    const appDataDirPath = await appDataDir();
    const basePathParts = [appDataDirPath, 'builder', quizId.toString(), language];
    const basePath = await join(...basePathParts);

    const basePathExists = await API.fs.exists(basePath);
    if (basePathExists) {
      await removeDir(basePath, { recursive: true });
    }

    const entries = Object.entries(fbInstances);
    const pageCount = entries.length;
    let questionCount = 0;

    for (const [slug, fbInstance] of entries) {
      const json = fbInstance.formData;
      const data = fbInstance.actions.getData();
      for (const item of data) {
        if (['header', 'paragraph'].includes(item.type)) continue;
        questionCount++;
      }

      const directoryPath = await join(...basePathParts, slug);
      const filePath = await join(...basePathParts, slug, `${slug}.json`);

      await createDir(directoryPath, { recursive: true });
      await writeTextFile(filePath, json);
    }
    if (questionCount) {
      await invoke('locale_update_question_counter', {
        quizId,
        language,
        pageCount,
        questionCount,
      });
    } else {
      await invoke('locale_reset_question_counter', {
        quizId,
        language,
      });
    }
  }

  window.save = save;
})(window);
