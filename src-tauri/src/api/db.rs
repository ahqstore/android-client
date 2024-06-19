use tauri::{App, Manager};

static mut APP_DB: Option<String> = None;

pub fn init_db(app: &App) {
  let s = app.path().app_data_dir().unwrap();

  let s = s.to_str().unwrap();
  let s=s.to_string();

  unsafe {
    APP_DB = Some(s);
  }
}