import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { test } from "node:test";
import { measure } from "../bin/measure.mjs";

const root = path.resolve(import.meta.dirname, "..");

test("축약문의 o200k 토큰 수와 절감률을 계산한다", () => {
  const result = measure(
    "물론입니다. 문제의 원인을 확인한 뒤 해결 방법을 자세히 설명해 드리겠습니다.",
    "원인 확인 후 해결책을 설명합니다."
  );
  assert.ok(result.beforeTokens > result.afterTokens);
  assert.equal(result.savedTokens, result.beforeTokens - result.afterTokens);
  assert.ok(result.savedPct > 0);
  assert.equal(result.encoding, "o200k_base");
});

test("스킬에 한국어 모호성 방지 규칙이 있다", () => {
  const skill = fs.readFileSync(
    path.join(root, "skills", "maljulim", "SKILL.md"),
    "utf8"
  );
  assert.match(skill, /조사·접속어 생략으로 대상·원인·순서가 흐려지면 유지/);
  assert.match(skill, /오류 문자열/);
  assert.match(skill, /되돌릴 수 없는 작업/);
});
