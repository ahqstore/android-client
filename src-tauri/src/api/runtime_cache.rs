use std::collections::HashMap;
use ahqstore_types::AHQStoreApplication;
use serde_json::to_string;
use serde::{Serialize, Deserialize};

use crate::cache::set_cache;

pub type Map = HashMap<String, String>;

#[derive(Serialize, Deserialize)]
pub struct SearchS {
  pub app: String,
  pub title: String,
  pub id: String,
}
pub type Search = Vec<SearchS>;

pub enum Val {
  App(AHQStoreApplication),
  Home(Vec<(String, Vec<String>)>),
  Map(Map),
  User(String),
  Search(Search)
}

macro_rules! str {
    ($($x:tt)*) => {
        to_string($($x)*).unwrap()
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
      Val::User(a) => (4, a.clone()),
      Val::Search(a) => (5, str!(a))
    };
    set_cache(&key, pre, data.as_bytes().to_vec());

    CACHE_DIR.as_mut().unwrap().insert(key, val);
  }
}