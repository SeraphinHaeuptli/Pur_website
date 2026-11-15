// Baut dist/index.html: index.html (Artifact-Fassung ohne Gerüst) plus doctype/head/body.
// index.html bleibt unverändert und ist die einzige Quelle. Aufruf: node build.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const src = readFileSync(new URL("./index.html", import.meta.url), "utf8");

function abbruch(grund) {
  console.error("build.mjs: " + grund);
  process.exit(1);
}
if (!src.startsWith("<title>")) abbruch("index.html beginnt nicht mit <title>.");
if (/<!doctype/i.test(src)) abbruch("index.html enthält schon ein <!doctype>.");
const n = src.split("</style>").length - 1;
if (n !== 1) abbruch("</style> kommt " + n + "-mal vor, erwartet genau 1.");

const schnitt = src.indexOf("</style>") + "</style>".length;
const kopf = src.slice(0, schnitt);
const rumpf = src.slice(schnitt);

const html =
  '<!doctype html>\n<html lang="de">\n<head>\n<meta charset="utf-8">\n' +
  '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n' +
  kopf + "\n</head>\n<body>" + rumpf + "\n</body>\n</html>\n";

mkdirSync(new URL("./dist/", import.meta.url), { recursive: true });
writeFileSync(new URL("./dist/index.html", import.meta.url), html);
console.log("dist/index.html geschrieben (" + html.length + " Zeichen).");
