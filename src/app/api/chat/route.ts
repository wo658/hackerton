import { convertToModelMessages, createUIMessageStreamResponse, streamText, toUIMessageStream } from "ai";
import { z } from "zod";
import { getModel } from "@/lib/ai";

export const maxDuration = 60;

// This starter accepts text only. Extend the schema when adding tools or files.
const chatRequest = z.object({
  messages: z.array(z.object({
    id: z.string().min(1).max(200),
    role: z.enum(["user", "assistant"]),
    parts: z.array(z.discriminatedUnion("type", [
      z.object({ type: z.literal("text"), text: z.string().max(8000) }),
      // useChat includes this marker in assistant replies on later turns.
      z.object({ type: z.literal("step-start") }),
    ])).min(1).max(10),
  }).refine((message) => message.parts.some((part) => part.type === "text" && part.text.trim().length > 0), {
    message: "A message must contain text.",
  })).min(1).max(40),
});

export async function POST(request: Request) {
  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > 64_000) {
    return new Response("Conversation is too long. Refresh to start a new one.", { status: 413 });
  }

  let payload;
  try {
    payload = chatRequest.parse(JSON.parse(body));
  } catch {
    return new Response("Send a valid text conversation with up to 40 messages.", { status: 400 });
  }
  if (payload.messages.at(-1)?.role !== "user") {
    return new Response("The last message must be from the user.", { status: 400 });
  }
  if (!process.env.ANTHROPIC_API_KEY?.trim()) {
    return new Response("Claude is not connected yet. Please try again later.", { status: 503 });
  }

  const result = streamText({
    model: getModel(),
    messages: await convertToModelMessages(payload.messages),
    maxOutputTokens: 2048,
    timeout: 45_000,
    abortSignal: request.signal,
    maxRetries: 1,
  });
  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      sendReasoning: false,
      onError: () => "Claude could not finish the response. Please try again.",
    }),
  });
}
