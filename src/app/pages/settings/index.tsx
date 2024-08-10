import { ColorPicker } from "./components/color";
import { DarkLight } from "./components/dark";

import "./components/styles.css"
import { getAppVer, getArch, getCpu, getSdk, getTauriVer } from "../../../utils/android";
import { BsCpuFill } from "react-icons/bs";

function BuildInfo({ Img, title, desc, width, click }: { Img: string | (() => JSX.Element), title: string, desc: string, click?: () => void, width?: string }) {
  return <div className="component mt-3" onClick={() => click ? click() : undefined}>
    <div className="cmp-box">
      <h1>
        {typeof (Img) == "string" ? <img src={Img} width={width || "20px"} height={width || "20px"} /> : <Img />}
        <span>{title}</span>
      </h1>
      <h2>{desc}</h2>
    </div>
  </div>
}

export default function SettingsPage() {
  const [sdk, release] = getSdk();
  const ver = getAppVer();
  const tauriVer = getTauriVer();
  const arch = getArch();
  const cpu = getCpu();

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

    <BuildInfo title="Build" desc={`AHQ Store v${ver}`} Img="/icon.png" />

    <BuildInfo title="SDK Version" desc={`Android SDK ${sdk} - Android ${release}`} Img="/android.png" />

    <BuildInfo title="Arch" desc={arch} Img={() => <BsCpuFill color={"rgb(var(--mdui-color-surface-tint-color))"} size="20px" />} />

    <BuildInfo title="CPU" desc={cpu} Img={() => <BsCpuFill color={"rgb(var(--mdui-color-surface-tint-color))"} size="20px" />} />

    <h2 className="mt-2 text-sm font-extrabold mr-auto">Frameworks that made it possible</h2>

    <BuildInfo title="Backend: TAURI" desc={`v${tauriVer}`} Img="/tauri.png" />

    <BuildInfo title="Frontend: React" desc="The library for web and native user interfaces" Img="/react.webp" />

    <BuildInfo title="Icons: React Icons" desc="Thanks for the icons!" Img="/ri.svg" />

    <BuildInfo title="UI: MDUI" desc="Meterial Design User Interface" Img="/md.svg" />

    <BuildInfo title="UI: TailwindCSS" desc="A set of reusuable components" Img="/tw.png" />

    <BuildInfo title="UI: DaisyUI" desc="The most popular component library for Tailwind CSS" Img="/dui.png" />
  </div>;
}