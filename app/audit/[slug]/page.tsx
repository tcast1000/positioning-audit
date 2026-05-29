import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AuditView from "@/components/AuditView";
import { loadAudit } from "@/lib/loadAudit";

const showcaseSlugs = ["linear", "notion", "vercel"];

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const audit = await loadAudit(slug);
  if (!audit) return {};

  const title = audit.company.name;
  const description = audit.current_positioning_summary.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title: `${audit.company.name} positioning audit`,
      description,
      type: "article",
    },
  };
}

export default async function AuditPage({ params }: Props) {
  const { slug } = await params;
  const audit = await loadAudit(slug);

  if (!audit) {
    notFound();
  }

  return <AuditView audit={audit} />;
}

export async function generateStaticParams() {
  return showcaseSlugs.map((slug) => ({ slug }));
}

export const dynamicParams = true;
