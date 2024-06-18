import { ClientOptions, fetch as tauriFetch } from "@tauri-apps/plugin-http";

export default async function fetch(
  url: string,
  config: (RequestInit & ClientOptions) | undefined,
) {
  return await tauriFetch(url, {
    ...(config || {}),
    method: config?.method || "GET",
    connectTimeout: 100_000,
    headers: {
      "User-Agent": "AHQ Store",
      ...(config?.headers || {}),
    },
  }).then(async (data) => ({
    ...data,
    ok: data.status >= 200 && data.status < 300,
    data: await data.text().then((val) => {
      try {
        return JSON.parse(val);
      } catch (_) {
        return val;
      }
    }),
  }));
}