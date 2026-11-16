import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer } from "vite";

const clientRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const outputPath = resolve(clientRoot, "dist", "index.html");
const vite = await createServer({
  configFile: resolve(clientRoot, "vite.config.ts"),
  root: clientRoot,
  appType: "custom",
  server: { middlewareMode: true },
});

try {
  const [{ default: AppProviders }, { AppRoutes }] = await Promise.all([
    vite.ssrLoadModule("/src/app/AppProviders.tsx"),
    vite.ssrLoadModule("/src/app/router.tsx"),
  ]);
  const app = createElement(
    AppProviders,
    null,
    createElement(
      MemoryRouter,
      { initialEntries: ["/"] },
      createElement(AppRoutes),
    ),
  );
  const markup = renderToString(app);
  const html = await readFile(outputPath, "utf8");
  const prerenderedHtml = html.replace(
    '<div id="root"></div>',
    `<div id="root">${markup}</div>`,
  );

  if (prerenderedHtml === html) {
    throw new Error("Could not find the app root in dist/index.html.");
  }

  await writeFile(outputPath, prerenderedHtml);
  console.log("Pre-rendered the homepage into dist/index.html.");
} finally {
  await vite.close();
}
