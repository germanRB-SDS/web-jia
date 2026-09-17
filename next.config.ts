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
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: { root: import.meta.dirname },
};

export default nextConfig;
