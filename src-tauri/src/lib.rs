#[macro_use]
mod api;

#[macro_use]
mod utils;

use api::*;
use utils::*;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_ahqstore::init())
        .setup(|app| {
            api::cache::init_cache(app);
            api::db::init_db(app);

            tauri::async_runtime::block_on(async {
                api::init().await;
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_total, get_map, get_search, get_commit, get_app, get_home
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
