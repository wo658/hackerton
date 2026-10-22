# Ambition AI starter

Ambition for Korea 해커톤 팀의 기본 개발 환경입니다. Next.js App Router, TypeScript, Tailwind CSS, Vercel AI SDK, Claude 스트리밍 예제를 포함합니다.

## 로컬 실행

Node.js 24 LTS와 pnpm 11.2.2를 사용합니다.

```sh
nvm use
corepack enable
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

http://localhost:3000 에서 확인합니다. `.env.local`에 행사에서 받은 `ANTHROPIC_API_KEY`를 넣으면 Claude 호출이 활성화됩니다. 키가 없어도 화면은 열리며 입력은 비활성화됩니다. 키를 채팅이나 Git에 공유하지 마세요.

`ANTHROPIC_MODEL`로 모델을 변경할 수 있습니다. 기본값은 `claude-sonnet-5-5`이며, 행사 계정이 지원하는 모델을 사용하세요. AI Gateway를 거치지 않고 Anthropic API를 직접 호출합니다.

## 작업 위치

- `src/app/page.tsx`: 서버 페이지와 연결 상태
- `src/components/chat.tsx`: `useChat` 기반 스트리밍 UI
- `src/app/api/chat/route.ts`: 텍스트 입력 검증, Claude 호출, 오류 처리
- `src/lib/ai.ts`: 서버 전용 provider 및 모델 선택

대화는 브라우저 탭 메모리에만 보관됩니다. 텍스트 대화만 지원하며 DB, 로그인, 파일 업로드, 도구 호출은 미션 확정 후 추가합니다. 요청당 64 KB, 대화 40개, 메시지 부분당 8,000자, 출력 2,048 토큰, 호출 45초로 제한합니다. 인증·사용자별 호출 제한은 아직 없으므로 실제 키를 연결한 공개 서비스로 확장할 때 추가하세요.

## 검증 및 배포

```sh
pnpm lint
pnpm typecheck
pnpm build
```

GitHub Actions에서 위 검사를 실행합니다. Vercel Git 연동으로 `main` push는 Production, 다른 브랜치와 PR은 Preview 배포를 만듭니다. CI와 Vercel 빌드는 독립적으로 실행됩니다.

Vercel 프로젝트의 Environment Variables에 `ANTHROPIC_API_KEY`를 필요한 환경별로 등록한 뒤 재배포하세요. 모델 변경 시 `ANTHROPIC_MODEL`도 등록합니다. 팀원이 커밋하려면 GitHub 초대가 필요하며, 비공개 레포의 다른 작성자 커밋 배포에는 Vercel 요금제 및 멤버 권한 제한이 적용될 수 있습니다.

## 개발 가이드

요청한 `ai-sdk`, `vercel-react-best-practices` 스킬은 프로젝트 소유자의 Codex에 설치되어 있습니다. 팀원은 아래 공식 소스에서 각자 설치할 수 있습니다.

- https://skills.sh/vercel/ai/ai-sdk
- https://skills.sh/vercel-labs/agent-skills/vercel-react-best-practices

AI SDK API를 수정할 때는 설치 버전과 일치하는 `node_modules/ai/docs` 및 `node_modules/@ai-sdk/anthropic/docs`를 먼저 확인하세요.
