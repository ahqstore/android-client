use std::collections::HashMap;

use lazy_static::lazy_static;
use ahqstore_types::{internet, AHQStoreApplication, APP_ASSET_URL};
use reqwest::{Client, ClientBuilder};
use runtime_cache::Val;

pub mod cache;
pub mod db;
mod runtime_cache;
mod routes;
pub mod downloader;

static mut COMMIT: Option<String> = None;

pub use routes::*;

lazy_static! {
  pub static ref CLIENT: Client = ClientBuilder::new()
    .user_agent("AHQ Store Android")
    .build()
    .unwrap();
}

#[macro_export]
macro_rules! cache {
    ($($x:tt)*) => {
      runtime_cache::get($($x)*)
    };
}

pub async fn init() {
  let sha: String = internet::get_commit(None).await.unwrap();

  let cache = cache::commit();

  let cac = || {
    cache::clear_cache();
    runtime_cache::init_cache(HashMap::new());
  };

  if &sha == &cache {
    if let Some(x) = cache::get_cache() {
      runtime_cache::init_cache(x);
    } else {
      cac();  
    }
  } else {
    cac();
  }

  println!("Got Commit: {}", &sha);
  unsafe { COMMIT = Some(sha); }
}

#[tauri::command]
pub async fn get_commit() -> &'static str {
  unsafe { &COMMIT.as_ref().unwrap() }
}

#[tauri::command(async)]
pub async fn get_total() -> Option<usize> {
  let sha = get_commit().await;

  internet::get_total_maps(sha).await
}

#[tauri::command]
pub async fn get_app(app_id: &str) -> Result<&'static AHQStoreApplication, ()> {
  let cache_id = format!("APP_{app_id}");
  let c = cache!(&cache_id);

  if let Some(Val::App(x)) = c {
    return Ok(x);
  }

  let app = internet::get_app(get_commit().await, app_id).await.map_or_else(|| Err(()), |x| Ok(x))?;

  runtime_cache::set(cache_id, Val::App(app));

  let cache_id = format!("APP_{app_id}");
  let c = cache!(&cache_id);

  if let Some(Val::App(x)) = c {
    return Ok(x);
  }
    
  Err(())
}

#[tauri::command]
pub async fn get_app_asset_url(app_id: &str, asset: u8) -> Result<String, ()> {
  Ok(APP_ASSET_URL.replace("{COMMIT}", get_commit().await).replace("{APP_ID}", app_id).replace("{ASSET}", &asset.to_string()))
}

#[tauri::command]
pub async fn get_app_asset(app_id: &str, asset: u8) -> Result<&'static Vec<u8>, ()> {
  let key = format!("APP_ASSET_{app_id}_{asset}");
  let c = cache!(&key);

  if let Some(Val::Asset(x)) = c {
    return Ok(x);
  }

  let asset_data = internet::get_app_asset(&get_commit().await, app_id, &asset.to_string()).await.map_or_else(|| Err(()), |x| Ok(x))?;

  runtime_cache::set(key, Val::Asset(asset_data));

  let key = format!("APP_ASSET_{app_id}_{asset}");
  let c = cache!(&key);

  if let Some(Val::Asset(x)) = c {
    return Ok(x);
  }

  Err(())
}

#[tauri::command]
pub async fn get_home() -> Option<&'static Vec<(String, Vec<String>)>> {
  let home = "HOME_DATA";
  let c = cache!(&home);

  if let Some(Val::Home(x)) = c {
    return Some(x);
  }

  let app = internet::get_home(&get_commit().await).await?;

  runtime_cache::set(home.into(), Val::Home(app));

  let c = cache!(&home);

  if let Some(Val::Home(x)) = c {
    return Some(x);
  }
    
  None
}