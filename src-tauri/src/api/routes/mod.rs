use std::collections::HashMap;

use crate::{cache, get_commit, get_total, MAP_URL, SEARCH_URL};

use super::{runtime_cache::{self, Map, Search, SearchS, Val}, CLIENT};

#[tauri::command]
pub async fn get_search() -> Option<&'static Search> {
  let cache = cache!("SEARCH_DATA");

  if let Some(Val::Search(x)) = &cache {
    return Some(x);
  }

  let mut val = vec![];

  let comm = get_commit().await;
  let mut total = get_total().await?;

  while total != 0 {
    let mut s: Vec<SearchS> = CLIENT.get(
      SEARCH_URL.replace("{sha}", comm).replace("{id}", &total.to_string())
    )
    .send()
    .await
    .ok()?
    .json()
    .await
    .ok()?;

    val.append(&mut s);

    total -= 1;
  }

  runtime_cache::set("SEARCH_DATA".into(), Val::Search(val));

  if let Some(Val::Search(x)) = &cache {
    return Some(x);
  }
  None
}

#[tauri::command]
pub async fn get_map() -> Option<&'static Map> {
  let cache = cache!("APP_MAP_DATA");

  if let Some(Val::Map(x)) = &cache {
    return Some(x);
  }

  let mut val = HashMap::new();

  let comm = get_commit().await;
  let mut total = get_total().await?;

  while total != 0 {
    let s: Map = CLIENT.get(
      MAP_URL.replace("{sha}", comm).replace("{id}", &total.to_string())
    )
    .send()
    .await
    .ok()?
    .json()
    .await
    .ok()?;

    for (k, v) in s {
      val.insert(k, v);
    }

    total -= 1;
  }

  runtime_cache::set("APP_MAP_DATA".into(), Val::Map(val));

  if let Some(Val::Map(x)) = &cache {
    return Some(x);
  }
  None
}