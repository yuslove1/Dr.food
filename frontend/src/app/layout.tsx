import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const bodyFont = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Dr Foods",
  description: "AI nutrition planning, dietitian consultations, and grocery delivery for Nigerian households.",
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#1B7A4A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
