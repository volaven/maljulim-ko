#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { measure } from "./measure.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cases = JSON.parse(
  fs.readFileSync(path.join(root, "benchmarks", "cases.json"), "utf8")
);

let totalBefore = 0;
let totalAfter = 0;
process.stdout.write("| 사례 | 원문 | 축약 | 절감 |\n|---|---:|---:|---:|\n");
for (const item of cases) {
  const result = measure(item.before, item.after);
  totalBefore += result.beforeTokens;
  totalAfter += result.afterTokens;
  process.stdout.write(
    `| ${item.name} | ${result.beforeTokens} | ${result.afterTokens} | ${result.savedPct}% |\n`
  );
}
const saved = totalBefore - totalAfter;
const pct = totalBefore === 0 ? 0 : ((saved / totalBefore) * 100).toFixed(1);
process.stdout.write(`| **합계** | **${totalBefore}** | **${totalAfter}** | **${pct}%** |\n`);
