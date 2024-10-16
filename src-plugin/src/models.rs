use serde::{Deserialize, Serialize};


#[derive(Debug, Clone, Default, Deserialize, Serialize)]
pub struct KotlinString {
  pub data: String
}

pub type InstallAppPath = KotlinString;
pub type IsInstalledStr = String;

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
pub struct InstalledAppsList {
  apps: Vec<String>
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
pub struct KotlinInstallUninstallResponse {
  pub success: bool,
  pub msg: String
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
pub struct AppData {
  pub package: String,
  pub version: String,
  pub json: String
}

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
pub struct AndroidData {
  pub sdk: u64,
  pub release: String
}