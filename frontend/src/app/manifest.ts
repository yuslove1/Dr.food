import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dr Foods",
    short_name: "Dr Foods",
    description: "AI nutrition planning, dietitian consultations, and grocery delivery for Nigerian households.",
    start_url: "/",
    display: "standalone",
    background_color: "#FAF8F3",
    theme_color: "#1B7A4A",
    orientation: "portrait",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
