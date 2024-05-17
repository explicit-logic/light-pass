(function() {
  const API = window.__TAURI__;
  const { fs, path } = API;
  let unlisten;

  const urlParams = new URLSearchParams(window.location.search);
  const quizId = Number(urlParams.get('quiz_id'));
  const language = urlParams.get('language');

  // create the editor
  const editor = new JSONEditor(document.getElementById("jsoneditor"), {
    mode: 'form',
  });

  async function getFilePath() {
    const appDataDirPath = await path.appDataDir();
    const filePath = path.join(appDataDirPath, 'builder', quizId.toString(), 'messages', `${language}.json`);

    return filePath;
  }

  async function init() {
    const filePath = await getFilePath();
    const content = await fs.readTextFile(filePath);
    const json = parse(content);

    console.log(json);

    editor.set(json);

    unlisten = await API.window.WebviewWindow.getByLabel('editor').onCloseRequested(async (event) => {
      try {
        await save();
      } catch (error) {
        console.error(error);
        alert(error.message);
      }
    });
  }

  init();

  async function save() {
    const filePath = await getFilePath();

    const json = editor.get();
    await fs.writeTextFile(filePath, JSON.stringify(json));
  }

  function parse(content) {
    try {
      return JSON.parse(content);
    } catch {
      return {};
    }
  }
})();
