use std::collections::HashMap;

use crate::{cache, get_commit, get_total};
use ahqstore_types::internet;

use super::runtime_cache::{self, Map, Search, Val};

#[tauri::command]
pub async fn get_search() -> Option<&'static Search> {
  let cache = cache!("SEARCH_DATA");

  if let Some(Val::Search(x)) = &cache {
    return Some(x);
  }

  let comm = get_commit().await;

  let mut val = vec![];
  let mut total = internet::get_total_maps(comm).await?;

  while total != 0 {
    val.append(&mut internet::get_search(comm, &total.to_string()).await?);
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
    let s = internet::get_map(comm, &total.to_string()).await?;

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