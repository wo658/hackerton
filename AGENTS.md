# API 문서 유지

- API를 추가·변경·삭제하면 같은 작업에서 `public/openapi.json`도 갱신한다. 별도 요청을 기다리지 않는다.
- 최소한 경로·HTTP 메서드·짧은 설명·입력(있는 경우)·응답 상태와 스키마·예시를 실제 구현과 맞춘다. 스트리밍이면 실제 Content-Type과 이벤트 형식을 설명한다.
- Swagger UI는 `/api-docs`, 명세는 `/openapi.json`이다. `servers`의 상대 경로 `/`를 유지해 로컬·Preview·Production에서 현재 서버를 호출하게 한다.
- API 변경을 확인할 때 문서에서 실제 요청을 실행하고 응답을 확인한다. 비밀값이나 실제 개인정보를 예시에 넣지 않는다.
