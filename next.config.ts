import type { NextConfig } from "next";

/**
 * Static HTML export. The landing has no server logic, no forms and no CMS, so
 * the build produces plain files under `out/` that any static host can serve.
 * Images are pre-derived by `scripts/build-assets.sh` into public/, so the Next
 * image optimizer is not needed (and is unavailable in export mode).
 */
const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  devIndicators: false,
  trailingSlash: false,
  images: { unoptimized: true },
  // Next 16 writes its own AGENTS.md / CLAUDE.md on `next dev`; the hub governance owns those files.
  agentRules: false,
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
