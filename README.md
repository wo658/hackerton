# Hackerton · Ambition for Korea

AI 해커톤에서 핵심 기능을 빠르게 구현하기 위한 Next.js 시작 프로젝트입니다. 미션에 맞는 화면과 AI 기능을 추가하면 됩니다.

[데모](https://hackerton-xi.vercel.app) · [GitHub](https://github.com/wo658/hackerton)

## 현재 구성

- **웹:** Next.js App Router, React, TypeScript strict, Tailwind CSS
- **AI:** Vercel AI SDK + Anthropic Claude 연동용 서버 모델 팩토리
- **개발 환경:** Node.js 24, pnpm
- **Claude Code:** 공식 `ai-sdk`·`next-dev-loop` 스킬 원본, Next DevTools MCP
- **검증:** Next.js 기본 ESLint, TypeScript 타입 검사, GitHub CI

현재는 최소 시작 화면과 `/api/health`만 제공합니다. 채팅 UI나 실제 모델 호출 API는 아직 없으며, 제품 기능은 미션에 맞춰 구현합니다.

## API 문서

- `/api-docs`: Swagger UI에서 API 설명을 보고 `Execute`로 현재 서버에 직접 요청합니다.
- `/openapi.json`: OpenAPI 명세. 현재 `GET /api/health`의 응답과 예시를 포함합니다.
- API 작업 시 Agent가 같은 변경에서 명세도 갱신하도록 `AGENTS.md`·`CLAUDE.md`에 지침을 두었습니다. 코드에서 명세를 자동 추출하는 방식은 아닙니다.

## 개발 기본값

**브라우저 입력 → Next.js 서버에서 검증·AI API 호출 → 브라우저 결과 표시** 구조를 우선합니다.

- 입력·진행 상태·결과는 React 상태로 관리합니다. 필요할 때만 `sessionStorage`나 `localStorage`를 사용합니다.
- 로그인·권한·사용자 구분·DB 저장은 기본 범위에 포함하지 않습니다.
- 온디바이스 모델, 별도 ML 추론 서버, 학습·파인튜닝은 미션에서 필요할 때만 검토합니다.
- API 키는 `.env.local`과 Vercel 서버 환경변수로 관리합니다. `ANTHROPIC_API_KEY`가 필요하며 모델은 `ANTHROPIC_MODEL`로 변경할 수 있습니다. `.env*`는 `.env.example`을 제외하고 Git에서 제외합니다.
- 성능 최적화보다 핵심 흐름 완성, 실패 처리, 실제 동작 확인을 우선합니다.

## 주요 파일

| 경로 | 역할 |
| --- | --- |
| `src/app/page.tsx` | 시작 화면 |
| `src/app/api/health/route.ts` | 서버 상태 확인 |
| `src/lib/ai.ts` | 서버 전용 Claude 모델 팩토리 |
| `CLAUDE.md` | AI 개발 지침, 공식 문서 참조 방법, 검증 루프 |
| `.claude/skills/`, `.mcp.json` | Claude Code 스킬·개발 도구 설정 |

## 검증과 배포

- `pnpm check`: 린트·타입 검사
- `pnpm build`: 프로덕션 빌드 확인
- `main`에 push하면 Vercel **Production 자동 배포**, 다른 브랜치·PR은 **Preview 배포**됩니다.
- GitHub CI와 Vercel 배포는 병렬로 실행됩니다.
- 팀원은 GitHub Collaborator 권한으로 push할 수 있으며, 자동 배포를 위한 별도 Vercel 초대는 필요하지 않습니다.
