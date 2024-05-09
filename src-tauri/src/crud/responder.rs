use rusqlite::{named_params, Connection};
use serde::Serialize;

use crate::error::CommandResult;
use crate::state::ServiceAccess;
use tauri::AppHandle;

use crate::utils::time;

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Responder {
    id: i64,
    quiz_id: i64,
    client_id: String,

    email: String,
    name: String,
    theme: String,
    group: String,
    context: String,

    completed: bool,

    language: String,
    platform: String,
    progress: i64,
    timezone: String,
    user_agent: String,

    connected_at: i64,
    finished_at: i64,
    started_at: i64,

    updated_at: i64,
    created_at: i64,
}

fn create(db: &Connection, responder: &mut Responder) -> Result<(), rusqlite::Error> {
  let mut statement = db.prepare(
    "
      INSERT INTO responders (
        quiz_id,
        client_id,
        email,
        name,
        theme,
        group,
        context,
        completed,
        language,
        platform,
        progress,
        timezone,
        user_agent,
        connected_at,
        finished_at,
        started_at,
        updated_at,
        created_at
      )
      VALUES (
        :quiz_id,
        :client_id,
        :email,
        :name,
        :theme,
        :group,
        :context,
        :completed,
        :language,
        :platform,
        :progress,
        :timezone,
        :user_agent,
        :connected_at,
        :finished_at,
        :started_at,
        :updated_at,
        :created_at
      )
    "
  )?;
  statement.execute(named_params! {
    ":quiz_id": responder.quiz_id,
    ":client_id": responder.client_id,
    ":email": responder.email,
    ":name": responder.name,
    ":theme": responder.theme,
    ":group": responder.group,
    ":context": responder.context,
    ":completed": responder.completed,
    ":language": responder.language,
    ":platform": responder.platform,
    ":progress": responder.progress,
    ":timezone": responder.timezone,
    ":user_agent": responder.user_agent,
    ":connected_at": responder.connected_at,
    ":finished_at": responder.finished_at,
    ":started_at": responder.started_at,
    ":updated_at": responder.updated_at,
    ":created_at": responder.created_at
  })?;
  responder.id = db.last_insert_rowid();

  Ok(())
}

#[tauri::command]
pub async fn responder_create(
    app_handle: AppHandle,

    quiz_id: i64,
    client_id: String,

    email: String,
    name: String,
    theme: String,
    group: String,
    context: String,

    language: String,
    platform: String,
    progress: i64,
    timezone: String,
    user_agent: String,

    connected_at: i64,
    started_at: i64,
) -> CommandResult<Responder> {
    let mut responder = Responder {
        id: 0,
        quiz_id,
        client_id,
        email,
        name,
        theme,
        group,
        context,
        completed: false,

        language,
        platform,
        progress,
        timezone,
        user_agent,

        connected_at,
        finished_at: 0,
        started_at,

        updated_at: time::now(),
        created_at: time::now(),
    };

    app_handle.db(|db| create(db, &mut responder))?;

    Ok(responder)
}

fn update_progress(
  db: &Connection,
  id: i64,
  progress: i64
) -> Result<(), rusqlite::Error> {
  let mut statement =
    db.prepare("
      UPDATE responders
      SET
        progress = :progress,
        updated_at = :updated_at
      WHERE id = :id
    ")?;
  statement.execute(named_params! {
      ":id": id,
      ":progress": progress,
      ":updated_at": time::now(),
  })?;

  Ok(())
}

#[tauri::command]
pub async fn responder_update_progress(
  app_handle: AppHandle,
  id: i64,
  progress: i64
) -> CommandResult<()> {
  app_handle.db(|db| update_progress(db, id, progress))?;

  Ok(())
}

fn complete(
  db: &Connection,
  id: i64,
) -> Result<(), rusqlite::Error> {
  let mut statement =
    db.prepare("
      UPDATE responders
      SET
        completed = 1,
        finished_at = :finished_at,
        updated_at = :updated_at
      WHERE id = :id
    ")?;
  statement.execute(named_params! {
      ":id": id,
      ":finished_at": time::now(),
      ":updated_at": time::now(),
  })?;

  Ok(())
}

#[tauri::command]
pub async fn responder_complete(
  app_handle: AppHandle,
  id: i64,
) -> CommandResult<()> {
  app_handle.db(|db| complete(db, id))?;

  Ok(())
}

fn delete_one(db: &Connection, id: i64) -> Result<(), rusqlite::Error> {
    let mut statement = db.prepare("DELETE FROM responders WHERE id = :id")?;
    statement.execute(named_params! { ":id": id })?;

    Ok(())
}

#[tauri::command]
pub async fn responder_delete_one(app_handle: AppHandle, id: i64) -> CommandResult<()> {
    app_handle.db(|db| delete_one(db, id))?;

    Ok(())
}

fn many(db: &Connection, quiz_id: i64) -> Result<Vec<Responder>, rusqlite::Error> {
  let mut statement =
      db.prepare("SELECT * FROM responders WHERE quiz_id = :quiz_id ORDER BY completed DESC, name ASC, email ASC LIMIT 100")?;
  let mut rows = statement.query(named_params! { ":quiz_id": quiz_id })?;
  let mut items = Vec::new();

  while let Some(row) = rows.next()? {
    let responder = Responder {
      id: row.get("id")?,
      quiz_id: row.get("quiz_id")?,
      client_id: row.get("client_id")?,
      email: row.get("email")?,
      name: row.get("name")?,
      theme: row.get("theme")?,
      group: row.get("group")?,
      context: row.get("context")?,
      completed: row.get("completed")?,

      language: row.get("language")?,
      platform: row.get("platform")?,
      progress: row.get("progress")?,
      timezone: row.get("timezone")?,
      user_agent: row.get("user_agent")?,

      connected_at: row.get("connected_at")?,
      finished_at: row.get("finished_at")?,
      started_at: row.get("started_at")?,

      updated_at: row.get("updated_at")?,
      created_at: row.get("created_at")?,
    };

    items.push(responder);
  }

  Ok(items)
}

#[tauri::command]
pub async fn responder_many(app_handle: AppHandle, quiz_id: i64) -> CommandResult<Vec<Responder>> {
    let result = app_handle.db(|db| many(db, quiz_id))?;

    Ok(result)
}

fn one(db: &Connection, id: i64) -> Result<Responder, rusqlite::Error> {
  db.query_row(
    "SELECT * FROM responders WHERE id = :id",
    named_params! { ":id": id },
    |row| {
        Ok(Responder {
          id: row.get("id")?,
          quiz_id: row.get("quiz_id")?,
          client_id: row.get("client_id")?,
          email: row.get("email")?,
          name: row.get("name")?,
          theme: row.get("theme")?,
          group: row.get("group")?,
          context: row.get("context")?,
          completed: row.get("completed")?,

          language: row.get("language")?,
          platform: row.get("platform")?,
          progress: row.get("progress")?,
          timezone: row.get("timezone")?,
          user_agent: row.get("user_agent")?,

          connected_at: row.get("connected_at")?,
          finished_at: row.get("finished_at")?,
          started_at: row.get("started_at")?,

          updated_at: row.get("updated_at")?,
          created_at: row.get("created_at")?,
        })
    },
  )
}

#[tauri::command]
pub async fn responder_one(app_handle: AppHandle, id: i64) -> CommandResult<Responder> {
    let responder = app_handle.db(|db| one(db, id))?;
    Ok(responder)
}
