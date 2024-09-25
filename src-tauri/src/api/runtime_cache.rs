use std::collections::HashMap;
use ahqstore_types::{AHQStoreApplication, SearchEntry};
use serde_json::to_string;

use crate::cache::set_cache;

pub type Map = HashMap<String, String>;

pub type Search = Vec<SearchEntry>;

pub enum Val {
  App(AHQStoreApplication),
  Home(Vec<(String, Vec<String>)>),
  Map(Map),
  User(String),
  Search(Search),
  Asset(Vec<u8>)
}

macro_rules! str {
  ($($x:tt)*) => {
    to_string($($x)*).unwrap().leak().bytes().collect::<Vec<_>>()
  };
}

static mut CACHE_DIR: Option<HashMap<String, Val>> = None;

pub fn init_cache(cache: HashMap<String, Val>) {
  unsafe { CACHE_DIR = Some(cache) };
}

pub fn get(key: &str) -> Option<&'static Val> {
  unsafe {
    CACHE_DIR.as_ref().unwrap().get(key)
  }
}

pub fn set(key: String, val: Val) {
  unsafe {
    let (pre, data) = match &val {
      Val::App(a) => (1, str!(a)),
      Val::Home(a) => (2, str!(a)),
      Val::Map(a) => (3, str!(a)),
      Val::User(a) => (4, a.as_bytes().to_vec()),
      Val::Search(a) => (5, str!(a)),
      Val::Asset(a) => (6, a.as_slice().to_vec())
    };
    set_cache(&key, pre, &data);

    CACHE_DIR.as_mut().unwrap().insert(key, val);
  }
}