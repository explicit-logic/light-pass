// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod builder;
mod crud;
mod database;
mod editor;
mod error;
mod github;
mod state;
mod trace;
mod utils;

use state::AppState;
use tauri::{Manager, State};

use crud::deployment_process::*;
use crud::locale::*;
use crud::responder::*;
use crud::quiz::*;

fn main() {
    tauri::Builder::default()
        .manage(AppState {
            db: Default::default(),
        })
        .invoke_handler(tauri::generate_handler![
            builder::open_builder,
            builder::builder_save_page,

            editor::open_editor,

            deployment_process_update_indicator,
            deployment_process_upsert,
            deployment_process_many,
            deployment_process_reset,

            quiz_create,
            quiz_delete,
            quiz_many,
            quiz_one,
            quiz_update,
            quiz_update_state,

            quiz_website,
            quiz_update_owner,
            quiz_update_repo,

            quiz_mode,
            quiz_update_mode,

            locale_upsert,
            locale_delete_many,
            locale_delete_one,
            locale_many,
            locale_one,
            locale_update_question_counter,
            locale_update_state,
            locale_update_url,

            responder_create,
            responder_create_manually,
            responder_delete_one,
            responder_many,
            responder_one,
            responder_update_progress,
            responder_complete,

            github::init_device_oauth,
            github::check_auth_status,
            github::request_access_token,
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
