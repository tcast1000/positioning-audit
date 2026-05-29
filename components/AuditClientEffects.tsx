"use client";

import { useEffect } from "react";
import { useAuditHistory } from "@/lib/useAuditHistory";
import SaveBanner from "@/components/SaveBanner";

export default function AuditClientEffects({
  slug,
  companyName,
  companyUrl,
  generatedAt,
  isNew,
}: {
  slug: string;
  companyName: string;
  companyUrl: string;
  generatedAt: string;
  isNew: boolean;
}) {
  const { addAudit } = useAuditHistory();

  useEffect(() => {
    if (isNew) {
      addAudit({ slug, companyName, companyUrl, generatedAt });
    }
  }, [isNew, slug, companyName, companyUrl, generatedAt, addAudit]);

  if (!isNew) return null;

  return <SaveBanner slug={slug} />;
}
