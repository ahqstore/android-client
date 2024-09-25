use std::{collections::{HashMap, VecDeque}, fs::{self, File}, io::Write};
use serde_json::from_str;
use tauri::{App, Manager};

use super::runtime_cache::Val;

pub static mut CACHE_DIR: Option<String> = None;

macro_rules! from_str {
  ($($x:tt)*) => {
    from_str($($x)*).ok()?
  };
}

pub fn init_cache(app: &App) {
  let s = app.path().app_cache_dir().unwrap();

  let s = s.to_str().unwrap();
  let s=s.to_string();

  let _ = fs::create_dir_all(&s);

  let apk_dir = format!("{}/apk", &s);
  let _ = fs::remove_dir_all(&apk_dir);
  let _ = fs::create_dir_all(apk_dir);

  unsafe {
    CACHE_DIR = Some(s);
  }
}

pub fn commit() -> String {
  let cache = unsafe {
    CACHE_DIR.as_ref().unwrap()
  };

  fs::read_to_string(format!("{cache}/commit")).unwrap_or("def".into())
}

pub fn clear_cache() {
  let cache = unsafe {
    CACHE_DIR.as_ref().unwrap()
  };

  let _ = fs::remove_dir_all(&cache);
  let _ = fs::create_dir_all(&cache);
}

pub fn set_cache(key: &str, pre: u8, data: &[u8]) -> Option<()> {
  let cache = unsafe {
    CACHE_DIR.as_ref().unwrap()
  };

  let _ = fs::remove_file(format!("{cache}/{key}"));
  
  let mut f = File::create(format!("{cache}/{key}")).ok()?;
  let _ = f.write(&[pre]);
  let _ = f.write_all(&data);

  let _ = f.flush();

  drop(f);

  Some(())
}

pub fn get_cache() -> Option<HashMap<String, Val>> {
  let mut h = HashMap::new();

  for k in fs::read_dir(unsafe { CACHE_DIR.as_ref().unwrap() }).ok()? {
    let k = k.unwrap();

    let key = k.file_name();
    let key = key.to_string_lossy().to_string();

    let data = fs::read(&key).ok()?;
    let mut data = VecDeque::from(data);

    let r#type = data.pop_front()?;

    let data = Vec::from(data);
    let data = String::from_utf8(data).ok()?;
    match r#type {
      0 => {}
      1 => {
        h.insert(key, Val::App(from_str!(&data)));
      }
      2 => {
        h.insert(key, Val::Home(from_str!(&data)));
      }
      3 => {
        h.insert(key, Val::Map(from_str!(&data)));
      }
      4 => {
        h.insert(key, Val::User(data));
      }
      5 => {
        h.insert(key, Val::Search(from_str!(&data)));
      }
      _ => return None
    }
  }
  
  Some(h)
}