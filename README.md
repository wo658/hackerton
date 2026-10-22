# Hackerton · Ambition for Korea

**실제 개발 시간 약 5시간을 위한 Next.js + Claude 스타터.** 미션이 정해지면 하나의 핵심 흐름을 바로 구현하고, GitHub에 push해 데모 URL로 확인하는 데 집중합니다.

[데모](https://hackerton-xi.vercel.app) · [GitHub](https://github.com/wo658/hackerton) · [행사 안내](https://bloomworld.ai/community/ambition/)

## 지금 준비된 것

| 영역 | 구성 |
| --- | --- |
| 웹 | Next.js App Router · React · TypeScript strict · Tailwind CSS |
| AI | Vercel AI SDK · Anthropic 직접 연결 · 서버 전용 모델 팩토리 |
| AI 개발 지원 | Claude Code 프로젝트 지침 · Next DevTools MCP · AI SDK/Next 개발 검증 스킬 |
| 검증 | Next 기본 ESLint · 타입 검사 · 빌드 · GitHub Actions |
| 배포 | `main` push → Vercel Production, 다른 브랜치 → Preview |

홈은 교체할 수 있는 최소 시작 화면입니다. 채팅 UI·채팅 API는 포함하지 않습니다. DB·로그인·파일 업로드·에이전트는 미션이 요구할 때 추가합니다.

## 1. 팀원 첫 실행

GitHub 협업자 초대를 수락하고 다음 순서로 실행합니다. Node.js 24 LTS, pnpm 11.2.2를 사용합니다.

```sh
git clone https://github.com/wo658/hackerton.git
cd hackerton
nvm use
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

- 페이지: http://localhost:3000
- 연결 확인: http://localhost:3000/api/health → `{"status":"ok"}`
- AI 키가 없어도 설치·페이지·상태 API·검증·빌드는 동작합니다.
- `nvm`을 사용하지 않으면 다른 버전 관리 도구로 Node 24를 선택하세요. `corepack`이 없으면 pnpm 11.2.2를 직접 설치하세요.

## 2. Claude Code에서 Next.js를 정확하게 개발하기

레포 루트에서 Claude Code를 시작하면 `CLAUDE.md`와 `.claude/skills/`를 사용합니다. `.mcp.json`에는 공식 `next-devtools-mcp`가 등록되어 있습니다. 개발 의존성으로 **0.4.0을 고정 설치**하므로 최초 사용 중 추가 다운로드를 기다릴 필요가 없습니다.

1. 별도 터미널에서 `pnpm dev`를 켜둡니다.
2. Claude Code의 프로젝트 신뢰/MCP 사용 안내를 확인하고, 필요하면 `next-devtools` 사용을 승인합니다. 이 승인은 팀원별로 진행합니다.
3. `/mcp`에서 연결 상태를 확인합니다. 기존 세션이 새 설정을 읽지 않으면 재시작합니다.
4. 작업 중인 페이지를 브라우저로 열어둡니다. 브라우저 런타임 오류는 실제 페이지 세션이 있어야 확인할 수 있습니다.

Claude에 요청할 때는 다음처럼 시작하면 됩니다.

> 설치된 Next.js 문서에서 관련 API를 먼저 확인해줘. pnpm dev의 실제 포트를 찾아 Next DevTools로 오류와 해당 라우트 컴파일 상태를 확인하면서 구현해줘.

### 공식 문서는 이미 설치되어 있습니다

웹 검색보다 **현재 설치 버전과 일치하는 번들 문서**를 먼저 사용합니다. Next.js 업데이트 시 이 문서도 같이 갱신됩니다.

| 필요한 정보 | 로컬 위치 |
| --- | --- |
| Next.js 시작·구현 패턴 | `node_modules/next/dist/docs/01-app/01-getting-started/` |
| Next.js 주제별 가이드 | `node_modules/next/dist/docs/01-app/02-guides/` |
| Route Handler·컴포넌트·함수·설정 API | `node_modules/next/dist/docs/01-app/03-api-reference/` |
| Vercel AI SDK | `node_modules/ai/docs/` |
| Claude provider | `node_modules/@ai-sdk/anthropic/docs/` |

MCP는 실행 중인 앱의 오류·라우트·로그·컴파일 상태를 연결합니다. 문서 내용을 모두 자동으로 읽어주는 서버는 아닙니다. MCP가 연결되지 않아도 위 문서를 직접 검색·참조할 수 있습니다.

### 스킬은 기능 개발과 동작 검증에 집중합니다

| 스킬 | 사용하는 작업 |
| --- | --- |
| `/ai-sdk` | Claude 호출·스트리밍·구조화된 출력·도구 기능 구현 |
| `/next-dev-loop` | Next.js 변경 후 컴파일·오류·브라우저 동작 확인 |

두 스킬은 공식 저장소의 **영문 원본 그대로** 포함했습니다. 프로젝트별 지침만 `CLAUDE.md`에서 관리합니다. 관련 작업에서는 자동 선택되며 명령으로 직접 호출할 수도 있습니다. 성능 최적화 스킬은 기본 구성에서 제외했습니다.

`next-dev-loop`의 필수 도구인 `agent-browser`는 개발 의존성으로 버전을 고정했습니다. 먼저 실행 환경을 확인합니다.

```sh
pnpm exec agent-browser --version
pnpm exec agent-browser doctor --offline --quick
```

Chrome이 없다고 나오면 최초 한 번 `pnpm exec agent-browser install`을 실행하세요. Linux에서 시스템 라이브러리도 필요하면 공식 설치 가이드를 확인하세요. 팀원별 설치이며 Vercel 빌드나 배포 과정에서는 브라우저를 설치·실행하지 않습니다.

터미널에서 Claude Code를 사용한다면 `pnpm exec claude`로 시작하면 프로젝트 CLI를 PATH에 포함할 수 있습니다. 다른 방식으로 시작한 경우에는 `CLAUDE.md`의 PATH 안내를 따릅니다. 검증 중에는 `pnpm dev`가 켜져 있어야 합니다.

권장 작업 순서는 **작은 기능 구현 → `/next-dev-loop`로 실제 동작·실패 경로 확인 → `pnpm check` → push**입니다. 이 스킬은 일반 회귀 테스트 스위트를 대신하지 않으며, 전체 동작에 영향이 큰 기능에는 필요한 테스트를 추가합니다.

## 3. 어디부터 수정하나요?

```text
src/
  app/
    page.tsx            # 제품 화면 시작점
    layout.tsx          # 공통 레이아웃·메타데이터
    globals.css         # Tailwind·공통 스타일
    api/health/route.ts  # 키 없이 서버 연결 확인
  lib/
    ai.ts               # 서버 전용 Claude 모델 팩토리
.claude/skills/          # 팀이 공유하는 개발 스킬
.mcp.json               # Claude Code ↔ Next DevTools 연결
CLAUDE.md               # 프로젝트 개발 원칙·문서 찾는 순서
```

프론트는 `src/app/page.tsx`부터, 서버 API는 `src/app/api/<기능>/route.ts`부터 구현합니다. 별도 API 프레임워크 없이 Next Route Handler와 기존 Zod로 시작할 수 있습니다.

## 4. Claude 연결

`.env.local`에 행사에서 받은 키를 넣습니다. 키는 브라우저용 `NEXT_PUBLIC_` 변수로 만들지 않습니다.

| 환경변수 | 용도 |
| --- | --- |
| `ANTHROPIC_API_KEY` | 실제 Claude 호출에 필요. 로컬 페이지·빌드에는 불필요 |
| `ANTHROPIC_MODEL` | 모델 ID 변경. 기본값은 `src/lib/ai.ts`에 정의 |

모델 ID는 행사 계정에서 지원하는 값을 사용하세요. `src/lib/ai.ts`의 `getModel()`을 서버 코드에서 가져오면 됩니다. 미션에 맞게 `generateText`, `streamText`, 구조화된 출력 중 필요한 API를 선택하고 설치 버전 문서를 확인합니다. 현재는 실제 모델을 호출하는 공개 API가 없습니다.

키를 공유할 때는 로컬 환경변수 또는 Vercel Environment Variables를 사용하세요. 채팅·이슈·커밋에 넣지 않습니다. `cp .env.example .env.local`은 기존 키가 없는 첫 실행 때만 사용합니다.

## 5. 빠른 개발·검증·배포

| 명령 | 사용 시점 |
| --- | --- |
| `pnpm dev` | 구현 중 유지. HMR과 Next DevTools로 빠르게 확인 |
| `pnpm check` | 린트 + 타입 검사. 작업 단위 완료 시 |
| `pnpm build` | 의존성·설정 변경 후 또는 데모 전 최종 확인 |
| `pnpm start` | 빌드된 결과를 로컬에서 확인 |

작업 중에는 MCP의 라우트 컴파일·오류 확인을 사용해 전체 빌드 반복을 줄입니다. 최종 배포 검증은 별도로 진행합니다. CI와 Vercel은 독립적으로 실행되며 **CI 완료를 기다리는 배포 게이트는 없습니다.**

### 팀 작업과 배포

- 개인 **공개** 레포입니다. 직접 push할 팀원은 소유자가 GitHub Collaborator로 초대합니다.
- 작은 작업은 브랜치를 나누고, `main`에 합치기 전에 담당 화면·API를 한 번 확인합니다.
- `main` push/merge → 고정 [데모 URL](https://hackerton-xi.vercel.app) 업데이트. 로컬 commit만으로는 배포되지 않습니다.
- 같은 레포의 다른 브랜치는 Preview 배포가 생성됩니다. 외부 fork PR은 별도 배포 승인이 필요할 수 있습니다.
- 자동 배포만 필요하면 팀원의 Vercel 초대는 필요하지 않습니다. 환경변수·프로젝트 설정은 소유자 계정에서 관리합니다.
- Vercel 환경변수는 필요한 환경(Production/Preview)에 등록하고 **재배포**해야 적용됩니다. Git 연동이 있으므로 같은 커밋을 CLI로 중복 배포하지 않습니다.

### 5시간 운영 예시

| 경과 시간 | 확인할 결과 |
| --- | --- |
| 0:00–0:20 | 문제·대상 사용자·데모의 핵심 동작 하나 확정, 작업 분담 |
| 0:20–1:00 | 화면 → 서버 → 실제 모델 호출까지 최소 흐름 연결·첫 배포 |
| 1:00–3:30 | 핵심 기능 구현, 작은 단위로 합치고 배포 확인 |
| 3:30–4:30 | 실제 데모 시나리오·실패 경로·모바일 확인 |
| 4:30–5:00 | 새 기능보다 데모 안정화, 제출 링크·발표 준비 |

## 막히면 먼저 확인

| 증상 | 확인 |
| --- | --- |
| Claude Code에 MCP가 안 보임 | 레포 루트인지, 의존성 설치·프로젝트 MCP 승인 여부, `/mcp`, 세션 재시작 |
| MCP가 앱을 못 찾음 | `pnpm dev` 실행 여부와 실제 포트. 3000이 사용 중이면 다른 포트로 시작될 수 있음 |
| Claude 모델 호출 실패 | 키와 모델 접근 권한, 서버 로그. 키가 없어도 빌드는 성공함 |
| push 후 배포가 바뀌지 않음 | GitHub의 Vercel 상태, Vercel 배포 로그, 대상 브랜치 확인 |

## 참고

- [Next.js AI 에이전트와 버전별 번들 문서](https://nextjs.org/docs/app/guides/ai-agents)
- [Next 개발 검증 스킬 원본](https://github.com/vercel/next.js/tree/canary/skills/next-dev-loop)
- [AI SDK 스킬 원본](https://github.com/vercel/ai/tree/main/skills/use-ai-sdk)
- [Agent Browser 설치](https://agent-browser.dev/installation)
- [Next.js MCP 공식 가이드](https://nextjs.org/docs/app/guides/mcp)
- [Claude Code 프로젝트 MCP 설정](https://code.claude.com/docs/en/mcp#project-scope)
- [Vercel AI SDK](https://ai-sdk.dev/docs) · [Anthropic 모델 목록](https://platform.claude.com/docs/en/models/overview)

이번 준비는 5시간 개발의 반복 속도를 위해 번들 문서·공식 MCP·기존 검사 도구를 조합했습니다. OpenAPI 화면, 별도 문서 서버, 새로운 린터·Git 훅·테스트 프레임워크는 지금 도입하지 않았습니다.
