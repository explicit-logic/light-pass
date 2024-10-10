use rusqlite::{named_params, Connection};
use serde::Serialize;
use serde_json::{self as json, Value as JsonValue};
use tauri::AppHandle;
use crate::error::{CommandError, CommandResult};
use crate::state::ServiceAccess;

use crate::utils::time;

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Answer {
  id: i64,
  responder_id: i64,
  page: String,

  answer: JsonValue,

  score: i64,
  threshold: i64,

  verified: bool,

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
    score: row.get("score")?,
    threshold: row.get("threshold")?,
    verified: row.get("verified")?,

    updated_at: row.get("updated_at")?,
    created_at: row.get("created_at")?,
  })
}

fn check_verified(db: &Connection, responder_id: i64, page: String) -> Result<bool, rusqlite::Error> {
  let query = db.query_row(
    "SELECT verified FROM answers WHERE responder_id = :responder_id AND page = :page",
    named_params! { ":responder_id": responder_id, ":page": page },
    |row| Ok(row.get("verified")),
  );

  match query {
    Ok(x) => x,
    Err(rusqlite::Error::QueryReturnedNoRows) => Ok(false),
    Err(err) => Err(err),
  }
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

  let verified = app_handle.db(|db| check_verified(db, responder_id, page.to_owned()))?;

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

    score: 0,
    threshold: 0,

    verified: false,

    updated_at: time::now(),
    created_at: time::now(),
  };

  app_handle.db(|db| save(db, &mut answer))?;

  Ok(answer)
}

fn verify(
  db: &Connection,
  responder_id: i64,
  page: String,
  score: i64,
  threshold: i64,
) -> Result<(), rusqlite::Error> {
  let mut statement = db.prepare("
    UPDATE answers
    SET
      score = :score,
      threshold = :threshold,
      verified = 1,
      updated_at = :updated_at
    WHERE responder_id = :responder_id AND \"page\" = :page
  ")?;
  statement.execute(named_params! {
    ":responder_id": responder_id,
    ":page": page,
    ":score": score,
    ":threshold": threshold,
    ":updated_at": time::now()
  })?;

  Ok(())
}

#[tauri::command]
pub async fn answer_verify(
  app_handle: AppHandle,

  responder_id: i64,
  page: String,
  score: i64,
  threshold: i64,
) -> CommandResult<()> {

  app_handle.db(|db| verify(db, responder_id, page, score, threshold))?;

  Ok(())
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

fn one(db: &Connection, responder_id: i64, page: &str) -> Result<Answer, rusqlite::Error> {
  db.query_row(
    "SELECT * FROM answers WHERE responder_id = :responder_id AND \"page\" = :page",
    named_params! { ":responder_id": responder_id, ":page": page },
    hydrate_row,
  )
}

#[tauri::command]
pub async fn answer_one(app_handle: AppHandle, responder_id: i64, page: &str) -> CommandResult<Answer> {
  let locale = app_handle.db(|db| one(db, responder_id, page))?;
  Ok(locale)
}
