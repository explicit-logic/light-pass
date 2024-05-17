use rusqlite::{named_params, Connection};
use serde::Serialize;

use crate::error::CommandResult;
use crate::state::ServiceAccess;
use tauri::AppHandle;

use crate::utils::time;

const DETAILS_COMPLETED: u8 = 1;
const CONFIGURATION_COMPLETED: u8 = 2;
const LOCALE_COMPLETED: u8 = 4;
const DEPLOYED: u8 = 8;

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Quiz {
  id: i64,
  pub name: String,
  description: String,

  state: i64,

  updated_at: i64,
  created_at: i64,
}

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct QuizListItem {
  id: i64,
  name: String,

  locale_count: i64,
  main_language: Option<String>,
  main_url: Option<String>,

  updated_at: i64,
  created_at: i64,
}

fn create(db: &Connection, quiz: &mut Quiz) -> Result<(), rusqlite::Error> {
    let mut statement = db.prepare(
    "INSERT INTO quizzes (name, description, state, updated_at, created_at) VALUES (:name, :description, :state, :updated_at, :created_at)"
)?;
    statement.execute(named_params! {
        ":name": quiz.name,
        ":description": quiz.description,
        ":state": quiz.state,
        ":updated_at": quiz.updated_at,
        ":created_at": quiz.created_at
    })?;
    quiz.id = db.last_insert_rowid();

    Ok(())
}

#[tauri::command]
pub async fn quiz_create(app_handle: AppHandle, name: &str, description: &str) -> CommandResult<Quiz> {
    let mut quiz = Quiz {
        id: 0,
        name: name.to_string(),
        description: description.to_string(),
        state: DETAILS_COMPLETED as i64,

        updated_at: time::now(),
        created_at: time::now(),
    };

    app_handle.db(|db| create(db, &mut quiz))?;

    Ok(quiz)
}

fn delete(db: &Connection, id: i64) -> Result<(), rusqlite::Error> {
    let mut statement = db.prepare("DELETE FROM quizzes WHERE id = :id")?;
    statement.execute(named_params! {
        ":id": id,
    })?;

    Ok(())
}

#[tauri::command]
pub async fn quiz_delete(app_handle: AppHandle, id: i64) -> CommandResult<()> {
    app_handle.db(|db| delete(db, id))?;

    Ok(())
}

fn many(db: &Connection) -> Result<Vec<QuizListItem>, rusqlite::Error> {
    let mut statement =
        db.prepare("
          SELECT 
            quizzes.*,
            (SELECT COUNT(*) FROM locales WHERE quiz_id = quizzes.id) AS locale_count,
            locales.language AS main_language,
            locales.url AS main_url
          FROM quizzes
            LEFT JOIN locales ON locales.quiz_id = quizzes.id AND main = 1
          ORDER BY id DESC
          LIMIT :limit OFFSET :offset
        ")?;
    let mut rows = statement.query(named_params! { ":limit": 50, ":offset": 0 })?;
    let mut items = Vec::new();

    while let Some(row) = rows.next()? {
        let quiz = QuizListItem {
            id: row.get("id")?,
            name: row.get("name")?,

            locale_count: row.get("locale_count")?,
            main_language: row.get("main_language")?,
            main_url: row.get("main_url")?,

            updated_at: row.get("updated_at")?,
            created_at: row.get("created_at")?,
        };

        items.push(quiz);
    }

    Ok(items)
}

#[tauri::command]
pub async fn quiz_many(app_handle: AppHandle) -> CommandResult<Vec<QuizListItem>> {
    let result = app_handle.db(|db| many(db))?;

    Ok(result)
}

pub fn one(db: &Connection, id: i64) -> Result<Quiz, rusqlite::Error> {
    db.query_row(
        "SELECT * FROM quizzes WHERE id = :id",
        named_params! { ":id": id },
        |row| {
            Ok(Quiz {
                id: row.get("id")?,
                name: row.get("name")?,
                state: row.get("state")?,
                description: row.get("description")?,
                updated_at: row.get("updated_at")?,
                created_at: row.get("created_at")?,
            })
        },
    )
}

#[tauri::command]
pub async fn quiz_one(app_handle: AppHandle, id: i64) -> CommandResult<Quiz> {
    let result = app_handle.db(|db| one(db, id))?;

    Ok(result)
}

fn update(db: &Connection, id: i64, name: &str, description: &str) -> Result<(), rusqlite::Error> {
    let mut statement =
        db.prepare("UPDATE quizzes SET name = :name, description = :description, updated_at = :updated_at WHERE id = :id")?;
    statement.execute(named_params! {
        ":id": id,
        ":name": name,
        ":description": description,
        ":updated_at": time::now(),
    })?;

    Ok(())
}

#[tauri::command]
pub async fn quiz_update(app_handle: AppHandle, id: i64, name: &str, description: &str) -> CommandResult<()> {
    app_handle.db(|db| update(db, id, name, description))?;

    Ok(())
}

fn update_configuration(db: &Connection, id: i64, checked: bool) -> Result<(), rusqlite::Error> {  let mut statement;
  if checked {
    statement = db.prepare("
      UPDATE quizzes
      SET state = state | :state, updated_at = :updated_at
      WHERE id = :id
    ")?;
  } else {
    statement = db.prepare("
      UPDATE quizzes
      SET state = state & (~:state), updated_at = :updated_at
      WHERE id = :id
    ")?;
  }

  statement.execute(named_params! {
    ":id": id,
    ":state": CONFIGURATION_COMPLETED,
    ":updated_at": time::now(),
  })?;

  Ok(())
}

#[tauri::command]
pub async fn quiz_update_configuration(app_handle: AppHandle, id: i64, checked: bool) -> CommandResult<()> {
  app_handle.db(|db| update_configuration(db, id, checked))?;

  Ok(())
}

pub fn update_locale_state(db: &Connection, id: i64, checked: bool) -> Result<(), rusqlite::Error> {
  let mut statement;
  if checked {
    statement = db.prepare("
      UPDATE quizzes
      SET state = state | :state, updated_at = :updated_at
      WHERE id = :id
    ")?;
  } else {
    statement = db.prepare("
      UPDATE quizzes
      SET state = state & (~:state), updated_at = :updated_at
      WHERE id = :id
    ")?;
  }

  statement.execute(named_params! {
    ":id": id,
    ":state": LOCALE_COMPLETED,
    ":updated_at": time::now(),
  })?;

  Ok(())
}
