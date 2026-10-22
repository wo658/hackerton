import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Project instructions live in CLAUDE.md; do not regenerate AGENTS.md.
  agentRules: false,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
