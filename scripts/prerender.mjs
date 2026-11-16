import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import { createServer, loadEnv } from "vite";

const clientRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const outputPath = resolve(clientRoot, "dist", "index.html");
const siteUrl = loadEnv("production", clientRoot, "VITE_").VITE_SITE_URL;

if (!siteUrl) {
  throw new Error("VITE_SITE_URL must be set to the production site origin.");
}

const parsedSiteUrl = new URL(siteUrl);

if (
  parsedSiteUrl.protocol !== "https:" ||
  parsedSiteUrl.pathname !== "/" ||
  parsedSiteUrl.search ||
  parsedSiteUrl.hash
) {
  throw new Error("VITE_SITE_URL must be an HTTPS origin, such as https://cloudide.in.");
}

const siteOrigin = parsedSiteUrl.origin;
const canonicalUrl = `${siteOrigin}/`;
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
  const withPrerenderedContent = html.replace(
    '<div id="root"></div>',
    `<div id="root">${markup}</div>`,
  );

  if (withPrerenderedContent === html) {
    throw new Error("Could not find the app root in dist/index.html.");
  }

  const prerenderedHtml = withPrerenderedContent.replace(
    "</head>",
    `    <link rel="canonical" href="${canonicalUrl}" />\n    <meta property="og:url" content="${canonicalUrl}" />\n  </head>`,
  );

  if (prerenderedHtml === withPrerenderedContent) {
    throw new Error("Could not find the document head in dist/index.html.");
  }

  await writeFile(outputPath, prerenderedHtml);
  await writeFile(
    resolve(clientRoot, "dist", "robots.txt"),
    `User-agent: *\nAllow: /\nSitemap: ${siteOrigin}/sitemap.xml\n`,
  );
  await writeFile(
    resolve(clientRoot, "dist", "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${canonicalUrl}</loc>\n  </url>\n</urlset>\n`,
  );
  console.log("Pre-rendered the homepage and generated SEO files.");
} finally {
  await vite.close();
}
