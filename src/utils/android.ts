import { getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { invoke } from "@tauri-apps/api/core";

let android: [number, string] = [0, ""];
let ver = "";
let tauriVer = "";
let arch = "";
let cpu = "";

export async function getAndroidData() {
  const data = await invoke<[number, string]>("get_andy_build");
  const [ar, procCpuInfo] = await invoke<string>("get_os_info");

  // Get the $value from one of the lines that is in the following style 'model name   : $value'
  const cpuInfo = procCpuInfo
    .split("\n")
    .filter((x) => x.includes(":") && x.startsWith("model name"))
    .map((x) => x.split(":").map((x) => x.trim()))
  [0][1];

  cpu = cpuInfo;

  arch = ar.replace("arm", "Arm 32-Bit (armv7)").replace("aarch64", "Arm 64-Bit (aarch64)").replace("i686", "x86 (i686)").replace("x86_64", "x64 (x86_64 / AMD64)");
  android = data;
}

export async function getVerData() {
  ver = await getVersion();
  tauriVer = await getTauriVersion();
}

export async function getAboutInfomation() {
  await getAndroidData();
  await getVerData();
}

export const getSdk = () => android;
export const getAppVer = () => ver;
export const getTauriVer = () => tauriVer;
export const getArch = () => arch;
export const getCpu = () => cpu;