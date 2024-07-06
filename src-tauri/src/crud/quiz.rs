use rusqlite::{named_params, Connection};
use serde::Serialize;

use crate::error::CommandResult;
use crate::state::ServiceAccess;
use tauri::AppHandle;

use crate::utils::time;

use crate::crud::locale;

const DETAILS_COMPLETED: u8 = 1;
const QUESTION_COMPLETED: u8 = 2;
const LOCALE_COMPLETED: u8 = 4;
const DEPLOYED: u8 = 8;

const STATE_SUM: u8 = DETAILS_COMPLETED + QUESTION_COMPLETED + LOCALE_COMPLETED + DEPLOYED;

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

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Website {
  owner: String,
  repo: String,
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
        state: 0,

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

fn update(db: &Connection, id: i64, name: &str, description: &str, language: &str) -> Result<(), rusqlite::Error> {
    let mut statement =
        db.prepare("UPDATE quizzes SET name = :name, description = :description, state = state | :state, updated_at = :updated_at WHERE id = :id")?;
    statement.execute(named_params! {
        ":id": id,
        ":name": name,
        ":description": description,
        ":state": DETAILS_COMPLETED,
        ":updated_at": time::now(),
    })?;

    locale::update_main_language(db, id, language)?;

    Ok(())
}

#[tauri::command]
pub async fn quiz_update(app_handle: AppHandle, id: i64, name: &str, description: &str, language: &str) -> CommandResult<()> {
    app_handle.db(|db| update(db, id, name, description, language))?;

    Ok(())
}

fn update_state(db: &Connection, id: i64, state: u8, checked: bool) -> Result<(), rusqlite::Error> {
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
    ":state": state,
    ":updated_at": time::now(),
  })?;

  Ok(())
}

pub fn update_locale_state(db: &Connection, id: i64, checked: bool) -> Result<(), rusqlite::Error> {
  update_state(db, id, LOCALE_COMPLETED, checked)?;
  Ok(())
}

pub fn update_question_state(db: &Connection, id: i64, checked: bool) -> Result<(), rusqlite::Error> {
  update_state(db, id, QUESTION_COMPLETED, checked)?;
  Ok(())
}

fn update_mode(db: &Connection, id: i64, mode: &str) -> Result<(), rusqlite::Error> {
  let mut statement =
    db.prepare("UPDATE quizzes SET mode = :mode, updated_at = :updated_at WHERE id = :id")?;
  statement.execute(named_params! {
    ":id": id,
    ":mode": mode,
    ":updated_at": time::now(),
  })?;

  Ok(())
}

#[tauri::command]
pub async fn quiz_update_mode(app_handle: AppHandle, id: i64, mode: &str) -> CommandResult<()> {
  app_handle.db(|db| update_mode(
    db, id, mode,
  ))?;

  Ok(())
}

pub fn mode(db: &Connection, id: i64) -> Result<String, rusqlite::Error> {
  db.query_row(
      "SELECT mode FROM quizzes WHERE id = :id",
      named_params! { ":id": id },
      |row| {
          Ok(row.get("mode")?)
      },
  )
}

#[tauri::command]
pub async fn quiz_mode(app_handle: AppHandle, id: i64) -> CommandResult<String> {
  let result = app_handle.db(|db| mode(db, id))?;

  Ok(result)
}

#[tauri::command]
pub async fn quiz_update_state(app_handle: AppHandle, id: i64, state: u8, checked: bool) -> CommandResult<()> {
  if (state & (state - 1)) == 0 && state <= STATE_SUM {
    app_handle.db(|db| update_state(
      db, id, state, checked
    ))?;
  }

  Ok(())
}

pub fn website(db: &Connection, id: i64) -> Result<Website, rusqlite::Error> {
  db.query_row(
      "SELECT owner, repo FROM quizzes WHERE id = :id",
      named_params! { ":id": id },
      |row| {
        Ok(Website {
          owner: row.get("owner")?,
          repo: row.get("repo")?,
        })
      },
  )
}

#[tauri::command]
pub async fn quiz_website(app_handle: AppHandle, id: i64) -> CommandResult<Website> {
  let result = app_handle.db(|db| website(db, id))?;

  Ok(result)
}

fn update_owner(db: &Connection, id: i64, owner: &str) -> Result<(), rusqlite::Error> {
  let mut statement =
    db.prepare("UPDATE quizzes SET owner = :owner, updated_at = :updated_at WHERE id = :id")?;
  statement.execute(named_params! {
    ":id": id,
    ":owner": owner,
    ":updated_at": time::now(),
  })?;

  Ok(())
}

#[tauri::command]
pub async fn quiz_update_owner(app_handle: AppHandle, id: i64, owner: &str) -> CommandResult<()> {
  app_handle.db(|db| update_owner(
    db, id, owner,
  ))?;

  Ok(())
}

fn update_repo(db: &Connection, id: i64, repo: &str) -> Result<(), rusqlite::Error> {
  let mut statement =
    db.prepare("UPDATE quizzes SET repo = :repo, updated_at = :updated_at WHERE id = :id")?;
  statement.execute(named_params! {
    ":id": id,
    ":repo": repo,
    ":updated_at": time::now(),
  })?;

  Ok(())
}

#[tauri::command]
pub async fn quiz_update_repo(app_handle: AppHandle, id: i64, repo: &str) -> CommandResult<()> {
  app_handle.db(|db| update_repo(
    db, id, repo,
  ))?;

  Ok(())
}

