import { invoke } from "@tauri-apps/api/core";
import { ApplicationData } from "./fetchApps";
import fetch from "./http";

let sha = "";

const totalUrl = "https://rawcdn.githack.com/ahqstore/data/{sha}/db/total";
const homeUrl = "https://rawcdn.githack.com/ahqstore/data/{sha}/db/home.json";
const appUrl =
  "https://rawcdn.githack.com/ahqstore/data/{sha}/db/apps/{app}.json";
const mapUrl =
  "https://rawcdn.githack.com/ahqstore/data/{sha}/db/map/{id}.json";
const searchUrl =
  "https://rawcdn.githack.com/ahqstore/data/{sha}/db/search/{id}.json";
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

export async function get_search_data<T>() {
  if (sha == "") {
    get_sha();
  }
  const map = [];

  const total = await get_total();

  for (let i = 1; i <= total; i++) {
    const url = searchUrl.replace("{sha}", sha).replace("{id}", i.toString());

    const val = await fetch(url, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true"
      }
    });

    map.push(...val.data);
  }

  console.log(map);
  return map as unknown as any as T;
}

export async function get_map<T>(): Promise<T> {
  if (sha == "") {
    get_sha();
  }
  let map = {};

  const total = await get_total();

  for (let i = 1; i <= total; i++) {
    const url = mapUrl.replace("{sha}", sha).replace("{id}", i.toString());

    const { data } = await fetch(url, {
      method: "GET"
    });

    map = { ...map, ...data };
  }

  return map as unknown as any as T;
}

export function get_sha() {
  return sha;
}

export async function get_app(app: string): Promise<ApplicationData> {
  const data = await invoke<ApplicationData>("get_app", {
    app_id: app
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