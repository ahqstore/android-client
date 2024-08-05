import fs from "fs";
import path from "path";

const directoryPath = path.join("./node_modules/@mdui/icons");
const indexFilePath = path.join("./src", "vite-env.d.ts");

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }

  const exportStatements = files
    .filter((file) => file.endsWith(".d.ts"))
    .map((file) => `/// <reference types="@mdui/icons/${file}" />`)
    .join("\n");

  fs.writeFile(
    indexFilePath,
    `/// <reference types="vite/client" />
/// <reference types="mdui/jsx.en.d.ts" />
${exportStatements}
`,
    (err) => {
      if (err) {
        return console.log("Error writing file: " + err);
      }
      console.log("vite-env.d.ts created successfully");
    }
  );
});
