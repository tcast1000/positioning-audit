import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AuditView from "@/components/AuditView";
import { loadAudit } from "@/lib/loadAudit";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

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

export default async function AuditPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const isNew = sp.new === "1";

  const audit = await loadAudit(slug);

  if (!audit) {
    notFound();
  }

  return <AuditView audit={audit} slug={slug} isNew={isNew} />;
}

export const dynamic = "force-dynamic";
