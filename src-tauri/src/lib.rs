#[macro_use]
mod api;

#[macro_use]
mod utils;

use api::*;
use tauri::{AppHandle, Runtime};
use utils::*;
use tauri::WebviewWindow;

#[cfg(mobile)]
use tauri_plugin_ahqstore::{AHQStorePluginExt, AHQStorePlugin, AppInstallResponse};

use std::env::consts::ARCH;

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
            get_total, get_map, get_search, get_commit, get_app_asset_url, get_app, get_home, load_apk, get_andy_build, get_os_info, get_app_asset
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command(async)]
fn get_os_info() -> (&'static str, String) {
    (ARCH, std::fs::read_to_string("/proc/cpuinfo").unwrap())
}

#[tauri::command(async)]
fn get_andy_build<R: Runtime>(app: AppHandle<R>) -> (u64, String) {
    #[cfg(desktop)]
    unimplemented!();

    let ahqstore: &AHQStorePlugin<R> = app.store_plugin();

    let info = ahqstore.get_android_build().unwrap();

    (info.sdk, info.release)
}

#[tauri::command(async)]
#[cfg(desktop)]
fn load_apk() {
    unimplemented!()
}

#[tauri::command(async)]
#[cfg(mobile)]
fn load_apk<R: Runtime>(app: AppHandle<R>, path: String) -> tauri_plugin_ahqstore::Result<AppInstallResponse> {
    let ahqstore: &AHQStorePlugin<R> = app.store_plugin();

    ahqstore.install_apk(path)
}