import { argbFromHex, themeFromSourceColor, applyTheme } from "@material/material-color-utilities";

import "./main.css";

import "@material/web/all.js";
import "@material/web/all.d.ts";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [key: string]: {
        [key: string]: any
      }
    }
  }
}

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app";

const theme = themeFromSourceColor(argbFromHex('#000000'), []);

const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

applyTheme(theme, { target: document.body, dark: systemDark });

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
