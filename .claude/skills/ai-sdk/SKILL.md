---
name: ai-sdk
description: 이 프로젝트에서 Vercel AI SDK와 Anthropic provider로 Claude 기능을 구현하거나 수정한다. 스트리밍 채팅, useChat, 구조화된 출력, 도구 호출, 모델 설정을 다룰 때 사용한다.
metadata:
  upstream: https://github.com/vercel/ai/tree/main/skills/use-ai-sdk
  adapted-for: hackerton-claude-code
---

# Claude 서비스용 Vercel AI SDK

## 먼저 확인할 것

`package.json`에서 설치 버전을 확인하고, 관련 문서·소스만 읽는다. API 이름과 옵션을 기억에 의존해 작성하지 않는다.

- `node_modules/ai/docs/`, `node_modules/ai/src/`
- `node_modules/@ai-sdk/anthropic/docs/`, `node_modules/@ai-sdk/anthropic/src/`
- `node_modules/@ai-sdk/react/`의 타입과 소스

로컬 자료에 없으면 https://ai-sdk.dev/docs 에서 공식 문서를 확인한다. 모델 ID와 사용 가능 여부는 https://platform.claude.com/docs/en/models/overview 및 실제 행사 계정 기준으로 확인한다. `ANTHROPIC_MODEL`이 설정되어 있다면 이를 존중한다.

## 이 프로젝트의 연결 구조

`src/lib/ai.ts`가 서버 전용 모델 팩토리다. `@ai-sdk/anthropic`으로 Anthropic API를 직접 호출하고 `ANTHROPIC_API_KEY`를 사용한다. 현재 과제는 AI Gateway나 Claude Agent SDK로 교체하는 작업이 아니다.

기존 호출 경로를 확장한다.

- 서버: `src/app/api/chat/route.ts`에서 요청 검증 → `convertToModelMessages` → `streamText` → UI 메시지 스트림 응답
- 클라이언트: `src/components/chat.tsx`에서 `useChat`, `message.parts`, 제출·스트리밍·중단·오류 상태 처리
- 설정: `.env.example`에는 변수명과 예시만, 실제 키는 `.env.local` 및 Vercel 환경변수에 보관

## 기능을 확장할 때

텍스트 채팅은 현재 경로와 검증 범위로 유지한다. 구조화된 출력, 도구, 파일을 추가할 때만 그 기능에 필요한 SDK API와 스키마를 도입한다.

- **스트리밍:** 첫 응답뿐 아니라 SDK가 생성한 assistant 메시지를 포함하는 후속 요청도 확인한다. `step-start`와 Anthropic provider 메타데이터 같은 제어 부분을 텍스트와 구분한다. 현재 서버는 텍스트 부분만 모델에 전달한다.
- **구조화된 출력:** 설치 버전이 지원하는 출력 API와 Zod 스키마를 사용한다. JSON처럼 보이는 문자열을 타입 안전한 결과로 취급하지 않는다.
- **도구 호출:** 도구의 입력 스키마와 실행 위치를 명확히 하고, 서버 검증과 UI 메시지 타입을 함께 확장한다. 에이전트 루프가 필요하면 설치 버전의 기본 에이전트 추상화를 우선 검토한다. 도구 추가 시 현재 텍스트 전용 정규화가 도구 결과를 버리지 않도록 수정한다.
- **검증:** 텍스트 이외의 메시지 부분이 생기면 SDK의 `validateUIMessages` 등 지원 API와 실제 스키마를 확인한다. 임의의 클라이언트 메시지나 도구 결과를 신뢰하지 않는다.
- **오류와 비용:** 기존 요청 크기·대화 길이·출력·시간 제한을 존중하고, 변경이 필요하면 그 이유를 설명한다. 중단 신호를 전달하고 provider 내부 오류는 사용자용 메시지로 바꾼다.

AI SDK DevTools, 관측 도구, DB 등은 요청이나 구체적인 디버깅 필요가 있을 때 도입한다. 이번 기능과 무관한 provider 패키지는 설치하지 않는다.

## 확인

`pnpm typecheck`를 실행하고 변경에 맞는 검증을 한다. 스트리밍을 수정하면 다국어 텍스트, 후속 대화, 호출 실패, 중단 동작 중 영향을 받은 경로를 확인한다. 모의 provider로 확인한 범위와 실제 API로 확인한 범위를 구분한다. 인증키가 없으면 가짜 응답을 실제 Claude 응답으로 제시하지 않는다.

기본 배포 흐름과 공통 프로젝트 지침은 루트 `CLAUDE.md`를 따른다.
