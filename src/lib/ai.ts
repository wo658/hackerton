import "server-only";
import { anthropic } from "@ai-sdk/anthropic";

export function getModel() {
  return anthropic(process.env.ANTHROPIC_MODEL?.trim() || "claude-sonnet-5-5");
}
