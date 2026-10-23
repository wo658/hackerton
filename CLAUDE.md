# 프로젝트 메모

AI 해커톤용 시작 프로젝트다. 미션·제품 요구사항은 아직 미정이며, 아래는 현재 구성과 초기 개발 방향이다. 요구에 맞춰 변경한다.

## 현재 구성

- Next.js App Router · React · TypeScript strict · Tailwind CSS · Node 24 · pnpm
- 최소 시작 화면: `src/app/page.tsx`, 상태 확인: `GET /api/health`
- AI: Vercel AI SDK + Anthropic, 서버 전용 `src/lib/ai.ts`의 `getModel()`. 실제 모델 호출 API·채팅 UI는 아직 없다.
- 인증·DB 없음. 우선 외부 AI API와 브라우저 상태로 구현하고, 필요할 때 저장소·추론 환경을 추가한다.
- 키는 `.env.local`·Vercel 서버 환경변수에 둔다. `ANTHROPIC_API_KEY`, 선택적으로 `ANTHROPIC_MODEL`을 사용한다. 키를 클라이언트나 Git에 노출하지 않는다.

## 개발·검증

- API 추가·변경·삭제 시 `AGENTS.md`의 API 문서 유지 지침에 따라 `public/openapi.json`을 같은 작업에서 갱신한다. `/api-docs`에서 실제 호출을 확인한다.

- 작은 사용자 흐름부터 완성하고 입력 검증·실패 처리를 함께 확인한다. 성능 최적화와 추가 도구는 필요할 때 도입한다.
- `pnpm dev`로 개발, 작업 단위로 `pnpm check`(린트·타입 검사), 최종 확인에 `pnpm build`를 실행한다. 문서만 수정하면 형식·참조 확인으로 충분하다.
- 설치 버전의 문서를 우선 참고한다: `node_modules/next/dist/docs/`, `node_modules/ai/docs/`, `node_modules/@ai-sdk/anthropic/`. 필요한 부분만 검색해 읽는다.
- `.mcp.json`에 Next DevTools MCP가 설정돼 있다. 변경한 화면은 실제 브라우저와 런타임 오류까지 확인한다. 도구 연결이 안 되면 로그·기본 검사로 진행하고 미확인 범위를 알린다.

## Claude Code 스킬

- `.claude/skills/ai-sdk/SKILL.md`: AI SDK 구현
- `.claude/skills/next-dev-loop/SKILL.md`: Next.js 실행·브라우저 검증

관련 작업에서 읽고, 공식 영문 원본은 번역·수정하지 않는다. `agent-browser`는 로컬 개발 의존성이다. 스킬의 명령을 실행할 셸에는 `export PATH="$PWD/node_modules/.bin:$PATH"`를 적용한다.

## 배포

`wo658/hackerton`의 `main` push → Vercel Production, 다른 브랜치·PR → Preview. GitHub CI는 배포와 병렬이다. Git 연동으로 배포되므로 같은 변경을 CLI로 중복 배포할 필요는 없다.
