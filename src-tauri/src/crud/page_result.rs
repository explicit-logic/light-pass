use rusqlite::{named_params, Connection};
use serde::Serialize;
use tauri::AppHandle;
use crate::error::CommandResult;
use crate::state::ServiceAccess;

use crate::utils::time;

use crate::crud::correction;

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct PageResult {
  id: i64,
  responder_id: i64,
  page: String,

  points: i64,
  question_count: i64,
  verified: bool,

  updated_at: i64,
  created_at: i64,
}

fn hydrate_row(row: &rusqlite::Row<'_>) -> Result<PageResult, rusqlite::Error> {
  Ok(PageResult {
    id: row.get("id")?,
    responder_id: row.get("responder_id")?,
    page: row.get("page")?,
    points: row.get("points")?,
    question_count: row.get("question_count")?,
    verified: row.get("verified")?,

    updated_at: row.get("updated_at")?,
    created_at: row.get("created_at")?,
  })
}

pub fn check_verified(db: &Connection, responder_id: i64, page: String) -> Result<bool, rusqlite::Error> {
  let query = db.query_row(
    "SELECT verified FROM page_results WHERE responder_id = :responder_id AND page = :page",
    named_params! { ":responder_id": responder_id, ":page": page },
    |row| Ok(row.get("verified")),
  );

  match query {
    Ok(x) => x,
    Err(rusqlite::Error::QueryReturnedNoRows) => Ok(false),
    Err(err) => Err(err),
  }
}

fn save(db: &Connection, page_result: &mut PageResult) -> Result<(), rusqlite::Error> {
  let mut statement = db.prepare("
    INSERT OR REPLACE INTO page_results (
      responder_id, \"page\", points, question_count, verified, updated_at, created_at
    )
    VALUES (:responder_id, :page, :points, :question_count, :verified, :updated_at, :created_at)
  ")?;
  statement.execute(named_params! {
    ":responder_id": page_result.responder_id,
    ":page": page_result.page,
    ":points": page_result.points,
    ":question_count": page_result.question_count,
    ":verified": page_result.verified,

    ":updated_at": page_result.updated_at,
    ":created_at": page_result.created_at
  })?;

  page_result.id = db.last_insert_rowid();

  Ok(())
}

#[tauri::command]
pub async fn page_result_save(
    app_handle: AppHandle,

    responder_id: i64,
    page: String,
    points: i64,
    question_count: i64,
    verified: bool,
) -> CommandResult<PageResult> {
  let mut page_result = PageResult {
    id: 0,
    responder_id,
    page,

    points,
    question_count,
    verified,

    updated_at: time::now(),
    created_at: time::now(),
  };

  app_handle.db(|db| save(db, &mut page_result))?;

  Ok(page_result)
}

fn many(db: &Connection, responder_id: i64) -> Result<Vec<PageResult>, rusqlite::Error> {
  let mut statement =
    db.prepare("SELECT * FROM page_results WHERE responder_id = :responder_id ORDER BY \"page\" ASC")?;
  let mut rows = statement.query(named_params! { ":responder_id": responder_id })?;
  let mut items = Vec::new();

  while let Some(row) = rows.next()? {
    let item = hydrate_row(row)?;
    items.push(item);
  }

  Ok(items)
}

#[tauri::command]
pub async fn page_result_many(app_handle: AppHandle, responder_id: i64) -> CommandResult<Vec<PageResult>> {
  let result = app_handle.db(|db| many(db, responder_id))?;

  Ok(result)
}

pub fn get_points_sum(db: &Connection, responder_id: i64) -> Result<i64, rusqlite::Error> {
  let query = db.query_row(
    "SELECT COALESCE(SUM(points), 0) AS points_sum FROM page_results WHERE responder_id = :responder_id GROUP BY responder_id",
    named_params! { ":responder_id": responder_id },
    |row| Ok(row.get("points_sum")),
  );

  match query {
    Ok(x) => x,
    Err(rusqlite::Error::QueryReturnedNoRows) => Ok(0),
    Err(err) => Err(err),
  }
}

pub fn get_questions_sum(db: &Connection, responder_id: i64) -> Result<i64, rusqlite::Error> {
  let query = db.query_row(
    "SELECT COALESCE(SUM(question_count), 0) AS question_count FROM page_results WHERE responder_id = :responder_id GROUP BY responder_id",
    named_params! { ":responder_id": responder_id },
    |row| Ok(row.get("question_count")),
  );

  match query {
    Ok(x) => x,
    Err(rusqlite::Error::QueryReturnedNoRows) => Ok(0),
    Err(err) => Err(err),
  }
}

pub fn get_question_count(db: &Connection, responder_id: i64, page: String) -> Result<i64, rusqlite::Error> {
  let query = db.query_row(
    "SELECT question_count FROM page_results WHERE responder_id = :responder_id AND page = :page",
    named_params! { ":responder_id": responder_id, ":page": page },
    |row| Ok(row.get("question_count")),
  );

  match query {
    Ok(x) => x,
    Err(rusqlite::Error::QueryReturnedNoRows) => Ok(0),
    Err(err) => Err(err),
  }
}

fn exists_row(db: &Connection, responder_id: i64, page: String) -> Result<bool, rusqlite::Error> {
  let mut statement =
  db.prepare("SELECT 1 FROM page_results WHERE responder_id = :responder_id AND \"page\" = :page")?;
  let exists = statement.exists(named_params! {
    ":responder_id": responder_id,
    ":page": page,
  })?;

  Ok(exists)
}

pub fn save_question_count(db: &Connection, responder_id: i64, page: String, question_count: i64) -> Result<(), rusqlite::Error> {
  let exists = exists_row(db, responder_id, page.to_owned())?;
  if exists {
    let mut statement = db.prepare("
      UPDATE page_results
      SET question_count = :question_count, updated_at = :updated_at
      WHERE responder_id = :responder_id AND \"page\" = :page
    ")?;
    statement.execute(named_params! {
      ":responder_id": responder_id,
      ":page": page,
      ":question_count": question_count,

      ":updated_at": time::now(),
    })?;
  } else {
    let mut statement = db.prepare("
      INSERT OR REPLACE INTO page_results (
        responder_id, \"page\", question_count, updated_at, created_at
      )
      VALUES (:responder_id, :page, :question_count, :updated_at, :created_at)
    ")?;
    statement.execute(named_params! {
      ":responder_id": responder_id,
      ":page": page,
      ":question_count": question_count,

      ":updated_at": time::now(),
      ":created_at": time::now(),
    })?;
  }

  Ok(())
}

pub fn update_points(db: &Connection, responder_id: i64, page: String, points: i64) -> Result<(), rusqlite::Error> {
  let mut statement = db.prepare("
    UPDATE page_results
    SET points = :points, updated_at = :updated_at
    WHERE responder_id = :responder_id AND \"page\" = :page
  ")?;
  statement.execute(named_params! {
    ":responder_id": responder_id,
    ":page": page,
    ":points": points,

    ":updated_at": time::now(),
  })?;

  Ok(())
}

pub fn update_verified(db: &Connection, responder_id: i64, page: String, verified: bool) -> Result<(), rusqlite::Error> {
  let mut statement = db.prepare("
    UPDATE page_results
    SET verified = :verified, updated_at = :updated_at
    WHERE responder_id = :responder_id AND \"page\" = :page
  ")?;
  statement.execute(named_params! {
    ":responder_id": responder_id,
    ":page": page,
    ":verified": verified,

    ":updated_at": time::now(),
  })?;

  Ok(())
}

pub fn auto_evaluate(db: &Connection, responder_id: i64, page: String, question_count: i64) -> Result<(), rusqlite::Error> {
  save_question_count(db, responder_id, page.to_owned(), question_count)?;
  
  let correction_points_sum = correction::get_points_sum(db, responder_id, page.to_owned())?;
  update_points(db, responder_id, page.to_owned(), correction_points_sum)?;

  let verified_count = correction::get_verified_count(db, responder_id, page.to_owned())?;
  let verified = question_count > 0 && question_count == verified_count;
  update_verified(db, responder_id, page.to_owned(), verified)?;

  Ok(())
}

#[tauri::command]
pub async fn page_result_auto_evaluate(app_handle: AppHandle, responder_id: i64, page: String, question_count: i64) -> CommandResult<()> {
  app_handle.db(|db| auto_evaluate(db, responder_id, page, question_count))?;

  Ok(())
}

fn insert_question_count(db: &Connection, responder_id: i64, page: String, question_count: i64) -> Result<(), rusqlite::Error> {
  let mut statement = db.prepare("
    INSERT OR REPLACE INTO page_results (
      responder_id, \"page\", question_count, updated_at, created_at
    )
    VALUES (:responder_id, :page, :question_count, :updated_at, :created_at)
  ")?;
  statement.execute(named_params! {
    ":responder_id": responder_id,
    ":page": page,
    ":question_count": question_count,

    ":updated_at": time::now(),
    ":created_at": time::now(),
  })?;

  Ok(())
}

fn update_question_count(db: &Connection, responder_id: i64, page: String, question_count: i64) -> Result<(), rusqlite::Error> {
  let mut statement = db.prepare("
    UPDATE page_results
    SET question_count = :question_count, updated_at = :updated_at
    WHERE responder_id = :responder_id AND \"page\" = :page 
  ")?;
  statement.execute(named_params! {
    ":responder_id": responder_id,
    ":page": page,
    ":question_count": question_count,

    ":updated_at": time::now(),
  })?;

  Ok(())
}

#[tauri::command]
pub async fn page_result_save_question_count(app_handle: AppHandle, responder_id: i64, page: String, question_count: i64) -> CommandResult<()> {
  let exists = app_handle.db(|db| exists_row(
    db, responder_id, page.to_owned()
  ))?;

  if exists {
    app_handle.db(|db| update_question_count(
      db, responder_id, page.to_owned(), question_count
    ))?;
  } else {
    app_handle.db(|db| insert_question_count(
      db, responder_id, page.to_owned(), question_count
    ))?;
  }

  Ok(())
}
