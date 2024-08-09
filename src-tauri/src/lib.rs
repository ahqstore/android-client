#[macro_use]
mod api;

#[macro_use]
mod utils;

use api::*;
use tauri::{AppHandle, Runtime};
use utils::*;
use tauri::WebviewWindow;

use tauri_plugin_ahqstore::{AHQStorePluginExt, AHQStorePlugin, AppInstallResponse};

static mut WINDOW: Option<WebviewWindow> = None;

pub fn get_window() -> &'static WebviewWindow {
    unsafe { WINDOW.as_ref().unwrap() }
}

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
            get_total, get_map, get_search, get_commit, get_app, get_home, load_apk, get_andy_build
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command(async)]
fn get_andy_build<R: Runtime>() -> (u64, String) {
    let ahqstore: &AHQStorePlugin<R> = app.store_plugin();

    let info = ahqstore.get_android_build().unwrap();

    (info.sdk, info.release)
}

#[tauri::command(async)]
fn load_apk<R: Runtime>(app: AppHandle<R>, path: String) -> tauri_plugin_ahqstore::Result<AppInstallResponse> {
    let ahqstore: &AHQStorePlugin<R> = app.store_plugin();

    ahqstore.install_apk(path)
}