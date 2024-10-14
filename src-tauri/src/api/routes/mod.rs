use crate::{cache, get_commit};
use ahqstore_types::{internet, methods::OfficialManifestSource};

use super::runtime_cache::{self, Map, Search, Val};

#[tauri::command]
pub async fn get_search() -> Option<&'static Search> {
  let cache = cache!("SEARCH_DATA");

  if let Some(Val::Search(x)) = &cache {
    return Some(x);
  }

  let comm = get_commit().await;

  let val = internet::get_all_search_by_source(OfficialManifestSource::AHQStore, comm).await?;

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

  let commit = get_commit().await;
  let val = internet::get_all_maps_by_source(OfficialManifestSource::AHQStore, commit).await?;

  runtime_cache::set("APP_MAP_DATA".into(), Val::Map(val));

  if let Some(Val::Map(x)) = &cache {
    return Some(x);
  }
  None
}