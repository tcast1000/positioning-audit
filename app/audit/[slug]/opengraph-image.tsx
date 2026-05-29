import { ImageResponse } from "next/og";
import { loadAudit } from "@/lib/loadAudit";

export const alt = "Positioning audit";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let audit;
  try {
    audit = await loadAudit(slug);
  } catch {
    audit = null;
  }

  const companyName = audit?.company.name ?? "Positioning audit";
  const summary = audit?.current_positioning_summary?.slice(0, 140) ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          backgroundColor: "#F5F5F3",
          padding: "80px",
          fontFamily: "serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 16,
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              color: "#94918b",
              marginBottom: 24,
              fontFamily: "monospace",
            }}
          >
            Positioning audit
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 400,
              color: "#1a1a1a",
              lineHeight: 1.1,
              marginBottom: 32,
              fontStyle: "italic",
            }}
          >
            {companyName}
          </div>
          {summary && (
            <div
              style={{
                fontSize: 24,
                color: "#94918b",
                lineHeight: 1.5,
                maxWidth: 800,
              }}
            >
              {summary}
            </div>
          )}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div style={{ fontSize: 18, color: "#94918b" }}>
            tools.teddycastro.me
          </div>
          <div style={{ fontSize: 18, color: "#9E5F3E" }}>
            April Dunford&apos;s framework
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
