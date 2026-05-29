import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Compare audits",
  description:
    "View positioning audits side by side. Compare competitive alternatives, unique attributes, and diagnoses across companies.",
};

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
