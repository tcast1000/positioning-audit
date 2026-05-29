"use client";

import { useState, useCallback } from "react";

type Status = "idle" | "generating" | "done" | "failed";

export default function DownloadButton({
  companyName,
}: {
  companyName: string;
}) {
  const [status, setStatus] = useState<Status>("idle");

  const generate = useCallback(async () => {
    if (status === "generating") return;
    setStatus("generating");

    try {
      const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      const article = document.querySelector("article");
      if (!article) throw new Error("No article element found");

      // Temporarily hide elements that shouldn't appear in the PDF
      const hiddenEls = document.querySelectorAll(
        "nav, footer, button, .no-print"
      );
      hiddenEls.forEach((el) => el.classList.add("pdf-hide"));
      const style = document.createElement("style");
      style.textContent = ".pdf-hide { display: none !important; }";
      document.head.appendChild(style);

      // Small delay to let the DOM reflow after hiding elements
      await new Promise((r) => setTimeout(r, 100));

      const canvas = await html2canvas(article as HTMLElement, {
        scale: 2,
        backgroundColor: "#F5F5F3",
        useCORS: true,
        logging: false,
      });

      // Restore hidden elements immediately after capture
      style.remove();
      hiddenEls.forEach((el) => el.classList.remove("pdf-hide"));

      // A4 dimensions in mm
      const pageWidth = 210;
      const pageHeight = 297;
      const margin = 16; // mm on each side
      const headerHeight = 8; // mm reserved for page header text
      const footerHeight = 8; // mm reserved for page number

      const contentWidth = pageWidth - margin * 2;
      const contentTop = margin + headerHeight;
      const contentHeight = pageHeight - contentTop - margin - footerHeight;

      // Scale canvas to fit the available content width
      const scaleFactor = contentWidth / canvas.width;
      const scaledFullHeight = canvas.height * scaleFactor;

      // How many pages we need
      const totalPages = Math.ceil(scaledFullHeight / contentHeight);

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      for (let page = 0; page < totalPages; page++) {
        if (page > 0) pdf.addPage();

        // Header text
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7);
        pdf.setTextColor(148, 145, 139); // muted color
        pdf.text(
          `Positioning audit — ${companyName}`,
          margin,
          margin + 4
        );

        // Determine the slice of the canvas for this page
        const sourceY = (page * contentHeight) / scaleFactor;
        const sourceHeight = Math.min(
          contentHeight / scaleFactor,
          canvas.height - sourceY
        );
        const destHeight = sourceHeight * scaleFactor;

        // Create a per-page canvas slice
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

        const pageImgData = pageCanvas.toDataURL("image/png");

        pdf.addImage(
          pageImgData,
          "PNG",
          margin,
          contentTop,
          contentWidth,
          destHeight
        );

        // Page number footer
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7);
        pdf.setTextColor(148, 145, 139);
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
      console.error("PDF generation failed:", err);
      setStatus("failed");
      setTimeout(() => setStatus("idle"), 2000);
    }
  }, [companyName, status]);

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
