use rusqlite::{named_params, Connection};
use serde::Serialize;

use crate::error::CommandResult;
use crate::state::ServiceAccess;
use tauri::AppHandle;

use crate::utils::time;

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Correction {
  id: i64,
  responder_id: i64,
  page: String,
  question: String,

  mark: i64,
  note: String,

  verified: bool,

  updated_at: i64,
  created_at: i64,
}

fn hydrate_row(row: &rusqlite::Row<'_>) -> Result<Correction, rusqlite::Error> {
  Ok(Correction {
    id: row.get("id")?,
    responder_id: row.get("responder_id")?,
    page: row.get("page")?,
    question: row.get("question")?,
    mark: row.get("mark")?,
    note: row.get("note")?,
    verified: row.get("verified")?,

    updated_at: row.get("updated_at")?,
    created_at: row.get("created_at")?,
  })
}

fn save(db: &Connection, correction: &mut Correction) -> Result<(), rusqlite::Error> {
  let mut statement = db.prepare("
    INSERT OR REPLACE INTO corrections (
      responder_id, \"page\", question, mark, note, verified, updated_at, created_at
    )
    VALUES (:responder_id, :page, :question, :mark, :note, :verified, :updated_at, :created_at)
  ")?;
  statement.execute(named_params! {
    ":responder_id": correction.responder_id,
    ":page": correction.page,
    ":question": correction.question,
    ":mark": correction.mark,
    ":note": correction.note,
    ":verified": correction.verified,
    ":updated_at": correction.updated_at,
    ":created_at": correction.created_at
  })?;

  correction.id = db.last_insert_rowid();

  Ok(())
}

#[tauri::command]
pub async fn correction_save(
  app_handle: AppHandle,

  responder_id: i64,
  page: String,
  question: String,
  mark: i64,
  note: String,
  verified: bool,
) -> CommandResult<Correction> {
  let mut correction = Correction {
    id: 0,
    responder_id,
    page,
    question,

    mark,
    note,

    verified,

    updated_at: time::now(),
    created_at: time::now(),
  };

  app_handle.db(|db| save(db, &mut correction))?;

  Ok(correction)
}

fn many_on_page(db: &Connection, responder_id: i64, page: String) -> Result<Vec<Correction>, rusqlite::Error> {
  let mut statement =
    db.prepare("SELECT * FROM corrections WHERE responder_id = :responder_id AND \"page\" = :page ORDER BY question ASC")?;
  let mut rows = statement.query(named_params! { ":responder_id": responder_id, ":page": page })?;
  let mut items = Vec::new();

  while let Some(row) = rows.next()? {
    let item = hydrate_row(row)?;
    items.push(item);
  }

  Ok(items)
}

#[tauri::command]
pub async fn correction_many_on_page(app_handle: AppHandle, responder_id: i64, page: String) -> CommandResult<Vec<Correction>> {
  let result = app_handle.db(|db| many_on_page(db, responder_id, page))?;

  Ok(result)
}

fn insert_mark(db: &Connection, responder_id: i64, page: String, question: String, mark: i64) -> Result<(), rusqlite::Error> {
  let mut statement = db.prepare("
    INSERT OR REPLACE INTO corrections (
      responder_id, \"page\", question, mark, verified, updated_at, created_at
    )
    VALUES (:responder_id, :page, :question, :mark, true, :updated_at, :created_at)
  ")?;
  statement.execute(named_params! {
    ":responder_id": responder_id,
    ":page": page,
    ":question": question,
    ":mark": mark,

    ":updated_at": time::now(),
    ":created_at": time::now(),
  })?;

  Ok(())
}

fn update_mark(db: &Connection, responder_id: i64, page: String, question: String, mark: i64) -> Result<(), rusqlite::Error> {
  let mut statement = db.prepare("
    UPDATE corrections
    SET mark = :mark, verified = true, updated_at = :updated_at
    WHERE responder_id = :responder_id AND \"page\" = :page AND question = :question
  ")?;
  statement.execute(named_params! {
    ":responder_id": responder_id,
    ":page": page,
    ":question": question,
    ":mark": mark,

    ":updated_at": time::now(),
  })?;

  Ok(())
}

fn exists_row(db: &Connection, responder_id: i64, page: String, question: String) -> Result<bool, rusqlite::Error> {
  let mut statement =
  db.prepare("SELECT 1 FROM corrections WHERE responder_id = :responder_id AND \"page\" = :page AND question = :question")?;
  let exists = statement.exists(named_params! {
    ":responder_id": responder_id,
    ":page": page,
    ":question": question,
  })?;

  Ok(exists)
}

#[tauri::command]
pub async fn correction_save_mark(app_handle: AppHandle, responder_id: i64, page: String, question: String, mark: i64) -> CommandResult<()> {
  let exists = app_handle.db(|db| exists_row(
    db, responder_id, page.to_owned(), question.to_owned(),
  ))?;

  if exists {
    app_handle.db(|db| update_mark(
      db, responder_id, page.to_owned(), question.to_owned(), mark
    ))?;
  } else {
    app_handle.db(|db| insert_mark(
      db, responder_id, page.to_owned(), question.to_owned(), mark
    ))?;
  }

  Ok(())
}
