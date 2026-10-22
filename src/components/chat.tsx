"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export function Chat({ configured }: { configured: boolean }) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, error, stop, clearError } = useChat();
  const busy = status === "submitted" || status === "streaming";

  return (
    <section aria-label="Chat with Claude" className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      {!configured ? (
        <p role="status" className="border-b border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-900">
          Claude is not connected yet. The team will enable it before the demo.
        </p>
      ) : null}
      <div role="log" aria-label="Conversation" aria-live="polite" aria-busy={busy} className="max-h-[55vh] min-h-56 space-y-6 overflow-y-auto p-5 sm:p-7">
        {messages.length === 0 ? <p className="text-sm text-zinc-500">Your conversation starts here.</p> : null}
        {messages.map((message) => (
          <article key={message.id} className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">{message.role === "user" ? "You" : "Claude"}</h2>
            {message.parts.map((part, index) => part.type === "text" ? (
              <p key={index} className="whitespace-pre-wrap break-words text-sm leading-7">{part.text}</p>
            ) : null)}
          </article>
        ))}
        {status === "submitted" ? <p role="status" className="text-sm text-zinc-500">Claude is thinking…</p> : null}
      </div>
      {error ? <p role="alert" className="px-5 pb-4 text-sm text-red-700">{error.message || "Could not connect to Claude. Please try again."}</p> : null}
      <form className="flex flex-col gap-3 border-t border-zinc-100 p-5" onSubmit={(event) => {
        event.preventDefault();
        if (!input.trim() || busy || !configured) return;
        clearError();
        void sendMessage({ text: input.trim() });
        setInput("");
      }}>
        <label htmlFor="message" className="text-sm font-medium">Your message</label>
        <textarea id="message" value={input} onChange={(event) => setInput(event.target.value)} disabled={!configured || busy}
          maxLength={8000} rows={3} placeholder="What would you like to explore?"
          className="resize-y rounded-xl border border-zinc-300 px-3 py-3 text-sm outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-zinc-50" />
        <div className="flex justify-end">
          {busy ? <button type="button" onClick={() => stop()} className="rounded-lg border border-zinc-300 px-5 py-2.5 text-sm font-medium">Stop</button> : (
            <button type="submit" disabled={!configured || !input.trim()} className="rounded-lg bg-emerald-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-40">Send message</button>
          )}
        </div>
      </form>
    </section>
  );
}
