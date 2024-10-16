use rusqlite::{named_params, Connection};
use serde::Serialize;
use serde_json::Value as JsonValue;
use tauri::AppHandle;
use crate::error::{CommandError, CommandResult};
use crate::state::ServiceAccess;

use crate::utils::time;
use crate::crud::page_result;

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Answer {
  id: i64,
  responder_id: i64,
  page: String,

  answer: JsonValue,

  updated_at: i64,
  created_at: i64,
}

fn hydrate_row(row: &rusqlite::Row<'_>) -> Result<Answer, rusqlite::Error> {
  let answer = serde_json::from_str(row.get::<_, String>("answer")?.as_str()).unwrap_or_default();

  Ok(Answer {
    id: row.get("id")?,
    responder_id: row.get("responder_id")?,
    page: row.get("page")?,
    answer,

    updated_at: row.get("updated_at")?,
    created_at: row.get("created_at")?,
  })
}

fn save(db: &Connection, answer: &mut Answer) -> Result<(), rusqlite::Error> {
  let mut statement = db.prepare("
    INSERT OR REPLACE INTO answers (
      responder_id, \"page\", answer, updated_at, created_at
    )
      VALUES (:responder_id, :page, :answer, :updated_at, :created_at)
    ")?;
    statement.execute(named_params! {
      ":responder_id": answer.responder_id,
      ":page": answer.page,
      ":answer": answer.answer,
      ":updated_at": answer.updated_at,
      ":created_at": answer.created_at
    })?;

  answer.id = db.last_insert_rowid();

  Ok(())
}

#[tauri::command]
pub async fn answer_save(
    app_handle: AppHandle,

    responder_id: i64,
    page: String,
    answer: JsonValue
) -> CommandResult<Answer> {
  let verified = app_handle.db(|db| page_result::check_verified(db, responder_id, page.to_owned()))?;

  if verified {
    return Err(CommandError::API(format!(
      "Answers for this page are verified!"
    )));
  }
  let mut answer = Answer {
    id: 0,
    responder_id,
    page: page.to_owned(),
    answer,

    updated_at: time::now(),
    created_at: time::now(),
  };

  app_handle.db(|db| save(db, &mut answer))?;

  Ok(answer)
}

fn many(db: &Connection, responder_id: i64) -> Result<Vec<Answer>, rusqlite::Error> {
  let mut statement =
    db.prepare("SELECT * FROM answers WHERE responder_id = :responder_id ORDER BY \"page\" ASC")?;
  let mut rows = statement.query(named_params! { ":responder_id": responder_id })?;
  let mut items = Vec::new();

  while let Some(row) = rows.next()? {
    let item = hydrate_row(row)?;
    items.push(item);
  }

  Ok(items)
}

#[tauri::command]
pub async fn answer_many(app_handle: AppHandle, responder_id: i64) -> CommandResult<Vec<Answer>> {
  let result = app_handle.db(|db| many(db, responder_id))?;

  Ok(result)
}

fn one(db: &Connection, responder_id: i64, page: &str) -> Result<Option<Answer>, rusqlite::Error> {
  let query = db.query_row(
    "SELECT * FROM answers WHERE responder_id = :responder_id AND \"page\" = :page",
    named_params! { ":responder_id": responder_id, ":page": page },
    hydrate_row,
  );

  match query {
    Ok(x) => Ok(Some(x)),
    Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
    Err(err) => Err(err),
  }
}

#[tauri::command]
pub async fn answer_one(app_handle: AppHandle, responder_id: i64, page: &str) -> CommandResult<Option<Answer>> {
  let answer = app_handle.db(|db| one(db, responder_id, page))?;
  Ok(answer)
}
