# 말줄임

한국어 AI 응답의 의미는 유지하고 출력 토큰을 줄이는
**Codex·Claude·Gemini용 스킬**입니다.
[caveman](https://github.com/JuliusBrussee/caveman)의 핵심 아이디어를 한국어에 맞게
다시 설계했습니다.

영어처럼 관사를 기계적으로 지우지 않습니다. 한국어의 주어·조사·어미는 문맥이 분명할
때만 줄이고, 대상·원인·순서가 흐려지면 완전한 문장을 유지합니다.

## 구성

- `skills/maljulim/SKILL.md`: 한국어 압축 규칙
- `maljulim-install`: Codex·Claude·Gemini 설정에 안전하게 설치/제거
- `maljulim-measure`: o200k_base 기준 실제 텍스트 토큰 비교
- `maljulim-bench`: 포함된 한국어 예시 벤치마크

## 설치

Node.js 18 이상이 필요합니다.

```powershell
npm install
node .\bin\install.mjs --agent codex
node .\bin\install.mjs --agent claude
node .\bin\install.mjs --agent gemini
```

세 에이전트에 함께 설치:

```powershell
node .\bin\install.mjs --agent all
```

설치 위치를 먼저 확인하려면 `--dry-run`을 붙입니다. 제거:

```powershell
node .\bin\install.mjs --agent codex --uninstall
```

설치 후 `$maljulim`, `/maljulim` 또는 "출력 토큰 줄여서 답해"라고 요청합니다.
모드는 `다듬기`, `압축`(기본), `극약` 세 단계입니다.

## 기본 설치 위치

| 에이전트 | 스킬 위치 |
|---|---|
| Codex | `$CODEX_HOME/skills/maljulim` 또는 `~/.codex/skills/maljulim` |
| Claude | `$CLAUDE_CONFIG_DIR/skills/maljulim` 또는 `~/.claude/skills/maljulim` |
| Gemini | `$GEMINI_HOME/skills/maljulim` 또는 `~/.gemini/skills/maljulim` |

Claude와 Gemini에는 `/maljulim` 호출용 명령 파일도 설치합니다.

## 토큰 측정

```powershell
node .\bin\measure.mjs --before "물론입니다. 자세히 설명해 드리겠습니다." --after "핵심만 설명합니다."
npm run bench
```

측정기는 `o200k_base` 인코딩의 텍스트 토큰을 셉니다. API 메시지 포맷, 숨은 추론,
스킬 입력 토큰은 포함하지 않습니다. 포함된 벤치마크는 같은 의미로 손수 작성한 문장쌍의
토큰 차이이며 모델 품질 벤치마크가 아닙니다.

| 사례 | 원문 | 축약 | 절감 |
|---|---:|---:|---:|
| React 재렌더링 | 85 | 35 | 58.8% |
| 인증 만료 | 52 | 27 | 48.1% |
| DB 풀 | 58 | 27 | 53.4% |
| Git 병합 | 54 | 34 | 37.0% |
| 오류 수정 | 44 | 21 | 52.3% |
| **합계** | **293** | **144** | **50.9%** |

## 원칙

- 정보와 기술 정확성 우선
- 코드·명령·경로·오류 문자열 보존
- 인사·완곡어·중복 결론 제거
- 보안 경고와 되돌릴 수 없는 작업은 압축 금지
- 임의 축약어와 초성어 금지

MIT. 출처와 구현 범위는 [NOTICE.md](NOTICE.md)에 적었습니다.
