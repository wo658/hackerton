import { Chat } from "@/components/chat";

export const dynamic = "force-dynamic";

export default function Home() {
  const configured = Boolean(process.env.ANTHROPIC_API_KEY?.trim());
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-5 py-12 sm:py-20">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">Ambition for Korea · Starter</p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Start with a conversation.</h1>
        <p className="max-w-xl text-base leading-7 text-zinc-600">A starting point for our next idea. Ask Claude something in any language.</p>
      </header>
      <Chat configured={configured} />
      <footer className="text-xs text-zinc-500">Conversations stay in this tab and reset when you refresh.</footer>
    </main>
  );
}
