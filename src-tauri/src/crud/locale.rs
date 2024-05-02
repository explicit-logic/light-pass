use rusqlite::{named_params, Connection};
use serde::Serialize;

use crate::error::CommandResult;
use crate::state::ServiceAccess;
use tauri::AppHandle;

use crate::utils::time;

#[derive(Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Locale {
    quiz_id: i64,
    language: String,
    main: bool,
    url: String,

    updated_at: i64,
    created_at: i64,
}

fn create(db: &Connection, locale: &mut Locale) -> Result<(), rusqlite::Error> {
    let mut statement = db.prepare(
    "INSERT INTO locales (quiz_id, language, main, url, updated_at, created_at) VALUES (:quiz_id, :language, :main, :url, :updated_at, :created_at)"
)?;
    statement.execute(named_params! {
        ":quiz_id": locale.quiz_id,
        ":language": locale.language,
        ":main": locale.main,
        ":url": locale.url,
        ":updated_at": locale.updated_at,
        ":created_at": locale.created_at
    })?;

    Ok(())
}

#[tauri::command]
pub fn locale_create(
    app_handle: AppHandle,
    quiz_id: i64,
    language: String,
    main: bool,
    url: String,
) -> CommandResult<Locale> {
    let mut quiz = Locale {
        quiz_id,
        language,
        main,
        url,

        updated_at: time::now(),
        created_at: time::now(),
    };

    app_handle.db(|db| create(db, &mut quiz))?;

    Ok(quiz)
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
        db.prepare("SELECT * FROM locales WHERE quiz_id = :quiz_id ORDER BY main ASC, language ASC")?;
    let mut rows = statement.query(named_params! { ":quiz_id": quiz_id })?;
    let mut items = Vec::new();

    while let Some(row) = rows.next()? {
        let quiz = Locale {
            quiz_id: row.get("quiz_id")?,
            main: row.get("main")?,
            url: row.get("url")?,
            language: row.get("language")?,

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
