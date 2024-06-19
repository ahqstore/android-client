use std::collections::HashMap;

use lazy_static::lazy_static;
use ahqstore_types::{AHQStoreApplication, Commit};
use reqwest::{Client, ClientBuilder};
use runtime_cache::Val;

pub mod cache;
pub mod db;
mod runtime_cache;

static mut COMMIT: Option<String> = None;

pub static TOTAL_URL: &'static str = "https://rawcdn.githack.com/ahqstore/data/{sha}/db/total";
pub static HOME_URL: &'static str = "https://rawcdn.githack.com/ahqstore/data/{sha}/db/home.json";
pub static APP_URL: &'static str =
  "https://rawcdn.githack.com/ahqstore/data/{sha}/db/apps/{app}.json";
pub static MAP_URL: &'static str =
  "https://rawcdn.githack.com/ahqstore/data/{sha}/db/map/{id}.json";
pub static SEARCH_URL: &'static str =
  "https://rawcdn.githack.com/ahqstore/data/{sha}/db/search/{id}.json";
pub static DEV_USER_URL: &'static str =
  "https://rawcdn.githack.com/ahqstore/data/{sha}/db/info/{dev}.json";

lazy_static! {
  static ref CLIENT: Client = ClientBuilder::new()
    .user_agent("AHQ Store Android")
    .build()
    .unwrap();
}

macro_rules! cache {
    ($($x:tt)*) => {
      runtime_cache::get($($x)*)
    };
}

pub async fn init() {
  let mut c: Vec<Commit> = CLIENT.get("https://api.github.com/repos/ahqstore/data/commits")
    .send()
    .await
    .unwrap()
    .json()
    .await
    .unwrap();

  let sha = c.remove(0).sha;

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

  CLIENT.get(TOTAL_URL.replace("{sha}", sha))
    .send()
    .await
    .ok()?
    .json()
    .await
    .ok()
}

#[tauri::command(async)]
pub fn get_app(app_id: &str) -> Option<&'static AHQStoreApplication> {
  let cache_id = format!("APP_{app_id}");
  let c = cache!(&cache_id);

  if let Some(Val::App(x)) = c {
    return Some(x);
  }

  let app: AHQStoreApplication = tauri::async_runtime::block_on(async {
    CLIENT.get(APP_URL
      .replace("{sha}", get_commit().await)
      .replace("{app}", &app_id)
    ).send()
    .await
    .ok()?
    .json()
    .await
    .ok()
  })?;

  runtime_cache::set(cache_id, Val::App(app));

  let cache_id = format!("APP_{app_id}");
  let c = cache!(&cache_id);

  if let Some(Val::App(x)) = c {
    return Some(x);
  }
    
  None
}

#[tauri::command]
pub async fn get_home() -> Option<&'static Vec<(String, Vec<String>)>> {
  let home = "HOME_DATA";
  let c = cache!(&home);

  if let Some(Val::Home(x)) = c {
    return Some(x);
  }

  let app = 
    CLIENT.get(HOME_URL
      .replace("{sha}", get_commit().await)
    ).send()
    .await
    .ok()?
    .json()
    .await
    .ok()?;

  runtime_cache::set(home.into(), Val::Home(app));

  let c = cache!(&home);

  if let Some(Val::Home(x)) = c {
    return Some(x);
  }
    
  None
}