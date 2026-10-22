# Hackerton · Claude Code 프로젝트 가이드

Ambition for Korea 해커톤용 글로벌 AI 서비스의 시작점이다. 실제 구현 시간은 약 5시간이다. 요청한 핵심 사용자 흐름을 먼저 연결하고, 미션이 정해지기 전에는 제품·DB·인증·에이전트 구조를 선결정하지 않는다. 설명은 한국어, 기본 제품 UI는 영어를 사용한다.

## 환경과 명령

정확한 버전은 `package.json`과 lockfile에서 확인한다. Next.js App Router, React, TypeScript strict, Tailwind CSS, Node 24 LTS, pnpm을 사용한다.

- `pnpm install --frozen-lockfile`: 설치
- `pnpm dev`: 개발 서버 유지
- `pnpm check`: Next 기본 ESLint + Next 타입 생성 + TypeScript 검사
- `pnpm build`: 최종 프로덕션 빌드
- `GET /api/health`: 키 없이 서버 연결 확인

## Next.js 문서를 찾는 순서

학습 데이터의 API를 그대로 쓰지 말고 **현재 설치 버전의 문서**를 먼저 읽는다. 문서를 다시 다운로드하거나 전체 내용을 컨텍스트에 넣을 필요는 없다.

| 작업 | 먼저 검색할 로컬 경로 |
| --- | --- |
| 페이지·레이아웃·서버/클라이언트 경계 | `node_modules/next/dist/docs/01-app/01-getting-started/` |
| 기능 구현·문제 해결 | `node_modules/next/dist/docs/01-app/02-guides/` |
| Route Handler·특수 파일 | `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/` |
| cookies·headers·캐시 등 함수 | `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/` |
| Next 설정 | `node_modules/next/dist/docs/01-app/03-api-reference/05-config/` |
| AI SDK | `node_modules/ai/docs/`, `node_modules/ai/src/` |
| Claude provider | `node_modules/@ai-sdk/anthropic/docs/`, `node_modules/@ai-sdk/anthropic/src/` |

예를 들어 `rg -l 'cookies' node_modules/next/dist/docs/01-app/03-api-reference/`로 후보 파일을 찾고 관련 부분만 읽는다. 로컬에 없는 정보만 공식 https://nextjs.org/docs 또는 https://ai-sdk.dev/docs 에서 확인한다. `agentRules: false`는 `AGENTS.md` 재생성을 막으며 이 지침이 번들 문서 참조를 담당한다.

## 빠른 개발 루프: Next DevTools MCP

`.mcp.json`이 개발 의존성으로 고정된 공식 `next-devtools-mcp`를 `pnpm exec`로 실행한다. Claude Code의 프로젝트 MCP 최초 승인은 사용자별로 진행한다. 승인 설정을 대신 넓히지 않는다.

1. 기존 dev 서버가 있으면 재사용한다. 없으면 `pnpm dev`를 실행한다.
2. `nextjs_index`로 현재 작업 폴더와 실제 포트가 맞는 서버를 찾는다. 여러 앱이 실행 중이면 무조건 첫 서버를 고르지 않는다.
3. `nextjs_call`로 필요한 도구를 호출한다. 제공 도구와 입력 스키마는 실제 서버 목록을 확인한다.
   - `get_errors`: 현재 오류
   - `get_routes`: 현재 라우트
   - `compile_route` / `get_compilation_issues`: 수정한 라우트 컴파일 확인
   - `get_logs`: 로그 파일 위치
4. 브라우저 런타임 오류·페이지 메타데이터는 해당 페이지를 브라우저로 연 뒤 확인한다.

MCP의 문서 도구는 번들 문서 위치를 안내한다. 필요한 파일은 직접 읽는다. MCP가 승인되지 않았거나 연결되지 않으면 로컬 문서·서버 로그·`pnpm check`로 계속 진행하고 확인하지 못한 범위를 보고한다. 이 MCP를 프로덕션에 노출하거나 별도 원격 서비스로 만들지 않는다.

구현 중에는 HMR·라우트 컴파일로 빠르게 확인한다. 작업 단위가 끝나면 `pnpm check`, 설정·의존성·배포 경로 변경 후나 최종 확인에는 `pnpm build`를 실행한다. 문서만 바꾸면 참조·형식 확인으로 충분하다.

## 제품과 AI 코드

- `src/app/page.tsx`: 교체할 최소 시작 화면. 채팅 UI 없음
- `src/app/api/health/route.ts`: 단순 상태 API
- `src/app/api/<기능>/route.ts`: 미션에 맞는 API를 추가할 위치
- `src/lib/ai.ts`: `server-only` Anthropic 모델 팩토리 `getModel()`

Vercel AI SDK와 `@ai-sdk/anthropic`으로 직접 호출한다. 모델 기본값은 코드에서, override는 `ANTHROPIC_MODEL`에서 확인한다. 모델 변경 시 공식 모델 ID와 행사 계정 지원 여부를 확인한다. 현재 실제 모델을 호출하는 공개 API는 없다.

실제 키는 `.env.local` 및 Vercel 서버 환경변수로 관리한다. 키를 `NEXT_PUBLIC_` 변수, 코드, Git, 채팅, 로그에 넣지 않는다. 키가 없어도 페이지·health·빌드는 동작해야 한다. 사용자 입력을 받는 AI API를 추가할 때는 기존 Zod로 검증하고, 출력·시간 제한과 실패 응답을 함께 구현한다. 실제 API 검증과 모의 응답 검증을 구분한다.

## 프로젝트 스킬

관련 작업에서 필요한 스킬만 읽는다.

- `/ai-sdk`: `.claude/skills/ai-sdk/SKILL.md`
- `/vercel-react-best-practices`: `.claude/skills/vercel-react-best-practices/SKILL.md`

규칙 예시에 등장하는 라이브러리를 자동으로 설치하지 않는다. 프레임워크 기본 기능과 기존 의존성으로 먼저 구현하고, 미션에 필요한 경우에만 추가 도입한다.

## 배포와 협업

- 공개 레포: `wo658/hackerton`
- Vercel: `kjhs-projects-8661d4ca/hackerton`
- 데모: https://hackerton-xi.vercel.app
- `main` push는 Production, 같은 레포의 다른 브랜치·PR은 Preview다.
- GitHub CI와 배포는 병렬이다. 빠른 배포를 위해 CI 대기·승인 게이트를 추가하지 않는다.
- 직접 push할 팀원은 GitHub Collaborator 초대가 필요하다. 자동 배포만을 위한 Vercel 초대는 필요하지 않다.
- 커밋·push·배포는 현재 사용자 요청에서 허용한 범위로 진행한다. Git 연동이 있으므로 CLI로 같은 변경을 중복 배포하지 않는다.
- 공개 여부·요금제·권한은 요청 없이 바꾸지 않는다.
