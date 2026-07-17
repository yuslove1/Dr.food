import path from "node:path";
import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

// Serwist's precache-injection plugin is webpack-based, which conflicts with Turbopack
// (the default for `next dev`). Only wrap the config with it for production builds, which
// run via `next build --webpack` (see package.json) for exactly this reason.
const isDev = process.env.NODE_ENV === "development";

export default isDev
  ? nextConfig
  : withSerwistInit({ swSrc: "src/app/sw.ts", swDest: "public/sw.js" })(nextConfig);
