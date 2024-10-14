use std::{fs::{self, File}, io::Write};

use tauri::{Emitter, WebviewWindow};

use super::{cache::apk_path, CLIENT};

pub async fn download(url: &str, name: &str, window: Option<WebviewWindow>) -> Option<()> {
  let path = apk_path(name);

  let _ = fs::remove_file(&path);
  let _ = fs::write(&path, []).unwrap();

  let mut file = File::create(path).unwrap();

  let report = |data: &str| {
    if let Some(window) = &window {
      window.emit("data", data).unwrap();
    }
  };

  let mut stream = CLIENT.get(url)
    .send()
    .await
    .unwrap();

  let total = stream.content_length().unwrap();
  let mut c = 0u64;

  let mut perc= 0u64;
  while let Some(x) = stream.chunk().await.unwrap() {
    c += x.len() as u64;

    let percentage = (c*100)/total;
    if percentage != perc {
      println!("{}", percentage);
      report(&format!("{}", percentage));
      perc = percentage;
    }

    file.write_all(&x).ok()?;
  }

  println!("File Flush");
  file.flush().ok()?;

  println!("File OK");

  Some(())
}

#[tauri::command]
pub async fn download_apk(window: WebviewWindow, url: &str, name: &str) -> Result<(), ()> {
  download(url, name, Some(window)).await.map_or(Err(()), |()| Ok(()))
}