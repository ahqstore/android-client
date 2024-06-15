use tauri::{
  plugin::{Builder, TauriPlugin},
  Manager, Runtime,
};

use std::{collections::HashMap, sync::Mutex};

pub use models::*;

#[cfg(desktop)]
mod desktop;
#[cfg(mobile)]
mod mobile;

mod commands;
mod error;
mod models;

pub use error::{Error, Result};

#[cfg(desktop)]
use desktop::StorePlugin;
#[cfg(mobile)]
use mobile::StorePlugin;

#[derive(Default)]
struct MyState(Mutex<HashMap<String, String>>);

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the store-plugin APIs.
pub trait StorePluginExt<R: Runtime> {
  fn store_plugin(&self) -> &StorePlugin<R>;
}

impl<R: Runtime, T: Manager<R>> crate::StorePluginExt<R> for T {
  fn store_plugin(&self) -> &StorePlugin<R> {
    self.state::<StorePlugin<R>>().inner()
  }
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::new("store-plugin")
    .invoke_handler(tauri::generate_handler![commands::execute])
    .setup(|app, api| {
      #[cfg(mobile)]
      let store_plugin = mobile::init(app, api)?;
      #[cfg(desktop)]
      let store_plugin = desktop::init(app, api)?;
      app.manage(store_plugin);

      // manage state so it is accessible by the commands
      app.manage(MyState::default());
      Ok(())
    })
    .build()
}
