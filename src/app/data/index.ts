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
  });

  const appData: ApplicationData = {
    ...data,
    icon: `data:image;base64,${data.icon}`,
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