"use client";

import { useState } from "react";

type Status = "idle" | "generating" | "done" | "failed";

export default function DownloadButton({
  companyName,
}: {
  companyName: string;
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function generate() {
    if (status === "generating") return;
    setStatus("generating");

    const hideStyle = document.createElement("style");
    hideStyle.textContent = ".pdf-hide { display: none !important; }";

    try {
      const { toCanvas } = await import("html-to-image");

      const jspdfModule = await import("jspdf");
      const jsPDF = jspdfModule.jsPDF ?? jspdfModule.default;

      if (!toCanvas || !jsPDF) {
        throw new Error("Failed to load PDF libraries");
      }

      const article = document.querySelector<HTMLElement>("article");
      if (!article) throw new Error("No article element found");

      const hiddenEls = article.querySelectorAll(
        "nav, footer, button, .no-print"
      );
      hiddenEls.forEach((el) => el.classList.add("pdf-hide"));
      document.head.appendChild(hideStyle);

      // Constrain width and remove centering margin so content fits A4
      const saved = {
        width: article.style.width,
        maxWidth: article.style.maxWidth,
        padding: article.style.padding,
        margin: article.style.margin,
      };
      article.style.width = "595px";
      article.style.maxWidth = "595px";
      article.style.padding = "40px";
      article.style.margin = "0";

      await new Promise((r) => setTimeout(r, 150));

      let canvas: HTMLCanvasElement;
      try {
        canvas = await toCanvas(article, {
          pixelRatio: 2,
          backgroundColor: "#F5F5F3",
        });
      } finally {
        article.style.width = saved.width;
        article.style.maxWidth = saved.maxWidth;
        article.style.padding = saved.padding;
        article.style.margin = saved.margin;
        hideStyle.remove();
        hiddenEls.forEach((el) => el.classList.remove("pdf-hide"));
      }

      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 16;
      const headerHeight = 8;
      const footerHeight = 8;
      const contentWidth = pageWidth - margin * 2;
      const contentTop = margin + headerHeight;
      const contentHeight = pageHeight - contentTop - margin - footerHeight;

      const scaleFactor = contentWidth / canvas.width;
      const scaledFullHeight = canvas.height * scaleFactor;
      const totalPages = Math.ceil(scaledFullHeight / contentHeight);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7);
        pdf.setTextColor(100, 100, 100);
        pdf.text(
          `Positioning audit — ${companyName}`,
          margin,
          margin + 4
        );

        const sourceY = (page * contentHeight) / scaleFactor;
        const sourceHeight = Math.min(
          contentHeight / scaleFactor,
          canvas.height - sourceY
        );
        const destHeight = sourceHeight * scaleFactor;

        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = canvas.width;
        pageCanvas.height = Math.ceil(sourceHeight);
        const ctx = pageCanvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");

        ctx.drawImage(
          canvas,
          0,
          Math.floor(sourceY),
          canvas.width,
          Math.ceil(sourceHeight),
          0,
          0,
          canvas.width,
          Math.ceil(sourceHeight)
        );

        pdf.addImage(
          pageCanvas.toDataURL("image/png"),
          "PNG",
          margin,
          contentTop,
          contentWidth,
          destHeight
        );

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7);
        pdf.setTextColor(100, 100, 100);
        const footerText = `Page ${page + 1} of ${totalPages}`;
        const footerWidth = pdf.getTextWidth(footerText);
        pdf.text(
          footerText,
          pageWidth - margin - footerWidth,
          pageHeight - margin
        );
      }

      const safeFileName = companyName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
      pdf.save(`${safeFileName}-positioning-audit.pdf`);

      setStatus("done");
      setTimeout(() => setStatus("idle"), 1500);
    } catch (err) {
      hideStyle.remove();
      document
        .querySelectorAll(".pdf-hide")
        .forEach((el) => el.classList.remove("pdf-hide"));
      const msg = err instanceof Error ? err.message : String(err);
      console.error("PDF generation failed:", msg, err);
      alert(`PDF generation failed: ${msg}`);
      setStatus("failed");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }

  return (
    <button
      onClick={generate}
      disabled={status === "generating"}
      className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm min-h-[44px] px-2 disabled:opacity-60 disabled:cursor-wait"
      aria-label="Download this audit as PDF"
    >
      {status === "idle" && (
        <>
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          PDF
        </>
      )}
      {status === "generating" && (
        <>
          <svg
            className="w-3.5 h-3.5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth={3}
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          Generating...
        </>
      )}
      {status === "done" && (
        <>
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Done
        </>
      )}
      {status === "failed" && (
        <>
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Failed
        </>
      )}
    </button>
  );
}
