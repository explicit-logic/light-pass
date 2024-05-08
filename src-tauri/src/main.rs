// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod error;
mod crud;
mod database;
mod state;
mod utils;

use state::AppState;
use tauri::{Manager, State};

use crud::locale::*;
use crud::quiz::*;

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            db: Default::default(),
        })
        .invoke_handler(tauri::generate_handler![
            quiz_create,
            quiz_delete,
            quiz_many,
            quiz_one,
            quiz_update,

            locale_create,
            locale_delete_many,
            locale_many,
            locale_one,
        ])
        .setup(|app| {
            let handle = app.handle();

            let app_state: State<AppState> = handle.state();
            let db =
                database::initialize_database(&handle).expect("Database initialize should succeed");
            *app_state.db.lock().unwrap() = Some(db);

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
