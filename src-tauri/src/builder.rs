
use tauri::AppHandle;
use std::fs;
use crate::error::CommandResult;
use crate::state::ServiceAccess;

use crate::crud::quiz;

#[tauri::command]
pub async fn open_builder(handle: AppHandle, quiz_id: i64, language: String) -> CommandResult<()> {
  let quiz = handle.db(|db| quiz::one(db, quiz_id))?;
  let name = quiz.name;

  tauri::WindowBuilder::new(
    &handle,
    "builder",
    tauri::WindowUrl::App(format!("/builder/index.html?quiz_id={quiz_id}&language={language}").into())
  )
  .inner_size(1024., 768.)
  .title(format!("Questions - {name} [{language}]"))
  .build()
  .unwrap();

  Ok(())
}

#[tauri::command]
pub async fn builder_save_page(
  handle: AppHandle,
  quiz_id: i64,
  language: &str,
  slug: &str,
  json: &str
) -> CommandResult<String> {
  let app_dir = handle
    .path_resolver()
    .app_data_dir()
    .expect("The app data directory should exist.");

  let page_dir = app_dir
    .join("builder")
    .join(quiz_id.to_string())
    .join(language)
    .join(slug);
  let json_path = page_dir.join(format!("{slug}.json"));

  fs::create_dir_all(&page_dir).expect("The page data directory should be created.");
  fs::write(&json_path, json).expect("The page data should be saved.");

  let path_str = json_path.into_os_string().into_string().unwrap();

  Ok(path_str)
}
