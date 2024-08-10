export default async function fetch(
  url: string,
  config: RequestInit | undefined,
) {
  return await window.fetch(url, {
    ...(config || {}),
    method: config?.method || "GET",
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