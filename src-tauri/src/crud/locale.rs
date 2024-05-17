use rusqlite::{named_params, Connection};
use serde::Serialize;

use crate::error::CommandResult;
use crate::state::ServiceAccess;
use tauri::AppHandle;

use crate::utils::time;

use crate::crud::quiz;

const QUESTION_COMPLETED: u8 = 1;
const TEXT_COMPLETED: u8 = 2;

const STATE_SUM: u8 = QUESTION_COMPLETED + TEXT_COMPLETED;

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Locale {
    quiz_id: i64,
    language: String,
    main: bool,
    url: String,

    page_count: i64,
    question_count: i64,

    state: i64,

    updated_at: i64,
    created_at: i64,
}

fn create(db: &Connection, locale: &mut Locale) -> Result<(), rusqlite::Error> {
  let mut statement = db.prepare("
    INSERT INTO locales (
      quiz_id, language, main, url, state, page_count, question_count, updated_at, created_at
    )
      VALUES (:quiz_id, :language, :main, :url, :state, :page_count, :question_count, :updated_at, :created_at)
    ")?;
    statement.execute(named_params! {
        ":quiz_id": locale.quiz_id,
        ":language": locale.language,
        ":main": locale.main,
        ":url": locale.url,
        ":state": locale.state,
        ":page_count": locale.page_count,
        ":question_count": locale.question_count,
        ":updated_at": locale.updated_at,
        ":created_at": locale.created_at
    })?;

    Ok(())
}

#[tauri::command]
pub async fn locale_create(
    app_handle: AppHandle,
    quiz_id: i64,
    language: String,
    main: bool,
    url: String,
) -> CommandResult<Locale> {
    let mut locale = Locale {
        quiz_id,
        language,
        main,
        url,

        page_count: 0,
        question_count: 0,
        state: 0,

        updated_at: time::now(),
        created_at: time::now(),
    };

    app_handle.db(|db| create(db, &mut locale))?;

    Ok(locale)
}

fn delete_many(db: &Connection, quiz_id: i64) -> Result<(), rusqlite::Error> {
    let mut statement = db.prepare("DELETE FROM locales WHERE quiz_id = :quiz_id")?;
    statement.execute(named_params! {
        ":quiz_id": quiz_id,
    })?;

    Ok(())
}

#[tauri::command]
pub async fn locale_delete_many(app_handle: AppHandle, quiz_id: i64) -> CommandResult<()> {
    app_handle.db(|db| delete_many(db, quiz_id))?;

    Ok(())
}

fn many(db: &Connection, quiz_id: i64) -> Result<Vec<Locale>, rusqlite::Error> {
    let mut statement =
        db.prepare("SELECT * FROM locales WHERE quiz_id = :quiz_id ORDER BY main DESC, language ASC")?;
    let mut rows = statement.query(named_params! { ":quiz_id": quiz_id })?;
    let mut items = Vec::new();

    while let Some(row) = rows.next()? {
        let quiz = Locale {
            quiz_id: row.get("quiz_id")?,
            main: row.get("main")?,
            url: row.get("url")?,
            language: row.get("language")?,
            state: row.get("state")?,
            page_count: row.get("page_count")?,
            question_count: row.get("question_count")?,

            updated_at: row.get("updated_at")?,
            created_at: row.get("created_at")?,
        };

        items.push(quiz);
    }

    Ok(items)
}

#[tauri::command]
pub async fn locale_many(app_handle: AppHandle, quiz_id: i64) -> CommandResult<Vec<Locale>> {
    let result = app_handle.db(|db| many(db, quiz_id))?;

    Ok(result)
}

fn one(db: &Connection, quiz_id: i64, language: &str) -> Result<Locale, rusqlite::Error> {
    db.query_row(
        "SELECT * FROM locales WHERE quiz_id = :quiz_id AND language = :language",
        named_params! { ":quiz_id": quiz_id, ":language": language },
        |row| {
            Ok(Locale {
                quiz_id: row.get("quiz_id")?,
                language: row.get("language")?,
                main: row.get("main")?,
                url: row.get("url")?,

                state: row.get("state")?,
                page_count: row.get("page_count")?,
                question_count: row.get("question_count")?,

                updated_at: row.get("updated_at")?,
                created_at: row.get("created_at")?,
            })
        },
    )
}

#[tauri::command]
pub async fn locale_one(app_handle: AppHandle, quiz_id: i64, language: &str) -> CommandResult<Locale> {
    let locale = app_handle.db(|db| one(db, quiz_id, language))?;
    Ok(locale)
}

fn check_completion(db: &Connection, quiz_id: i64) -> Result<bool, rusqlite::Error> {
  db.query_row(
      "SELECT SUM(state) AS actual_state, (COUNT(*) * :state_sum) AS expected_state FROM locales WHERE quiz_id = :quiz_id GROUP BY quiz_id",
      named_params! { ":quiz_id": quiz_id, ":state_sum": STATE_SUM },
      |row| {
        let actual_state: i64 = row.get("actual_state")?;
        let expected_state: i64 = row.get("expected_state")?;
        let result: bool = actual_state == expected_state;

        Ok(result)
      },
  )
}

fn update_question_counter(db: &Connection, quiz_id: i64, language: &str, page_count: i64, question_count: i64) -> Result<(), rusqlite::Error> {
  let mut statement;

  if question_count == 0 {
    statement = db.prepare("
      UPDATE locales
      SET page_count = :page_count, question_count = :question_count, state = state & (~:state), updated_at = :updated_at
      WHERE quiz_id = :quiz_id AND language = :language
    ")?;
  } else {
    statement = db.prepare("
      UPDATE locales
      SET page_count = :page_count, question_count = :question_count, state = state | :state, updated_at = :updated_at
      WHERE quiz_id = :quiz_id AND language = :language
    ")?;
  }

  statement.execute(named_params! {
      ":quiz_id": quiz_id,
      ":language": language,
      ":state": QUESTION_COMPLETED,
      ":page_count": page_count,
      ":question_count": question_count,
      ":updated_at": time::now(),
  })?;

  let completed = if question_count == 0 { false } else { check_completion(db, quiz_id)? };

  quiz::update_locale_state(db, quiz_id, completed)?;

  Ok(())
}

#[tauri::command]
pub async fn locale_update_question_counter(app_handle: AppHandle, quiz_id: i64, language: &str, page_count: i64, question_count: i64) -> CommandResult<()> {
  app_handle.db(|db| update_question_counter(
    db, quiz_id, language, page_count, question_count,
  ))?;

  Ok(())
}

fn update_text_state(db: &Connection, quiz_id: i64, language: &str, checked: bool) -> Result<(), rusqlite::Error> {
  let mut statement;
  if checked {
    statement = db.prepare("
      UPDATE locales
      SET state = state | :state, updated_at = :updated_at
      WHERE quiz_id = :quiz_id AND language = :language
    ")?;
  } else {
    statement = db.prepare("
      UPDATE locales
      SET state = state & (~:state), updated_at = :updated_at
      WHERE quiz_id = :quiz_id AND language = :language
    ")?;
  }

  statement.execute(named_params! {
    ":quiz_id": quiz_id,
    ":state": TEXT_COMPLETED,
    ":language": language,
    ":updated_at": time::now(),
  })?;

  let completed = if checked { check_completion(db, quiz_id)? } else { false };

  quiz::update_locale_state(db, quiz_id, completed)?;

  Ok(())
}

#[tauri::command]
pub async fn locale_update_text_state(app_handle: AppHandle, quiz_id: i64, language: &str, checked: bool) -> CommandResult<()> {
  app_handle.db(|db| update_text_state(
    db, quiz_id, language, checked
  ))?;

  Ok(())
}
