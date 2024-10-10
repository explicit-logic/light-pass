use rusqlite::{named_params, Connection};
use serde::Serialize;
use tauri::AppHandle;
use crate::error::CommandResult;
use crate::state::ServiceAccess;

use crate::utils::time;

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct PageResult {
  id: i64,
  responder_id: i64,
  page: String,

  score: i64,
  threshold: i64,
  verified: bool,

  updated_at: i64,
  created_at: i64,
}

fn hydrate_row(row: &rusqlite::Row<'_>) -> Result<PageResult, rusqlite::Error> {
  Ok(PageResult {
    id: row.get("id")?,
    responder_id: row.get("responder_id")?,
    page: row.get("page")?,
    score: row.get("score")?,
    threshold: row.get("threshold")?,
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
      responder_id, \"page\", score, threshold, verified, updated_at, created_at
    )
    VALUES (:responder_id, :page, :score, :threshold, :verified, :updated_at, :created_at)
  ")?;
  statement.execute(named_params! {
    ":responder_id": page_result.responder_id,
    ":page": page_result.page,
    ":score": page_result.score,
    ":threshold": page_result.threshold,
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
    score: i64,
    threshold: i64,
    verified: bool,
) -> CommandResult<PageResult> {
  let mut page_result = PageResult {
    id: 0,
    responder_id,
    page,

    score,
    threshold,
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
