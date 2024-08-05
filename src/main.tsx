import "./main.css";
import "mdui/mdui.css";

declare global {
  interface Window {
    backCall: () => boolean
    installCode: (code: 30) => undefined
  }
}

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { setColorScheme } from "mdui";

setColorScheme(
  localStorage.getItem("theme-color") || "#ad4e28"
);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
