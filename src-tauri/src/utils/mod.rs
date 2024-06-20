use std::fmt::Display;

use crate::cache::CACHE_DIR;

pub fn get_apk_file<T: Display>(name: T) -> (String, T) {
  let cache = unsafe { 
    CACHE_DIR.as_ref().unwrap()
  };

  (format!("{}/apk/{}", cache, name), name)
}