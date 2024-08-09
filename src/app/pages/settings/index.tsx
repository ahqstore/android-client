import { getTauriVersion, getVersion } from "@tauri-apps/api/app";
import { ColorPicker } from "./components/color";
import { DarkLight } from "./components/dark";

import "./components/styles.css"
import { useEffect, useState } from "react";

function BuildInfo({ img, title, desc, width }: { img: string, title: string, desc: string, width?: string }) {
  return <div className="component mt-3">
    <div className="cmp-box">
      <h1>
        <img src={img} width={width || "5%"} />
        <span>{title}</span>
      </h1>
      <h2>{desc}</h2>
    </div>
  </div>
}

export default function SettingsPage() {
  const [ver, setVersion] = useState("");
  const [tauriVer, setTVersion] = useState("");

  useEffect(() => {
    getVersion().then(setVersion).catch(setVersion);
    getTauriVersion().then(setTVersion).catch(setTVersion);
  });

  return <div className="flex flex-col items-center w-full h-full">
    <ColorPicker
      title="Theme"
      desc="Pick the color to choose the theme"
    />
    <DarkLight
      title="Choose your color scheme"
      desc="Decide between Dark, Light or System"
    />

    <h2 className="mt-3 text-xl font-extrabold mr-auto">About</h2>

    <BuildInfo title="Build" desc={`AHQ Store v${ver}`} img="/icon.png" />

    <BuildInfo title="SDK Version" desc={`Android SDK \${sdk} - Release \${release}`} img="/android.png" />

    <h2 className="mt-2 text-sm font-extrabold mr-auto">Frameworks that made it possible</h2>

    <BuildInfo title="Backend: TAURI" desc={`v${tauriVer}`} img="/tauri.png" />

    <BuildInfo title="Frontend: React" desc="The library for web and native user interfaces" img="/react.webp" />

    <BuildInfo title="Icons: React Icons" desc="Thanks for the icons!" img="/ri.svg" width="10%" />

    <BuildInfo title="UI: MDUI" desc="Meterial Design User Interface" img="/md.svg" width="6%" />

    <BuildInfo title="UI: TailwindCSS" desc="A set of reusuable components" img="/tw.png" width="6%" />

    <BuildInfo title="UI: DaisyUI" desc="The most popular component library for Tailwind CSS" img="/dui.png" width="6%" />
  </div>;
}