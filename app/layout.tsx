import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://tools.teddycastro.me";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Positioning audit | Teddy Castro",
    template: "%s | Positioning audit",
  },
  description:
    "AI-powered B2B SaaS positioning audit using April Dunford's framework. Paste a URL, get a sharp diagnosis.",
  openGraph: {
    type: "website",
    siteName: "Positioning audit | Teddy Castro",
    title: "Positioning audit | Teddy Castro",
    description:
      "AI-powered B2B SaaS positioning audit using April Dunford's framework. Paste a URL, get a sharp diagnosis.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
