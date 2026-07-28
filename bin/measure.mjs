#!/usr/bin/env node

import fs from "node:fs";
import { pathToFileURL } from "node:url";
import { encode } from "gpt-tokenizer";

function usage() {
  return `사용법:
  maljulim-measure --before "원문" --after "축약문" [--json]
  maljulim-measure --before-file 원문.txt --after-file 축약문.txt [--json]

o200k_base 기준으로 텍스트 토큰만 계산합니다. 메시지 포맷 토큰은 제외됩니다.
`;
}

function parse(argv) {
  const options = { json: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--before") options.before = argv[++i];
    else if (arg === "--after") options.after = argv[++i];
    else if (arg === "--before-file") options.beforeFile = argv[++i];
    else if (arg === "--after-file") options.afterFile = argv[++i];
    else if (arg === "--json") options.json = true;
    else if (arg === "--help" || arg === "-h") options.help = true;
    else throw new Error(`알 수 없는 옵션: ${arg}`);
  }
  return options;
}

export function measure(before, after) {
  const beforeTokens = encode(before).length;
  const afterTokens = encode(after).length;
  const savedTokens = beforeTokens - afterTokens;
  const savedPct = beforeTokens === 0 ? 0 : (savedTokens / beforeTokens) * 100;
  return {
    encoding: "o200k_base",
    beforeTokens,
    afterTokens,
    savedTokens,
    savedPct: Number(savedPct.toFixed(1)),
    beforeChars: [...before].length,
    afterChars: [...after].length
  };
}

function value(options, directKey, fileKey) {
  if (options[directKey] !== undefined) return options[directKey];
  if (options[fileKey]) return fs.readFileSync(options[fileKey], "utf8");
  return undefined;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const options = parse(process.argv.slice(2));
    if (options.help) {
      process.stdout.write(usage());
      process.exit(0);
    }
    const before = value(options, "before", "beforeFile");
    const after = value(options, "after", "afterFile");
    if (before === undefined || after === undefined) {
      throw new Error("원문과 축약문을 모두 지정하세요.");
    }
    const result = measure(before, after);
    if (options.json) {
      process.stdout.write(`${JSON.stringify(result)}\n`);
    } else {
      process.stdout.write(
        `원문 ${result.beforeTokens} 토큰 → 축약 ${result.afterTokens} 토큰\n` +
        `절감 ${result.savedTokens} 토큰 (${result.savedPct}%) · ${result.encoding}\n`
      );
    }
  } catch (error) {
    process.stderr.write(`오류: ${error.message}\n`);
    process.exitCode = 1;
  }
}
