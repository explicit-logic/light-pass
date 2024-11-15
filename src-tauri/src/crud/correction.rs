use rusqlite::{named_params, Connection};
use serde::Serialize;

use crate::error::{CommandError, CommandResult};
use crate::state::ServiceAccess;
use tauri::AppHandle;

use crate::utils::time;

use crate::crud::page_result;
use crate::crud::responder;

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Correction {
  id: i64,
  responder_id: i64,
  page: String,
  question: String,

  points: i64,
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
    points: row.get("points")?,
    note: row.get("note")?,
    verified: row.get("verified")?,

    updated_at: row.get("updated_at")?,
    created_at: row.get("created_at")?,
  })
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

fn insert_points(db: &Connection, responder_id: i64, page: String, question: String, points: i64, verified: bool) -> Result<(), rusqlite::Error> {
  let mut statement = db.prepare("
    INSERT OR REPLACE INTO corrections (
      responder_id, \"page\", question, points, verified, updated_at, created_at
    )
    VALUES (:responder_id, :page, :question, :points, :verified, :updated_at, :created_at)
  ")?;
  statement.execute(named_params! {
    ":responder_id": responder_id,
    ":page": page,
    ":question": question,
    ":points": points,
    ":verified": verified,

    ":updated_at": time::now(),
    ":created_at": time::now(),
  })?;

  Ok(())
}

fn update_points(db: &Connection, responder_id: i64, page: String, question: String, points: i64, verified: bool) -> Result<(), rusqlite::Error> {
  let mut statement = db.prepare("
    UPDATE corrections
    SET points = :points, verified = :verified, updated_at = :updated_at
    WHERE responder_id = :responder_id AND \"page\" = :page AND question = :question
  ")?;
  statement.execute(named_params! {
    ":responder_id": responder_id,
    ":page": page,
    ":question": question,
    ":points": points,
    ":verified": verified,

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

fn save_points(db: &Connection, responder_id: i64, page: String, question: String, points: i64, verified: bool) -> Result<(), rusqlite::Error> {
  let exists = exists_row(
    db, responder_id, page.to_owned(), question.to_owned(),
  )?;

  if exists {
    update_points(
      db, responder_id, page.to_owned(), question.to_owned(), points, verified
    )?;
  } else {
    insert_points(
      db, responder_id, page.to_owned(), question.to_owned(), points, verified
    )?;
  }

  Ok(())
}

#[tauri::command]
pub async fn correction_save_points(app_handle: AppHandle, responder_id: i64, page: String, question: String, points: i64) -> CommandResult<()> {
  let verified = app_handle.db(|db| responder::check_verified(db, responder_id))?;
  if verified {
    return Err(CommandError::API(format!("Responder verified!")));
  }
  app_handle.db(|db| save_points(
    db, responder_id, page.to_owned(), question.to_owned(), points, false
  ))?;

  Ok(())
}

fn evaluate(db: &Connection, responder_id: i64, page: String, question: String, points: i64) -> Result<i64, rusqlite::Error> {
  save_points(
    db, responder_id, page.to_owned(), question.to_owned(), points, true
  )?;

  let correction_points_sum = get_points_sum(db, responder_id, page.to_owned())?;
  page_result::update_points(db, responder_id, page.to_owned(), correction_points_sum)?;

  let question_count = page_result::get_question_count(db, responder_id, page.to_owned())?;
  let verified_count = get_verified_count(db, responder_id, page.to_owned())?;
  let verified = question_count > 0 && question_count == verified_count;
  page_result::update_verified(db, responder_id, page.to_owned(), verified)?;
  let auto_mark = responder::auto_evaluate(db, responder_id)?;

  Ok(auto_mark)
}

#[tauri::command]
pub async fn correction_evaluate(app_handle: AppHandle, responder_id: i64, page: String, question: String, points: i64) -> CommandResult<i64> {
  let verified = app_handle.db(|db| responder::check_verified(db, responder_id))?;
  if verified {
    return Err(CommandError::API(format!("Responder verified!")));
  }
  let auto_mark = app_handle.db(|db| evaluate(
    db, responder_id, page.to_owned(), question.to_owned(), points,
  ))?;

  Ok(auto_mark)
}

pub fn get_points_sum(db: &Connection, responder_id: i64, page: String) -> Result<i64, rusqlite::Error> {
  let query = db.query_row(
    "SELECT COALESCE(SUM(points), 0) AS mark_sum FROM corrections WHERE responder_id = :responder_id AND page = :page GROUP BY page",
    named_params! { ":responder_id": responder_id, ":page": page },
    |row| Ok(row.get("mark_sum")),
  );

  match query {
    Ok(x) => x,
    Err(rusqlite::Error::QueryReturnedNoRows) => Ok(0),
    Err(err) => Err(err),
  }
}

pub fn get_verified_count(db: &Connection, responder_id: i64, page: String) -> Result<i64, rusqlite::Error> {
  let query = db.query_row(
    "SELECT COALESCE(COUNT(*), 0) AS verified_count FROM corrections WHERE responder_id = :responder_id AND page = :page AND verified GROUP BY page",
    named_params! { ":responder_id": responder_id, ":page": page },
    |row| Ok(row.get("verified_count")),
  );

  match query {
    Ok(x) => x,
    Err(rusqlite::Error::QueryReturnedNoRows) => Ok(0),
    Err(err) => Err(err),
  }
}
