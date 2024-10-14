#[macro_use]
mod api;

#[macro_use]
mod utils;

use api::*;
use api::downloader::download_apk;
use cache::apk_path;
use tauri::AppHandle;
use tauri::WebviewWindow;

#[cfg(mobile)]
use tauri_plugin_ahqstore::{KotlinString, InstallAppPath, InstalledAppsList, AHQStorePluginExt, AHQStorePlugin, KotlinInstallUninstallResponse};

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
            get_total, get_map, get_search, get_commit, get_app_asset_url, get_app, get_home, load_apk, get_andy_build, get_os_info, get_app_asset, download_apk, uninstall_apk, list_all_apps
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command(async)]
fn get_os_info() -> (&'static str, String) {
    (ARCH, std::fs::read_to_string("/proc/cpuinfo").unwrap())
}

#[tauri::command(async)]
fn get_andy_build(app: AppHandle) -> (u64, String) {
    #[cfg(desktop)]
    unimplemented!();

    let ahqstore: &AHQStorePlugin<tauri::Wry> = app.store_plugin();

    let info = ahqstore.get_android_build().unwrap();

    (info.sdk, info.release)
}

#[tauri::command]
async fn load_apk(app_handle: AppHandle, name: String) -> tauri_plugin_ahqstore::Result<KotlinInstallUninstallResponse> {
    let ahqstore: &AHQStorePlugin<tauri::Wry> = app_handle.store_plugin();

    let path = apk_path(&name);
    ahqstore.install_apk(InstallAppPath { data: path })
}

#[tauri::command]
async fn uninstall_apk(app_handle: AppHandle, package: String) -> tauri_plugin_ahqstore::Result<KotlinInstallUninstallResponse> {
    let ahqstore: &AHQStorePlugin<tauri::Wry> = app_handle.store_plugin();

    ahqstore.uninstall_apk(KotlinString { data: package })
}

#[tauri::command]
async fn list_all_apps(app_handle: AppHandle) -> tauri_plugin_ahqstore::Result<InstalledAppsList> {
    let ahqstore: &AHQStorePlugin<tauri::Wry> = app_handle.store_plugin();

    ahqstore.get_installed_apps()
}