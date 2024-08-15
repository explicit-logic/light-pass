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

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct LocaleUpsert {
  quiz_id: i64,
  language: String,
  main: bool,
  url: String,

  updated_at: i64,
  created_at: i64,
}

fn upsert(db: &Connection, locale: &mut LocaleUpsert) -> Result<(), rusqlite::Error> {
  let mut statement = db.prepare("
    INSERT INTO locales (
      quiz_id, language, main, url, updated_at, created_at
    )
      VALUES (:quiz_id, :language, :main, :url, :updated_at, :created_at)
    ")?;
    statement.execute(named_params! {
        ":quiz_id": locale.quiz_id,
        ":language": locale.language,
        ":main": locale.main,
        ":url": locale.url,
        ":updated_at": locale.updated_at,
        ":created_at": locale.created_at
    })?;

    quiz::update_locale_state(db, locale.quiz_id, false)?;

    Ok(())
}

#[tauri::command]
pub async fn locale_upsert(
    app_handle: AppHandle,
    quiz_id: i64,
    language: String,
    main: bool,
    url: String,
) -> CommandResult<LocaleUpsert> {
    let mut locale = LocaleUpsert {
        quiz_id,
        language,
        main,
        url,

        updated_at: time::now(),
        created_at: time::now(),
    };

    app_handle.db(|db| upsert(db, &mut locale))?;

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

fn delete_one(db: &Connection, quiz_id: i64, language: String) -> Result<(), rusqlite::Error> {
  let mut statement = db.prepare(
    "DELETE FROM locales WHERE quiz_id = :quiz_id AND language = :language"
  )?;
  statement.execute(named_params! {
    ":quiz_id": quiz_id,
    ":language": language
  })?;

  Ok(())
}

#[tauri::command]
pub async fn locale_delete_one(app_handle: AppHandle, quiz_id: i64, language: String) -> CommandResult<()> {
  app_handle.db(|db| delete_one(db, quiz_id, language))?;

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

fn check_is_main(db: &Connection, quiz_id: i64, language: &str) -> Result<bool, rusqlite::Error> {
  let query = db.query_row(
    "SELECT main FROM locales WHERE quiz_id = :quiz_id AND language = :language",
    named_params! { ":quiz_id": quiz_id, ":language": language },
    |row| Ok(row.get("main")),
  );

  match query {
    Ok(x) => x,
    Err(rusqlite::Error::QueryReturnedNoRows) => Ok(false),
    Err(err) => Err(err),
  }
}

fn update_state(db: &Connection, quiz_id: i64, language: &str, state: u8, checked: bool) -> Result<(), rusqlite::Error> {
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
    ":state": state,
    ":language": language,
    ":updated_at": time::now(),
  })?;

  let completed = if checked { check_completion(db, quiz_id)? } else { false };

  quiz::update_locale_state(db, quiz_id, completed)?;

  Ok(())
}

fn update_question_counter(db: &Connection, quiz_id: i64, language: &str, page_count: i64, question_count: i64) -> Result<(), rusqlite::Error> {
  let mut statement;

  statement = db.prepare("
    UPDATE locales
    SET page_count = :page_count, question_count = :question_count, updated_at = :updated_at
    WHERE quiz_id = :quiz_id AND language = :language
  ")?;

  statement.execute(named_params! {
    ":quiz_id": quiz_id,
    ":language": language,
    ":page_count": page_count,
    ":question_count": question_count,
    ":updated_at": time::now(),
  })?;

  update_state(db, quiz_id, language, QUESTION_COMPLETED, question_count > 0)?;

  let completed = if question_count == 0 { false } else { check_completion(db, quiz_id)? };

  quiz::update_locale_state(db, quiz_id, completed)?;

  let main = check_is_main(db, quiz_id, language)?;

  if main {
    quiz::update_question_state(db, quiz_id, question_count > 0)?;
  }

  Ok(())
}

#[tauri::command]
pub async fn locale_update_question_counter(app_handle: AppHandle, quiz_id: i64, language: &str, page_count: i64, question_count: i64) -> CommandResult<()> {
  app_handle.db(|db| update_question_counter(
    db, quiz_id, language, page_count, question_count,
  ))?;

  Ok(())
}

#[tauri::command]
pub async fn locale_update_state(app_handle: AppHandle, quiz_id: i64, language: &str, state: u8, checked: bool) -> CommandResult<()> {
  if (state & (state - 1)) == 0 && state <= STATE_SUM {
    app_handle.db(|db| update_state(
      db, quiz_id, language, state, checked
    ))?;
  }

  Ok(())
}

fn update_url(db: &Connection, quiz_id: i64, language: &str, url: &str) -> Result<(), rusqlite::Error> {
  let mut statement =
    db.prepare("UPDATE locales SET url = :url, updated_at = :updated_at WHERE quiz_id = :quiz_id AND language = :language")?;
  statement.execute(named_params! {
    ":quiz_id": quiz_id,
    ":language": language,
    ":url": url,
    ":updated_at": time::now(),
  })?;

  Ok(())
}

#[tauri::command]
pub async fn locale_update_url(app_handle: AppHandle, quiz_id: i64, language: &str, url: &str) -> CommandResult<()> {
  app_handle.db(|db| update_url(
    db, quiz_id, language, url,
  ))?;

  Ok(())
}

pub fn update_main_language(db: &Connection, quiz_id: i64, language: &str) -> Result<(), rusqlite::Error> {
  let mut statement =
    db.prepare("UPDATE locales SET language = :language, updated_at = :updated_at WHERE quiz_id = :quiz_id AND main = 1")?;
  statement.execute(named_params! {
    ":quiz_id": quiz_id,
    ":language": language,
    ":updated_at": time::now(),
  })?;

  Ok(())
}
