import 'mdui/mdui.css';
import 'mdui';

import "./main.css";

declare global {
  interface Window {
    backCall: () => boolean
    installCode: (code: 30) => undefined
  }
}

declare module "react/jsx-runtime" {
  namespace JSX {
    interface IntrinsicElements {
      [key: string]: any;
    }
  }
}

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { setColorScheme } from "mdui/functions/setColorScheme";
import { applyTheme } from './utils/theme';

applyTheme();

setInterval(() => {
  setColorScheme(
    localStorage.getItem("theme-color") || "#ad4e28"
  );
}, 500);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
