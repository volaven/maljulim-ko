import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { install, removeManaged } from "../bin/install.mjs";

test("Codex 대상에 스킬을 설치하고 관리 파일만 제거한다", () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), "maljulim-"));
  try {
    install({ agent: "codex", root: target });

    const skillDir = path.join(target, "skills", "maljulim");
    assert.ok(fs.existsSync(path.join(skillDir, "SKILL.md")));
    fs.writeFileSync(path.join(skillDir, "user-note.txt"), "keep", "utf8");

    removeManaged({ agent: "codex", root: target });
    assert.equal(fs.existsSync(path.join(skillDir, "SKILL.md")), false);
    assert.equal(fs.readFileSync(path.join(skillDir, "user-note.txt"), "utf8"), "keep");
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
});

test("같은 이름의 사용자 스킬을 덮어쓰지 않는다", () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), "maljulim-"));
  try {
    const skillDir = path.join(target, "skills", "maljulim");
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, "SKILL.md"), "user content", "utf8");

    assert.throws(
      () => install({ agent: "codex", root: target }),
      /사용자 파일과 충돌/
    );
    assert.equal(fs.readFileSync(path.join(skillDir, "SKILL.md"), "utf8"), "user content");
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
});

test("Claude에는 스킬과 slash command를 함께 설치하고 제거한다", () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), "maljulim-"));
  try {
    install({ agent: "claude", root: target });
    const skill = path.join(target, "skills", "maljulim", "SKILL.md");
    const command = path.join(target, "commands", "maljulim.md");
    assert.ok(fs.existsSync(skill));
    assert.match(fs.readFileSync(command, "utf8"), /^<!-- maljulim-ko managed file -->/);

    removeManaged({ agent: "claude", root: target });
    assert.equal(fs.existsSync(skill), false);
    assert.equal(fs.existsSync(command), false);
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
});

test("명령 파일 충돌 시 스킬도 부분 설치하지 않는다", () => {
  const target = fs.mkdtempSync(path.join(os.tmpdir(), "maljulim-"));
  try {
    const command = path.join(target, "commands", "maljulim.md");
    fs.mkdirSync(path.dirname(command), { recursive: true });
    fs.writeFileSync(command, "user command", "utf8");

    assert.throws(
      () => install({ agent: "gemini", root: target }),
      /사용자 파일과 충돌/
    );
    assert.equal(
      fs.existsSync(path.join(target, "skills", "maljulim", "SKILL.md")),
      false
    );
    assert.equal(fs.readFileSync(command, "utf8"), "user command");
  } finally {
    fs.rmSync(target, { recursive: true, force: true });
  }
});
