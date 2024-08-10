import { invoke } from "@tauri-apps/api/core";

export async function getAndroidData(): Promise<[number, string]> {
  const [sdk, release] = await invoke<[number, string]>("get_andy_build");

  return [sdk, release];
}