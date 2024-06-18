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
  const { ok, data } = await fetch("https://api.github.com/repos/ahqstore/data/commits", {
    method: "GET"
  });

  console.log(ok, JSON.stringify(data));
  if (!ok) {
    throw new Error("");
  }

  sha = data[0].sha;
}

export async function get_total() {
  if (sha == "") {
    get_sha();
  }

  const { data } = await fetch(totalUrl.replace("{sha}", sha), {
    method: "GET"
  });

  return Number(data);
}

export async function get_home() {
  if (sha == "") {
    get_sha();
  }

  const url = homeUrl.replace("{sha}", sha);

  const { data } = await fetch(url, {
    method: "GET",
    headers: {
      "ngrok-skip-browser-warning": "true"
    }
  });

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

    const val = await fetch(url, {
      method: "GET"
    });

    map = { ...map, ...val };
  }

  return map as unknown as any as T;
}

export function get_sha() {
  return sha;
}

export async function get_app(app: string): Promise<ApplicationData> {
  const { data } = await fetch(
    appUrl.replace("{sha}", sha).replace("{app}", app),
    {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true"
      }
    },
  );

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