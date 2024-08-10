export const prefersDark = () => {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export const applyTheme = () => {
  const theme = localStorage.theme || "mdui-theme-auto";

  const html = document.querySelector("html");

  (html as HTMLElement).className = theme;
  if (theme == "mdui-theme-dark" || (theme == "mdui-theme-auto" && prefersDark())) {
    html?.classList.add("dark");
    html?.setAttribute("data-theme", "dark");
  } else {
    html?.setAttribute("data-theme", "light");
  }
}

export const setTheme = (theme: string) => {
  localStorage.theme = theme;

  applyTheme();
}