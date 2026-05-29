import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Run your own audit",
  description:
    "Paste a B2B SaaS URL and your Anthropic API key to get a positioning audit using April Dunford's framework.",
};

export default function RunLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
