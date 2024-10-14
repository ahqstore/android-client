import { invoke } from "@tauri-apps/api/core";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

const win = getCurrentWebviewWindow();

win.listen("data", (payload) => {
  console.warn(payload);
});

invoke("download_apk", { url: "http://192.168.29.218:1420/ahq.apk", name: "ahq" })
  .catch((e) => console.warn("Download error", e))
  .then((d) => {
    console.warn(d);

    invoke("load_apk", { name: "ahq" }).catch((e) => console.warn("Load APK Failed!", e));
  });