use rusqlite::Connection;
use std::fs;
use tauri::AppHandle;

refinery::embed_migrations!("migrations");

/// Initializes the database connection, creating the .sqlite file if needed, and upgrading the database
/// if it's out of date.
pub fn initialize_database(app_handle: &AppHandle) -> Result<Connection, rusqlite::Error> {
    let app_dir = app_handle
        .path_resolver()
        .app_data_dir()
        .expect("The app data directory should exist.");
    fs::create_dir_all(&app_dir).expect("The app data directory should be created.");
    let sqlite_path = app_dir.join("light-pass.sqlite");

    let mut db = Connection::open(sqlite_path)?;

    migrations::runner().run(&mut db).unwrap();

    Ok(db)
}
