---
name: ai-sdk
description: 이 프로젝트에서 Vercel AI SDK와 Anthropic provider로 Claude 기능을 구현하거나 수정한다. 텍스트 생성, 스트리밍, 구조화된 출력, 도구 호출, 모델 설정을 다룰 때 사용한다.
metadata:
  upstream: https://github.com/vercel/ai/tree/main/skills/use-ai-sdk
  adapted-for: hackerton-claude-code
---

# Claude 서비스용 Vercel AI SDK

## 먼저 확인

`package.json`에서 설치 버전을 확인하고 관련 번들 문서·소스만 읽는다. API 이름과 옵션을 기억에 의존하지 않는다.

- `node_modules/ai/docs/`, `node_modules/ai/src/`
- `node_modules/@ai-sdk/anthropic/docs/`, `node_modules/@ai-sdk/anthropic/src/`

로컬 자료에 없으면 https://ai-sdk.dev/docs 를 확인한다. 모델 ID·접근 권한은 https://platform.claude.com/docs/en/models/overview 및 실제 행사 계정 기준으로 확인한다. `ANTHROPIC_MODEL` override를 존중한다.

## 현재 출발점

`src/lib/ai.ts`의 `getModel()`이 서버 전용 모델 팩토리다. `@ai-sdk/anthropic`으로 Anthropic API를 직접 호출하며 `ANTHROPIC_API_KEY`를 사용한다. 현재 채팅 UI·채팅 API·실제 모델 호출 API는 없다. `GET /api/health`는 서버 상태만 확인한다.

미션에 필요한 서버 기능에 `getModel()`을 가져와 구현한다. 단발 생성은 `generateText`, 응답 지연을 줄일 필요가 있으면 `streamText`, 구조화된 데이터는 설치 버전의 출력 API와 Zod 스키마를 사용한다. AI Gateway나 Claude Agent SDK로 교체할 필요를 먼저 만들지 않는다.

## 필요한 기능만 구현

- 사용자 입력은 서버에서 Zod 등 기존 도구로 검증한다. 모델 출력 문자열을 스키마 검증 없이 타입 안전한 데이터로 취급하지 않는다.
- 모델 호출에는 용도에 맞는 출력·시간 제한, 중단 신호, 사용자용 실패 응답을 둔다. 내부 provider 오류나 비밀정보를 그대로 반환하지 않는다.
- 채팅이 미션에 필요해지면 `@ai-sdk/react`를 추가하고 설치 버전의 `useChat` 문서부터 확인한다. SDK의 assistant 메시지를 다시 전송하는 후속 대화까지 검증한다. 텍스트 외 제어 메시지·provider 메타데이터·도구 결과를 구분한다.
- 도구에는 입력 스키마와 실행 위치를 명시한다. 에이전트 루프가 필요하면 SDK 기본 추상화를 우선 확인한다. 클라이언트가 전송한 도구 결과를 그대로 신뢰하지 않는다.
- 구조화된 출력·파일·도구·에이전트는 이번 요청에 필요한 경우에만 도입한다. DevTools·관측 서비스도 구체적인 디버깅 필요가 있을 때 추가한다.
- 실제 키는 `.env.local`과 Vercel 환경변수에 둔다. 브라우저로 노출하지 않으며 키가 없어도 기본 앱·health·빌드는 동작하게 한다.

## 확인

`pnpm check`를 실행한다. 새 AI 기능은 입력 검증과 실패 경로부터 확인하고, 실제 API 키가 있을 때 실제 응답을 확인한다. 스트리밍·다국어·후속 대화·중단은 변경에 해당하는 경우 검증한다. 모의 응답 검증을 실제 Claude 호출 검증으로 보고하지 않는다.

빠른 개발 루프·배포 지침은 루트 `CLAUDE.md`를 따른다.
