use serde::de::DeserializeOwned;
use tauri::{
  plugin::{PluginApi, PluginHandle},
  AppHandle, Runtime,
};

use crate::models::*;

const PLUGIN_IDENTIFIER: &str = "com.plugin.ahqstore";

// initializes the Kotlin or Swift plugin classes
pub fn init<R: Runtime, C: DeserializeOwned>(
  _app: &AppHandle<R>,
  api: PluginApi<R, C>,
) -> crate::Result<AHQStorePlugin<R>> {
  let handle = api.register_android_plugin(PLUGIN_IDENTIFIER, "AHQStore")?;
  
  Ok(AHQStorePlugin(handle))
}

/// Access to the store-plugin APIs.
pub struct AHQStorePlugin<R: Runtime>(PluginHandle<R>);

impl<R: Runtime> AHQStorePlugin<R> {
  pub fn install_apk(&self, payload: InstallAppPath) -> crate::Result<AppInstallResponse> {
    self
      .0
      .run_mobile_plugin("install", payload)
      .map_err(Into::into)
  }

  pub fn get_pkg_info(&self, app: &str) -> crate::Result<Option<AppData>> {
    self
      .0
      .run_mobile_plugin("getInstalledPkgInfo", app)
      .map_err(Into::into)
  }

  pub fn get_android_build(&self) -> crate::Result<AndroidData> {
    self
      .0
      .run_mobile_plugin("getAndroidBuild", ())
      .map_err(Into::into)
  }
}
