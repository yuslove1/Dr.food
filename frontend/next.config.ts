import path from "node:path";
import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

// Serwist's precache-injection plugin is webpack-based, which conflicts with Turbopack
// (the default for `next dev`). Only wrap the config with it for production builds, which
// run via `next build --webpack` (see package.json) for exactly this reason.
const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      // Backend-hosted user uploads (see backend/src/modules/feed/upload.middleware.ts) —
      // scope this to your real API host in production via a specific hostname/port.
      { protocol: "http", hostname: "localhost" },
    ],
    // Next 16 blocks image optimization against local/private IPs by default (SSRF guard).
    // Only allow it in dev, where the backend legitimately runs on localhost — never carry
    // this into a production build, where APP_URL should be a real public host anyway.
    ...(isDev ? { dangerouslyAllowLocalIP: true } : {}),
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default isDev
  ? nextConfig
  : withSerwistInit({ swSrc: "src/app/sw.ts", swDest: "public/sw.js" })(nextConfig);
