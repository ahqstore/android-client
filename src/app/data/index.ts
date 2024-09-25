import { invoke } from "@tauri-apps/api/core";
import { ApplicationData } from "./fetchApps";

let sha = "";

const devUserUrl =
  "https://rawcdn.githack.com/ahqstore/data/{sha}/db/info/{dev}.json";

export async function getSha() {
  sha = await invoke<string>("get_commit");
}

export async function get_total() {
  return await invoke<number>("get_total");
}

export async function get_home() {
  const data = await invoke<[string, string[]][]>("get_home");
  console.log("Get Home", data);
  return data;
}

export function get_search_data<T>() {
  return invoke<T>("get_search");
}

export function get_map<T>(): Promise<T> {
  return invoke<T>("get_map");
}

export function get_sha() {
  return sha;
}

export async function get_app(app: string): Promise<ApplicationData> {
  const data = await invoke<ApplicationData>("get_app", {
    appId: app
  }).catch((e) => {
    console.log(e);

    return {
      app_page: "",
      appDisplayName: "Unknown Application",
      authorId: "%null",
      appId: "",
      description: "Unknown",
      appShortcutName: "",
      displayImages: [],
      downloadUrls: {},
      install: {
        free: () => { },
      },
      license_or_tos: "",
      releaseTagName: "",
      repo: {
        author: "",
        free: () => { },
        name: "",
        repo: ""
      },
      resources: {},
      site: "",
      source: "",
      version: ""
    } as ApplicationData
  });

  const appData: ApplicationData = {
    ...data
  };

  return appData;
}

export function install_app(_app: string) {
}

export function list_apps() {

}

export function get_library() {
}

export function un_install(_app: string) {

}

export { devUserUrl };