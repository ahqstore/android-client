interface ColorPickerProps {
  title: string;
  desc: string;
}

import { MdColorize } from "react-icons/md";

import { HexColorPicker } from "react-colorful";

import { HiOutlineColorSwatch } from "react-icons/hi";
import { useEffect } from "react";


export function ColorPicker({ title, desc }: ColorPickerProps) {
  useEffect(() => {
    const btn = document.querySelector("#dialog-mdui-btn") as HTMLButtonElement;
    const dialog = document.querySelector("#dialog-mdui") as any;

    btn.addEventListener("click", () => dialog.open = true);
  }, []);


  return <div className="component" id="dialog-mdui-btn">
    <dialog id="color_picker" className="modal">
      <div className="modal-box bg-mdui-100">
        <HexColorPicker
          color={localStorage.getItem("theme-color") || "#ad4e28"}
          style={{ "marginBottom": "5px", "marginTop": "20px", "marginLeft": "auto", "marginRight": "auto" }}
          onChange={(c) => {
            localStorage.setItem("theme-color", c);
          }}
        />
      </div>

      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
    <div className="cmp-box">
      <h1>
        <HiOutlineColorSwatch style={{
          "color": "rgb(var(--mdui-color-surface-tint-color))"
        }} />
        <span>{title}</span>
      </h1>
      <h2>{desc}</h2>
    </div>
    <div>
      <button className="ml-auto btn btn-sm bg-mdui-100 no-animation" onClick={() => (document.getElementById('color_picker') as any).showModal()}>
        <MdColorize
          size="1.5em"
          style={{
            "color": "rgb(var(--mdui-color-surface-tint-color))"
          }}
        />
      </button>
    </div>
  </div >
}