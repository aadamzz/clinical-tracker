"use client";

import { useCallback, useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import { Trial, STATUS_LABELS, PHASE_LABELS } from "@/lib/types/trials";
import { Button } from "@/components/ui/Button";

interface ExportPdfButtonProps {
  trial: Trial;
}

export function ExportPdfButton({ trial }: ExportPdfButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleExport = useCallback(async () => {
    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      const margin = 20;
      let y = margin;
      const pageWidth = doc.internal.pageSize.getWidth();
      const contentWidth = pageWidth - margin * 2;

      // Helper to add text with wrapping
      const addWrappedText = (
        text: string,
        x: number,
        yPos: number,
        maxWidth: number,
        fontSize: number,
        fontStyle: "normal" | "bold" = "normal"
      ): number => {
        doc.setFontSize(fontSize);
        doc.setFont("helvetica", fontStyle);
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, yPos);
        return yPos + lines.length * (fontSize * 0.5) + 2;
      };

      const checkPageBreak = (neededSpace: number) => {
        if (y + neededSpace > doc.internal.pageSize.getHeight() - margin) {
          doc.addPage();
          y = margin;
        }
      };

      // Title
      doc.setTextColor(14, 165, 233); // sky-600
      y = addWrappedText(
        "Clinical Trial Tracker — Study Report",
        margin,
        y,
        contentWidth,
        10,
        "bold"
      );

      // Separator
      doc.setDrawColor(226, 232, 240);
      doc.line(margin, y, pageWidth - margin, y);
      y += 6;

      // Trial title
      doc.setTextColor(15, 23, 42);
      y = addWrappedText(trial.briefTitle, margin, y, contentWidth, 14, "bold");
      y += 2;

      // NCT ID
      doc.setTextColor(148, 163, 184);
      y = addWrappedText(trial.nctId, margin, y, contentWidth, 9);
      y += 4;

      // Key info table
      doc.setTextColor(15, 23, 42);
      const addField = (label: string, value: string) => {
        checkPageBreak(12);
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(100, 116, 139);
        doc.text(label + ":", margin, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(15, 23, 42);
        const valueLines = doc.splitTextToSize(value, contentWidth - 45);
        doc.text(valueLines, margin + 45, y);
        y += valueLines.length * 4.5 + 2;
      };

      addField("Status", STATUS_LABELS[trial.status] ?? trial.status);
      addField(
        "Phase",
        trial.phases.map((p) => PHASE_LABELS[p] ?? p).join(", ") || "N/A"
      );
      addField("Sponsor", trial.sponsor);
      addField("Study Type", trial.studyType ?? "N/A");
      addField(
        "Enrollment",
        trial.enrollmentCount != null
          ? `${trial.enrollmentCount.toLocaleString()} participants (${trial.enrollmentType ?? "N/A"})`
          : "N/A"
      );
      addField("Start Date", trial.startDate ?? "N/A");
      addField(
        "Completion",
        trial.primaryCompletionDate ?? trial.completionDate ?? "N/A"
      );
      addField("Conditions", trial.conditions.join(", ") || "N/A");
      addField(
        "Interventions",
        trial.interventions
          .map((i) => `${i.name} (${i.type})`)
          .join(", ") || "N/A"
      );

      y += 4;

      // Brief summary
      if (trial.briefSummary) {
        checkPageBreak(30);
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, y, pageWidth - margin, y);
        y += 6;
        y = addWrappedText(
          "Study Description",
          margin,
          y,
          contentWidth,
          11,
          "bold"
        );
        y += 2;
        doc.setTextColor(71, 85, 105);
        y = addWrappedText(trial.briefSummary, margin, y, contentWidth, 9);
        y += 4;
      }

      // Eligibility
      if (trial.eligibilityCriteria) {
        checkPageBreak(30);
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, y, pageWidth - margin, y);
        y += 6;
        doc.setTextColor(15, 23, 42);
        y = addWrappedText(
          "Eligibility Criteria",
          margin,
          y,
          contentWidth,
          11,
          "bold"
        );
        y += 2;

        const ageInfo = [];
        if (trial.minimumAge) ageInfo.push(`Min age: ${trial.minimumAge}`);
        if (trial.maximumAge) ageInfo.push(`Max age: ${trial.maximumAge}`);
        if (trial.sex && trial.sex !== "ALL")
          ageInfo.push(`Sex: ${trial.sex}`);
        if (ageInfo.length > 0) {
          doc.setTextColor(100, 116, 139);
          y = addWrappedText(ageInfo.join(" | "), margin, y, contentWidth, 8);
          y += 2;
        }

        doc.setTextColor(71, 85, 105);
        const criteria = trial.eligibilityCriteria.substring(0, 2000);
        y = addWrappedText(criteria, margin, y, contentWidth, 8);
        y += 4;
      }

      // Locations
      if (trial.locations.length > 0) {
        checkPageBreak(20);
        doc.setDrawColor(226, 232, 240);
        doc.line(margin, y, pageWidth - margin, y);
        y += 6;
        doc.setTextColor(15, 23, 42);
        y = addWrappedText(
          `Study Locations (${trial.locations.length})`,
          margin,
          y,
          contentWidth,
          11,
          "bold"
        );
        y += 2;
        doc.setTextColor(71, 85, 105);
        trial.locations.slice(0, 15).forEach((loc) => {
          checkPageBreak(8);
          const parts = [loc.facility, loc.city, loc.state, loc.country]
            .filter(Boolean)
            .join(", ");
          y = addWrappedText(`• ${parts}`, margin + 3, y, contentWidth - 6, 8);
        });
        if (trial.locations.length > 15) {
          y = addWrappedText(
            `… and ${trial.locations.length - 15} more locations`,
            margin + 3,
            y,
            contentWidth,
            8
          );
        }
      }

      // Footer
      const pageCount = doc.internal.pages.length - 1;
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(7);
        doc.setTextColor(148, 163, 184);
        doc.text(
          `Generated by Clinical Trial Tracker | ClinicalTrials.gov ${trial.nctId} | Page ${i}/${pageCount}`,
          margin,
          doc.internal.pageSize.getHeight() - 10
        );
      }

      doc.save(`${trial.nctId}-report.pdf`);
    } catch (err) {
      console.error("PDF export error:", err);
    } finally {
      setIsGenerating(false);
    }
  }, [trial]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Generating…
        </>
      ) : (
        <>
          <FileDown className="h-4 w-4" />
          Export PDF
        </>
      )}
    </Button>
  );
}
