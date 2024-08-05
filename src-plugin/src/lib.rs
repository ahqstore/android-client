use tauri::{
  plugin::{Builder, TauriPlugin},
  Manager, Runtime,
};

pub use models::*;

#[cfg(mobile)]
mod mobile;

mod error;
mod models;

pub use error::{Error, Result};

#[cfg(mobile)]
pub use mobile::AHQStorePlugin;

/// Extensions to [`tauri::App`], [`tauri::AppHandle`] and [`tauri::Window`] to access the store-plugin APIs.
#[cfg(mobile)]
pub trait AHQStorePluginExt<R: Runtime> {
  fn store_plugin(&self) -> &AHQStorePlugin<R>;
}

#[cfg(mobile)]
impl<R: Runtime, T: Manager<R>> crate::AHQStorePluginExt<R> for T {
  fn store_plugin(&self) -> &AHQStorePlugin<R> {
    self.state::<AHQStorePlugin<R>>().inner()
  }
}

/// Initializes the plugin.
pub fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::new("store-plugin")
    .setup(|app, api| {
      #[cfg(mobile)]
      let store_plugin = mobile::init(app, api)?;

      #[cfg(mobile)]
      app.manage(store_plugin);

      Ok(())
    })
    .build()
}
