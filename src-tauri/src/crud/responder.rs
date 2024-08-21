use rusqlite::{named_params, Connection};
use serde::Serialize;
use serde_json::{self as json, Value as JsonValue};

use crate::error::CommandResult;
use crate::state::ServiceAccess;
use tauri::AppHandle;

use crate::utils::time;

// 10 minutes
const CONNECTION_EXPIRATION: u32 = 10 * 60 * 1000;

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
    context: JsonValue,

    completed: bool,
    identified: bool,
    verified: bool,

    language: String,
    platform: JsonValue,
    progress: i64,
    timezone: String,
    user_agent: String,

    mark: i64,

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
        \"group\",
        context,
        completed,
        identified,
        verified,
        language,
        mark,
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
        :identified,
        :verified,
        :language,
        :mark,
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
    ":identified": responder.identified,
    ":verified": responder.verified,
    ":language": responder.language,
    ":mark": responder.mark,
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
pub async fn responder_connect(
    app_handle: AppHandle,

    quiz_id: i64,
    client_id: String,
    language: String,

    platform: JsonValue,
    user_agent: String,
    timezone: String,
    theme: String
) -> CommandResult<Responder> {
    let mut responder = Responder {
        id: 0,
        quiz_id,
        client_id,
        email: "".to_string(),
        name: "".to_string(),
        theme,
        group: "".to_string(),
        context: JsonValue::Object(json::Map::new()),
        completed: false,
        identified: false,
        verified: false,

        language,
        platform,
        progress: 0,
        timezone,
        user_agent,

        mark: 0,

        connected_at: time::now(),
        finished_at: 0,
        started_at: 0,

        updated_at: time::now(),
        created_at: time::now(),
    };

    app_handle.db(|db| delete_unidentified(db))?;
    app_handle.db(|db| create(db, &mut responder))?;

    Ok(responder)
}

#[tauri::command]
pub async fn responder_create_manually(
    app_handle: AppHandle,

    quiz_id: i64,
    language: String,

    email: String,
    name: String,
    group: String,
) -> CommandResult<Responder> {
    let mut responder = Responder {
        id: 0,
        quiz_id,
        client_id: String::new(),
        email: email.to_lowercase(),
        name,
        theme: String::new(),
        group,
        context: JsonValue::Object(json::Map::new()),
        completed: false,
        identified: true,
        verified: false,

        language,
        platform: JsonValue::Object(json::Map::new()),
        progress: 0,
        timezone: String::new(),
        user_agent: String::new(),

        mark: 0,

        connected_at: 0,
        finished_at: 0,
        started_at: 0,

        updated_at: time::now(),
        created_at: time::now(),
    };

    app_handle.db(|db| create(db, &mut responder))?;

    Ok(responder)
}

fn update_progress(
  db: &Connection,
  quiz_id: i64,
  client_id: String,
  progress: i64
) -> Result<(), rusqlite::Error> {
  let mut statement =
    db.prepare("
      UPDATE responders
      SET
        progress = :progress,
        updated_at = :updated_at
      WHERE quiz_id = :quiz_id AND client_id = :client_id
    ")?;
  statement.execute(named_params! {
    ":quiz_id": quiz_id,
    ":client_id": client_id,
    ":progress": progress,
    ":updated_at": time::now(),
  })?;

  Ok(())
}

#[tauri::command]
pub async fn responder_update_progress(
  app_handle: AppHandle,
  quiz_id: i64,
  client_id: String,
  progress: i64
) -> CommandResult<()> {
  app_handle.db(|db| update_progress(db, quiz_id, client_id, progress))?;

  Ok(())
}

fn identify(
  db: &Connection,
  quiz_id: i64,
  client_id: String,
  email: String,
  name: Option<String>,
  group: Option<String>,
  context: Option<JsonValue>
) -> Result<(), rusqlite::Error> {
  let mut statement =
    db.prepare("
      UPDATE responders
      SET
        context = :context,
        email = :email,
        name = :name,
        \"group\" = :group,
        identified = 1,
        started_at = :started_at,
        updated_at = :updated_at
      WHERE quiz_id = :quiz_id AND client_id = :client_id
    ")?;
  statement.execute(named_params! {
    ":quiz_id": quiz_id,
    ":client_id": client_id,
    ":context": context.unwrap_or_default(),
    ":email": email,
    ":name": name.unwrap_or_default(),
    ":group": group.unwrap_or_default(),
    ":started_at": time::now(),
    ":updated_at": time::now(),
  })?;

  Ok(())
}

#[tauri::command]
pub async fn responder_identify(
  app_handle: AppHandle,
  quiz_id: i64,
  client_id: String,
  email: String,
  name: Option<String>,
  group: Option<String>,
  context: Option<JsonValue>
) -> CommandResult<()> {
  app_handle.db(|db| identify(db, quiz_id, client_id, email, name, group, context))?;

  Ok(())
}

fn complete(
  db: &Connection,
  quiz_id: i64,
  client_id: String
) -> Result<(), rusqlite::Error> {
  let mut statement =
    db.prepare("
      UPDATE responders
      SET
        completed = 1,
        finished_at = :finished_at,
        updated_at = :updated_at
      WHERE quiz_id = :quiz_id AND client_id = :client_id
    ")?;
  statement.execute(named_params! {
      ":quiz_id": quiz_id,
      ":client_id": client_id,
      ":finished_at": time::now(),
      ":updated_at": time::now(),
  })?;

  Ok(())
}

#[tauri::command]
pub async fn responder_complete(
  app_handle: AppHandle,
  quiz_id: i64,
  client_id: String
) -> CommandResult<()> {
  app_handle.db(|db| complete(db, quiz_id, client_id))?;

  Ok(())
}

fn delete_unidentified(db: &Connection) -> Result<(), rusqlite::Error> {
  let expired_at = time::now() - (CONNECTION_EXPIRATION as i64);

  let mut statement = db.prepare("DELETE FROM responders WHERE NOT identified AND connected_at < :expired_at")?;
  statement.execute(named_params! { ":expired_at": expired_at })?;

  Ok(())
}

fn delete_one(db: &Connection, quiz_id: i64, id: i64) -> Result<(), rusqlite::Error> {
    let mut statement = db.prepare("DELETE FROM responders WHERE quiz_id = :quiz_id AND id = :id")?;
    statement.execute(named_params! { ":quiz_id": quiz_id, ":id": id })?;

    Ok(())
}

#[tauri::command]
pub async fn responder_delete_one(app_handle: AppHandle, quiz_id: i64, id: i64) -> CommandResult<()> {
    app_handle.db(|db| delete_one(db, quiz_id, id))?;

    Ok(())
}

fn many(db: &Connection, quiz_id: i64, q: Option<String>) -> Result<Vec<Responder>, rusqlite::Error> {
  let mut sql = "SELECT * FROM responders".to_owned();
  let mut filter_components: Vec<String> = Vec::new();
  filter_components.push("quiz_id = :quiz_id".to_owned());

  let term = q.unwrap_or_default();
  if !term.is_empty() {
    filter_components.push(format!("(name LIKE '%{0}%' OR email LIKE '{0}%')", term.replace(" ", "%")));
  }
  sql.push_str(" WHERE ");
  sql.push_str(&filter_components.join(" AND "));
  sql.push_str(" ORDER BY completed DESC, name ASC, email ASC LIMIT 100");

  let mut statement = db.prepare(&sql)?;
  let mut rows = statement.query(named_params! { ":quiz_id": quiz_id })?;

  let mut items = Vec::new();

  while let Some(row) = rows.next()? {
    let context = serde_json::from_str(row.get::<_, String>("context")?.as_str()).unwrap_or_default();
    let platform = serde_json::from_str(row.get::<_, String>("platform")?.as_str()).unwrap_or_default();
    let responder = Responder {
      id: row.get("id")?,
      quiz_id: row.get("quiz_id")?,
      client_id: row.get("client_id")?,
      email: row.get("email")?,
      name: row.get("name")?,
      theme: row.get("theme")?,
      group: row.get("group")?,
      context,
      completed: row.get("completed")?,
      identified: row.get("identified")?,
      verified: row.get("verified")?,

      language: row.get("language")?,
      platform,
      progress: row.get("progress")?,
      timezone: row.get("timezone")?,
      user_agent: row.get("user_agent")?,

      mark: row.get("mark")?,

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
pub async fn responder_many(app_handle: AppHandle, quiz_id: i64, q: Option<String>) -> CommandResult<Vec<Responder>> {
  let result = app_handle.db(|db| many(db, quiz_id, q))?;

  Ok(result)
}

fn one(db: &Connection, id: i64) -> Result<Responder, rusqlite::Error> {
  db.query_row(
    "SELECT * FROM responders WHERE id = :id",
    named_params! { ":id": id },
    |row| {
      let context = serde_json::from_str(row.get::<_, String>("context")?.as_str()).unwrap_or_default();
      let platform = serde_json::from_str(row.get::<_, String>("platform")?.as_str()).unwrap_or_default();
        Ok(Responder {
          id: row.get("id")?,
          quiz_id: row.get("quiz_id")?,
          client_id: row.get("client_id")?,
          email: row.get("email")?,
          name: row.get("name")?,
          theme: row.get("theme")?,
          group: row.get("group")?,
          context,
          completed: row.get("completed")?,
          identified: row.get("identified")?,
          verified: row.get("verified")?,

          language: row.get("language")?,
          platform,
          progress: row.get("progress")?,
          timezone: row.get("timezone")?,
          user_agent: row.get("user_agent")?,

          mark: row.get("mark")?,

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
