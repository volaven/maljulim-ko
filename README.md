# 말줄임

<p align="center">
  <img src="./docs/assets/maljulim-comic.png" alt="말줄임 소개 4컷 만화" width="960">
</p>

<p align="center">
  <strong>답은 짧게, 내용은 그대로.</strong><br>
  Codex·Claude·Gemini의 긴 한국어 답변을 읽기 쉽게 줄여 주는 스킬입니다.
</p>

---

## 어떤 도구인가요?

AI에게 간단한 질문을 했는데 답변이 너무 길어서 핵심을 찾기 어려웠던 적이 있나요?

**말줄임**은 AI 답변에서 불필요한 인사말, 반복 설명, 장황한 맺음말을 덜어내고
결론과 필요한 정보부터 보여 줍니다.

```text
사용 전
물론입니다. 현재 문제가 발생하는 이유는 렌더링이 발생할 때마다
새로운 객체가 생성되고 있기 때문일 가능성이 높습니다.

사용 후
렌더링마다 새 객체가 생성됩니다. `useMemo`로 고정하세요.
```

AI의 지식이나 코드 작성 능력을 줄이는 도구가 아닙니다.
**답변의 내용은 유지하면서 표현만 간결하게 만드는 도구**입니다.

지원하는 AI 도구:

- Codex
- Claude Code
- Gemini CLI

## 처음 설치하는 분을 위한 안내

아래 순서대로 한 단계씩 진행하면 됩니다. Windows PowerShell을 기준으로 설명합니다.

### 1. Node.js 설치하기

말줄임 설치기를 실행하려면 Node.js 18 이상이 필요합니다.

1. [Node.js 공식 사이트](https://nodejs.org/)에 접속합니다.
2. 화면에 표시되는 **LTS 버전**을 내려받아 설치합니다.
3. 설치가 끝나면 PowerShell을 완전히 닫았다가 다시 엽니다.
4. 다음 명령을 입력합니다.

```powershell
node --version
```

`v18`, `v20`, `v22`처럼 버전 번호가 나오면 준비가 끝난 것입니다.

### 2. 말줄임 내려받기

Git을 사용할 수 있다면 PowerShell에 다음 두 줄을 차례대로 입력합니다.

```powershell
git clone https://github.com/volaven/maljulim-ko.git
cd maljulim-ko
```

Git이 없거나 명령어 사용이 어렵다면 다음 방법을 이용해도 됩니다.

1. GitHub 화면 위쪽의 **Code** 버튼을 누릅니다.
2. **Download ZIP**을 누릅니다.
3. 내려받은 ZIP 파일의 압축을 풉니다.
4. 압축을 푼 `maljulim-ko` 폴더를 엽니다.
5. 파일 탐색기 위쪽의 주소 표시줄을 클릭합니다.
6. `powershell`이라고 입력하고 Enter 키를 누릅니다.

### 3. 사용할 AI 도구에 설치하기

본인이 사용하는 AI 도구 하나를 골라 해당 명령만 실행하세요.

#### Codex에 설치

```powershell
node .\bin\install.mjs --agent codex
```

#### Claude Code에 설치

```powershell
node .\bin\install.mjs --agent claude
```

#### Gemini CLI에 설치

```powershell
node .\bin\install.mjs --agent gemini
```

세 도구를 모두 사용한다면 한 번에 설치할 수 있습니다.

```powershell
node .\bin\install.mjs --agent all
```

`설치 완료`라는 문구가 나오면 정상적으로 설치된 것입니다.
설치가 끝난 뒤 사용 중인 Codex, Claude Code 또는 Gemini CLI를 다시 시작하세요.

> 파일이 어디에 설치되는지 먼저 확인하고 싶다면 명령 끝에 `--dry-run`을 붙이세요.
> 실제 파일은 만들지 않고 설치 예정 위치만 보여 줍니다.

```powershell
node .\bin\install.mjs --agent codex --dry-run
```

## 사용하는 방법

설치 후 AI에게 평소처럼 질문하면서 다음과 같이 요청하면 됩니다.

```text
출력 토큰을 줄여서 핵심만 답해 줘.
```

또는 사용하는 도구에 맞는 명령을 입력합니다.

| 도구 | 입력할 명령 |
|---|---|
| Codex | `$maljulim` |
| Claude Code | `/maljulim` |
| Gemini CLI | `/maljulim` |

### 세 가지 말줄임 모드

| 모드 | 특징 | 이런 때 사용하세요 |
|---|---|---|
| `다듬기` | 존댓말과 완전한 문장을 유지하며 중복만 줄임 | 설명을 편하게 읽고 싶을 때 |
| `압축` | 짧은 문장으로 결론과 핵심을 먼저 전달 | 평소 작업할 때, 기본 모드 |
| `극약` | 꼭 필요한 결론·근거·다음 행동만 전달 | 출력 토큰을 최대한 줄이고 싶을 때 |

예시:

```text
말줄임 압축 모드로 답해 줘.
```

원래 답변 방식으로 돌아가려면 다음과 같이 말합니다.

```text
말줄임 해제.
```

## 삭제하는 방법

말줄임을 더 이상 사용하지 않는다면 설치할 때 사용한 에이전트 이름과 함께
`--uninstall`을 붙입니다.

```powershell
node .\bin\install.mjs --agent codex --uninstall
node .\bin\install.mjs --agent claude --uninstall
node .\bin\install.mjs --agent gemini --uninstall
```

말줄임이 직접 설치한 파일만 삭제하며, 같은 폴더에 있는 다른 사용자 파일은 유지합니다.

## 설치가 안 될 때

### `node`를 찾을 수 없다고 나와요

Node.js 설치 후 열려 있던 PowerShell을 닫고 새로 여세요.
그래도 안 되면 Node.js가 정상적으로 설치됐는지 확인합니다.

```powershell
node --version
```

### `Cannot find module` 오류가 나와요

PowerShell이 `maljulim-ko` 폴더 안에서 열려 있는지 확인하세요.
다음 명령으로 현재 폴더의 파일을 확인할 수 있습니다.

```powershell
dir
```

목록에 `bin`, `skills`, `package.json`이 보여야 합니다.

### 기존 파일과 충돌한다고 나와요

말줄임은 같은 이름의 사용자 파일을 자동으로 덮어쓰지 않습니다.
오류 메시지에 표시된 파일을 먼저 확인한 뒤 이름을 바꾸거나 백업하고 다시 설치하세요.

## 토큰 절감량 확인하기

이 기능은 선택 사항입니다. 말줄임 설치에 꼭 필요하지 않습니다.

먼저 토큰 측정 도구에 필요한 패키지를 설치합니다.

```powershell
npm install
```

원문과 줄인 문장을 직접 비교하려면 다음과 같이 실행합니다.

```powershell
node .\bin\measure.mjs --before "물론입니다. 자세히 설명해 드리겠습니다." --after "핵심만 설명합니다."
```

프로젝트에 포함된 예시 전체를 측정하려면 다음 명령을 사용합니다.

```powershell
npm run bench
```

포함된 예시에서는 `293`토큰이 `144`토큰으로 줄어 약 `50.9%` 감소했습니다.
이 수치는 준비된 예시 문장을 측정한 결과이며, 실제 절감률은 질문과 답변 내용에 따라 달라집니다.

## 말줄임이 지키는 원칙

- 코드, 명령어, 파일 경로, 오류 메시지는 임의로 바꾸지 않습니다.
- 주어나 조사를 빼서 뜻이 모호해지면 완전한 문장을 사용합니다.
- 보안 경고와 되돌릴 수 없는 작업은 무리하게 줄이지 않습니다.
- 뜻을 알아보기 어려운 초성어나 임의의 줄임말을 만들지 않습니다.
- 같은 내용을 제목, 본문, 결론에서 반복하지 않습니다.

이 프로젝트는 [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman)의
아이디어에서 영감을 받아 한국어에 맞게 새로 구현했습니다.

MIT License. 자세한 출처와 구현 범위는 [NOTICE.md](NOTICE.md)에서 확인할 수 있습니다.
