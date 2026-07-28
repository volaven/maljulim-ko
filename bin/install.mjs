#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SKILL_SOURCE = path.join(ROOT, "skills", "maljulim", "SKILL.md");
const COMMAND_SOURCE = path.join(ROOT, "commands", "maljulim.md");
const MARKER = ".maljulim-ko";
const MANAGED_HEADER = "<!-- maljulim-ko managed file -->";

function usage() {
  return `말줄임 설치기

사용법:
  maljulim-install [--agent codex|claude|gemini|all] [--target 경로]
                   [--dry-run] [--uninstall]

옵션:
  --agent      설치 대상. 생략하면 설치된 에이전트를 자동 감지
  --target     에이전트 설정 루트. 단일 --agent와 함께 사용
  --dry-run    파일을 바꾸지 않고 대상만 출력
  --uninstall  말줄임이 관리하는 파일만 제거
`;
}

function parseArgs(argv) {
  const options = { agent: null, target: null, dryRun: false, uninstall: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--agent") options.agent = argv[++i];
    else if (arg === "--target") options.target = argv[++i];
    else if (arg === "--dry-run") options.dryRun = true;
    else if (arg === "--uninstall") options.uninstall = true;
    else if (arg === "--help" || arg === "-h") {
      process.stdout.write(usage());
      process.exit(0);
    } else {
      throw new Error(`알 수 없는 옵션: ${arg}`);
    }
  }

  const allowed = new Set(["codex", "claude", "gemini", "all"]);
  if (options.agent && !allowed.has(options.agent)) {
    throw new Error(`지원하지 않는 에이전트: ${options.agent}`);
  }
  if (options.target && (!options.agent || options.agent === "all")) {
    throw new Error("--target은 단일 --agent와 함께 사용하세요.");
  }
  return options;
}

function defaultRoots() {
  const home = os.homedir();
  return {
    codex: process.env.CODEX_HOME || path.join(home, ".codex"),
    claude: process.env.CLAUDE_CONFIG_DIR || path.join(home, ".claude"),
    gemini: process.env.GEMINI_HOME || path.join(home, ".gemini")
  };
}

function selectedTargets(options) {
  const roots = defaultRoots();
  if (options.target) roots[options.agent] = path.resolve(options.target);
  if (options.agent && options.agent !== "all") {
    return [{ agent: options.agent, root: roots[options.agent] }];
  }
  if (options.agent === "all") {
    return Object.entries(roots).map(([agent, root]) => ({ agent, root }));
  }
  const detected = Object.entries(roots)
    .filter(([, root]) => fs.existsSync(root))
    .map(([agent, root]) => ({ agent, root }));
  if (detected.length === 0) {
    throw new Error("설치된 에이전트를 찾지 못했습니다. --agent를 지정하세요.");
  }
  return detected;
}

function commandPath(agent, root) {
  if (agent === "claude" || agent === "gemini") {
    return path.join(root, "commands", "maljulim.md");
  }
  return null;
}

function assertNoCollision(destination, managed) {
  if (!fs.existsSync(destination)) return;
  if (!managed()) throw new Error(`사용자 파일과 충돌: ${destination}`);
}

function writeFile(destination, content, dryRun) {
  if (dryRun) return;
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.writeFileSync(destination, content, "utf8");
}

export function install(target, dryRun = false) {
  const skillDir = path.join(target.root, "skills", "maljulim");
  const skillPath = path.join(skillDir, "SKILL.md");
  const markerPath = path.join(skillDir, MARKER);
  const agentCommandPath = commandPath(target.agent, target.root);

  assertNoCollision(skillPath, () => fs.existsSync(markerPath));
  if (agentCommandPath) {
    assertNoCollision(
      agentCommandPath,
      () => fs.readFileSync(agentCommandPath, "utf8").startsWith(MANAGED_HEADER)
    );
  }

  writeFile(skillPath, fs.readFileSync(SKILL_SOURCE, "utf8"), dryRun);
  writeFile(markerPath, "managed by maljulim-ko 0.1.0\n", dryRun);
  if (agentCommandPath) {
    writeFile(agentCommandPath, fs.readFileSync(COMMAND_SOURCE, "utf8"), dryRun);
  }
  return { ...target, skillPath, commandPath: agentCommandPath };
}

export function removeManaged(target, dryRun = false) {
  const skillDir = path.join(target.root, "skills", "maljulim");
  const markerPath = path.join(skillDir, MARKER);
  const skillPath = path.join(skillDir, "SKILL.md");
  const agentCommandPath = commandPath(target.agent, target.root);
  const result = {
    ...target,
    skillPath,
    commandPath: agentCommandPath,
    skipped: false
  };

  if (!fs.existsSync(markerPath)) {
    result.skipped = true;
    return result;
  }
  if (dryRun) return result;

  for (const file of [skillPath, markerPath]) {
    if (fs.existsSync(file)) fs.unlinkSync(file);
  }
  if (fs.existsSync(skillDir) && fs.readdirSync(skillDir).length === 0) {
    fs.rmdirSync(skillDir);
  }
  if (agentCommandPath && fs.existsSync(agentCommandPath)) {
    const current = fs.readFileSync(agentCommandPath, "utf8");
    if (current.startsWith(MANAGED_HEADER)) fs.unlinkSync(agentCommandPath);
  }
  return result;
}

export function run(argv) {
  try {
    const options = parseArgs(argv);
    const targets = selectedTargets(options);
    for (const target of targets) {
      const result = options.uninstall
        ? removeManaged(target, options.dryRun)
        : install(target, options.dryRun);
      const verb = options.uninstall ? "제거" : "설치";
      const state = result.skipped
        ? "건너뜀"
        : options.dryRun
          ? `${verb} 예정`
          : `${verb} 완료`;
      process.stdout.write(`[${target.agent}] ${state}: ${result.skillPath}\n`);
    }
  } catch (error) {
    process.stderr.write(`오류: ${error.message}\n`);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  run(process.argv.slice(2));
}
