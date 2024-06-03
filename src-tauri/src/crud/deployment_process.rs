use rusqlite::{named_params, Connection};
use serde::Serialize;
use tauri::AppHandle;
use crate::error::CommandResult;
use crate::state::ServiceAccess;

use crate::utils::time;

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct DeploymentProcess {
  quiz_id: i64,
  stage: String,

  indicator: i64,
  order: i64,

  updated_at: i64,
  created_at: i64,
}

fn upsert(db: &Connection, deployment_process: &mut DeploymentProcess) -> Result<(), rusqlite::Error> {
  let mut statement = db.prepare("
    INSERT INTO deployment_process (
      quiz_id, stage, indicator, \"order\", updated_at, created_at
    )
      VALUES (:quiz_id, :stage, :indicator, :order, :updated_at, :created_at)
    ")?;
    statement.execute(named_params! {
      ":quiz_id": deployment_process.quiz_id,
      ":stage": deployment_process.stage,
      ":indicator": deployment_process.indicator,
      ":order": deployment_process.order,
      ":updated_at": deployment_process.updated_at,
      ":created_at": deployment_process.created_at
    })?;

    Ok(())
}

#[tauri::command]
pub async fn deployment_process_upsert(
    app_handle: AppHandle,
    quiz_id: i64,
    stage: String,
    indicator: i64,
    order: i64
) -> CommandResult<DeploymentProcess> {
    let mut deployment_process = DeploymentProcess {
        quiz_id,
        stage,
        indicator,
        order,

        updated_at: time::now(),
        created_at: time::now(),
    };

    app_handle.db(|db| upsert(db, &mut deployment_process))?;

    Ok(deployment_process)
}

fn reset(db: &Connection, quiz_id: i64) -> Result<(), rusqlite::Error> {
  let mut statement = db.prepare("DELETE FROM deployment_process WHERE quiz_id = :quiz_id")?;
  statement.execute(named_params! {
    ":quiz_id": quiz_id,
  })?;

  Ok(())
}

#[tauri::command]
pub async fn deployment_process_reset(app_handle: AppHandle, quiz_id: i64) -> CommandResult<()> {
    app_handle.db(|db| reset(db, quiz_id))?;

    Ok(())
}

fn many(db: &Connection, quiz_id: i64) -> Result<Vec<DeploymentProcess>, rusqlite::Error> {
  let mut statement =
      db.prepare("SELECT * FROM deployment_process WHERE quiz_id = :quiz_id ORDER BY \"order\" ASC")?;
  let mut rows = statement.query(named_params! { ":quiz_id": quiz_id })?;
  let mut items = Vec::new();

  while let Some(row) = rows.next()? {
      let deployment_process: DeploymentProcess = DeploymentProcess {
          quiz_id: row.get("quiz_id")?,
          stage: row.get("stage")?,
          indicator: row.get("indicator")?,
          order: row.get("order")?,

          updated_at: row.get("updated_at")?,
          created_at: row.get("created_at")?,
      };

      items.push(deployment_process);
  }

  Ok(items)
}

#[tauri::command]
pub async fn deployment_process_many(app_handle: AppHandle, quiz_id: i64) -> CommandResult<Vec<DeploymentProcess>> {
  let result = app_handle.db(|db| many(db, quiz_id))?;

  Ok(result)
}

fn update_indicator(db: &Connection, quiz_id: i64, stage: &str, indicator: i64) -> Result<(), rusqlite::Error> {
  let mut statement =
    db.prepare("UPDATE deployment_process SET indicator = :indicator, updated_at = :updated_at WHERE quiz_id = :quiz_id AND stage = :stage")?;
  statement.execute(named_params! {
    ":quiz_id": quiz_id,
    ":stage": stage,
    ":indicator": indicator,
    ":updated_at": time::now(),
  })?;

  Ok(())
}

#[tauri::command]
pub async fn deployment_process_update_indicator(app_handle: AppHandle, quiz_id: i64, stage: &str, indicator: i64) -> CommandResult<()> {
  app_handle.db(|db| update_indicator(
    db, quiz_id, stage, indicator,
  ))?;

  Ok(())
}
