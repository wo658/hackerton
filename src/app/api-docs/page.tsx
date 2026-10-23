import type { Metadata } from "next";
import Swagger from "./swagger";

export const metadata: Metadata = {
  title: "API Docs | Hackerton",
  description: "API 문서 및 직접 호출",
};

export default function ApiDocsPage() {
  return (
    <main className="min-h-screen bg-white py-6 text-zinc-900">
      <Swagger />
    </main>
  );
}
