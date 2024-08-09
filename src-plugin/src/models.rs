use serde::{Deserialize, Serialize};

pub type InstallAppPath = String;
pub type IsInstalledStr = String;

#[derive(Debug, Clone, Default, Deserialize, Serialize)]
pub struct AppInstallResponse {
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