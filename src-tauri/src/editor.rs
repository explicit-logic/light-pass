
use tauri::AppHandle;
use std::fs;
use crate::error::CommandResult;
use crate::state::ServiceAccess;

use crate::crud::quiz;

#[tauri::command]
pub async fn open_editor(handle: AppHandle, quiz_id: i64, language: String) -> CommandResult<()> {
  let quiz = handle.db(|db| quiz::one(db, quiz_id))?;
  let name = quiz.name;

  tauri::WindowBuilder::new(
    &handle,
    "editor",
    tauri::WindowUrl::App(format!("/editor/index.html?quiz_id={quiz_id}&language={language}").into())
  )
  .inner_size(1024., 768.)
  .title(format!("Editor - {name} [{language}]"))
  .build()
  .unwrap();

  Ok(())
}
