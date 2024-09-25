import fetch from "./http";
import { devUserUrl, get_app, get_search_data } from ".";

import { AHQStoreApplication } from "ahqstore-types/ahqstore_types";
import { invoke } from "@tauri-apps/api/core";

interface AuthorObject {
  u_id: number;
  username: string;
  pub_email: string;
  linked_acc: string[];
  display_name: string;
  pf_pic?: string;
  ahq_verified: boolean;
  apps: string[];
}

type appData = AHQStoreApplication;

let cache: {
  [key: string]: appData;
} = {};
let authorCache: {
  [key: string]: AuthorObject;
} = {};

export default async function fetchApps(
  apps: string | string[],
): Promise<appData | appData[]> {
  if (typeof apps === "string") {
    return (await resolveApps([apps]))[0];
  } else if (Array.isArray(apps)) {
    return await resolveApps([...apps]);
  } else {
    return [];
  }
}

let searchDataCache: SearchData[] = [];

interface SearchData {
  name: string;
  title: string;
  id: string;
}
export async function fetchSearchData() {
  if (searchDataCache.length >= 1) {
    return searchDataCache;
  } else {
    const data = await get_search_data<SearchData[]>();

    searchDataCache = data;
    return data;
  }
}

export async function fetchAuthor(uid: string) {
  if (authorCache[uid]) {
    return authorCache[uid];
  }

  const url = devUserUrl.replace("{dev}", uid);
  const { data } = await fetch(url, {
    method: "GET"
  });
  const author = data as AuthorObject;
  authorCache[uid] = author;

  return author;
}

async function resolveApps(apps: string[]): Promise<appData[]> {
  let promises: Promise<appData>[] = [];

  apps.forEach((appId) => {
    if (cache[appId]) {
      promises.push(
        (async () => {
          return cache[appId];
        })(),
      );
    } else {
      promises.push(
        (async () => {
          const app = await get_app(appId);

          const AuthorObject = await fetchAuthor(app.authorId);

          const appData = {
            ...app,
            id: appId,
            AuthorObject,
          } as appData;

          cache[appId] = appData;

          return appData;
        })(),
      );
    }
  });

  return await Promise.all(promises);
}

export async function get_app_asset(appId: string, asset: number) {
  return await invoke<Uint8Array>("get_app_asset", {
    appId,
    asset
  });
}

export async function get_app_asset_url(appId: string, asset: number) {
  return await invoke<string>("get_app_asset_url", {
    appId,
    asset
  });
}

export type { appData };
export type { AuthorObject };

type ApplicationData = appData;
export type { ApplicationData };