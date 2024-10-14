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
  pub fn install_apk(&self, app_path: InstallAppPath) -> crate::Result<KotlinInstallUninstallResponse> {
    self
      .0
      .run_mobile_plugin("install", app_path)
      .map_err(Into::into)
  }

  pub fn uninstall_apk(&self, app_package_name: KotlinString) -> crate::Result<KotlinInstallUninstallResponse> {
    self
      .0
      .run_mobile_plugin("uninstall", app_package_name)
      .map_err(Into::into)
  }

  pub fn get_installed_apps(&self) -> crate::Result<InstalledAppsList> {
    self
      .0
      .run_mobile_plugin("getApps", None::<()>)
      .map_err(Into::into)
  }

  pub fn get_pkg_info(&self, app: KotlinString) -> crate::Result<Option<AppData>> {
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
