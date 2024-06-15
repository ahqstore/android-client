const COMMANDS: &[&str] = &["ping", "execute"];

fn main() {
  tauri_plugin::Builder::new(COMMANDS)
    .android_path("android")
    .build();
}
