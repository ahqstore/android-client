interface ColorPickerProps {
  title: string;
  desc: string;
}

import { HiDeviceMobile } from "react-icons/hi";

import '@mdui/icons/auto-mode.js';
import '@mdui/icons/light-mode.js';
import '@mdui/icons/dark-mode.js';
import { setTheme } from "../../../../utils/theme";

export function DarkLight({ title, desc }: ColorPickerProps) {
  return <div className="component mt-3">
    <div className="cmp-box">
      <h1>
        <HiDeviceMobile style={{
          "color": "rgb(var(--mdui-color-surface-tint-color))"
        }} />
        <span>{title}</span>
      </h1>
      <h2>{desc}</h2>
    </div>
    <div>
      <select className="select select-sm bg-mdui-100 w-full max-w-xs" onChange={(v) => {
        const val = v.target.value;
        setTheme(val);
      }}>
        {[["mdui-theme-dark", "Dark"], ["mdui-theme-light", "Light"], ["mdui-theme-auto", "Device"]]
          .map(([id, label]) => (
            <option value={id} key={id} selected={(localStorage.theme || "mdui-theme-auto") == id}>{label}</option>
          ))}
      </select>
    </div>
  </div>
}