"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(() => import("swagger-ui-react"), {
  ssr: false,
  loading: () => <p className="p-8">API 문서를 불러오는 중입니다…</p>,
});

export default function Swagger() {
  return (
    <SwaggerUI
      url="/openapi.json"
      deepLinking
      tryItOutEnabled
      docExpansion="list"
    />
  );
}
