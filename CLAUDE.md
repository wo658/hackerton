# Hackerton · Claude Code 프로젝트 가이드

Ambition for Korea 해커톤용 글로벌 AI 서비스의 시작점이다. 미션이 확정되기 전에는 현재의 가벼운 구조를 유지하고, 요청한 기능을 작은 단위로 구현한다. 팀과의 설명은 한국어, 기본 제품 UI는 영어를 사용한다.

## 개발 환경과 명령

- Next.js App Router, React, TypeScript strict, Tailwind CSS, pnpm. 정확한 버전은 `package.json`과 lockfile을 확인한다.
- Node.js는 `.nvmrc`의 24 LTS, pnpm은 `packageManager`에 지정된 버전을 사용한다.
- `pnpm install --frozen-lockfile`: 의존성 설치
- `pnpm dev`: 로컬 개발
- `pnpm lint`: Next Core Web Vitals + TypeScript 기본 ESLint 규칙
- `pnpm typecheck`: Next 타입 생성 + `tsc --noEmit`
- `pnpm build`: 프로덕션 빌드

Next.js 코드를 작성하기 전에 관련 `node_modules/next/dist/docs/` 문서를 확인한다. 설치 버전에는 학습 데이터와 다른 API와 설정이 있을 수 있다. `next.config.ts`의 `agentRules: false`는 이 가이드를 사용하면서 `AGENTS.md`가 다시 생성되는 것을 막기 위한 설정이다.

## 프로젝트 스킬

Claude Code가 관련 작업에 자동으로 선택하거나 아래 명령으로 호출할 수 있다. 필요한 스킬과 규칙만 읽는다.

- `/ai-sdk`: `.claude/skills/ai-sdk/SKILL.md` — 이 프로젝트의 Claude 연동, 스트리밍, 구조화된 출력, 도구 호출
- `/vercel-react-best-practices`: `.claude/skills/vercel-react-best-practices/SKILL.md` — Next.js·React 데이터 요청, 렌더링, 성능

## 코드 위치와 AI 경계

- `src/app/page.tsx`: 서버 페이지, AI 연결 설정 여부
- `src/components/chat.tsx`: 클라이언트 `useChat` UI
- `src/app/api/chat/route.ts`: 입력 검증, 모델 호출, 스트리밍 응답
- `src/lib/ai.ts`: `server-only`인 Anthropic provider와 모델 선택

Vercel AI SDK의 `@ai-sdk/anthropic`으로 Anthropic API를 직접 호출한다. 현재 작업에 필요한 경우가 아니면 Claude Agent SDK나 AI Gateway를 추가하지 않는다. 모델 기본값과 환경변수는 `src/lib/ai.ts`와 `.env.example`에서 확인한다. 모델을 바꾸려면 현재 공식 모델 ID 및 행사 계정의 접근 권한을 확인한다.

키는 로컬 `.env.local`과 Vercel 서버 환경변수로 관리한다. 키를 코드, 브라우저 번들, Git, 채팅, 로그에 노출하지 않는다. 키가 없을 때도 페이지는 정상적으로 열리고 AI 미연결 안내를 보여야 한다.

현재 대화는 탭 메모리에만 존재한다. DB, 로그인, 파일, 도구는 미션과 요청에 맞춰 추가한다. 클라이언트가 보내는 대화는 서버에서 검증하고, 공개 제품으로 확장할 때 인증·사용자별 호출 제한 필요성을 함께 검토한다.

## 검증과 빠른 배포

코드 변경은 린트·타입 검사와 관련 동작을 확인하고, 설정·의존성·빌드에 영향을 주면 프로덕션 빌드도 확인한다. 문서만 바꾸면 링크와 스킬 형식을 확인하면 된다. 실제 키가 없을 때 모의 스트림 검증과 실제 Claude 호출 검증을 구분해 보고한다.

- GitHub: `wo658/hackerton` (비공개)
- Vercel: `kjhs-projects-8661d4ca/hackerton`
- 데모: https://hackerton-xi.vercel.app
- `main` push는 Production 자동 배포, 다른 브랜치·PR은 Preview 배포다.
- GitHub CI와 Vercel 배포는 병렬이다. 빠른 배포를 위해 별도 CI 대기·승인 단계를 추가하지 않는다.
- 커밋·push·배포는 현재 사용자 요청에서 허용한 범위로 진행한다. Git 연동이 있으면 같은 변경을 CLI로 중복 배포할 필요가 없다.
- 비공개 레포의 팀원 작성 커밋 배포에는 Vercel Hobby 협업 제한이 있다. 임의로 레포 공개 여부나 요금제를 바꾸지 않는다.
