"use client";

import Link from "next/link";
import { ChangeEvent, useRef, useState } from "react";
import AppShell from "@/components/AppShell";
import AIEvidenceFindings from "@/components/evidence/AIEvidenceFindings";
import DealWorkspaceHeader from "@/components/deal/DealWorkspaceHeader";

const evidenceItems = [
  {
    id: "purchase-order",
    title: "Purchase Order",
    meta1: "PO-77821",
    meta2: "Oct 1, 2026",
    file: "/evidence/deal-1048/purchase-order.pdf",
    type: "pdf",
  },
  {
    id: "delivery-note",
    title: "Delivery Note",
    meta1: "DN-11000",
    meta2: "Oct 15, 2026",
    file: "/evidence/deal-1048/delivery-note.pdf",
    type: "pdf",
  },
  {
    id: "inspection-report",
    title: "Inspection Report",
    meta1: "IR-99211",
    meta2: "Oct 16, 2026",
    file: "/evidence/deal-1048/inspection-report.pdf",
    type: "pdf",
  },
  {
    id: "warehouse-photo",
    title: "Warehouse Photo",
    meta1: "1 image",
    meta2: "Oct 16, 2026",
    file: "/evidence/deal-1048/warehouse-photo.png",
    type: "image",
  },
  {
    id: "email-thread",
    title: "Email Thread",
    meta1: "12 messages",
    meta2: "Oct 10 – 16, 2026",
    file: "/evidence/deal-1048/email-thread.pdf",
    type: "pdf",
  },
];

function FileIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 3.5h7l4 4V20H7z" />
      <path d="M14 3.5V8h4" />
      <path d="M10 12h5" />
      <path d="M10 15.5h5" />
    </svg>
  );
}

function Tab({
  label,
  active,
  href,
}: {
  label: string;
  active?: boolean;
  href?: string;
}) {
  const classes = [
    "relative flex h-[40px] items-center px-4 text-[12px] font-medium transition",
    active
      ? "text-[#4D35F3]"
      : "text-[#716B7C] hover:text-[#2A243B]",
  ].join(" ");

  const content = (
    <>
      {label}
      {active && (
        <span className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-[#FF67B6]" />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}

export default function DealDetailPage() {
    const [selectedEvidenceId, setSelectedEvidenceId] =
    useState("purchase-order");

    const fileInputRef = useRef<HTMLInputElement>(null);

const [uploadedEvidence, setUploadedEvidence] = useState<
  {
    id: string;
    title: string;
    meta1: string;
    meta2: string;
    file: string;
    type: "pdf" | "image";
  }[]
>([]);

const allEvidenceItems = [
  ...evidenceItems,
  ...uploadedEvidence,
];

    const selectedEvidence =
  allEvidenceItems.find(
    (item) => item.id === selectedEvidenceId
  ) ?? allEvidenceItems[0];

function handleEvidenceUpload(
  event: ChangeEvent<HTMLInputElement>
) {
  const files = Array.from(event.target.files ?? []);

  if (files.length === 0) {
    return;
  }

  const newItems = files.map((file, index) => {
    const isImage = file.type.startsWith("image/");
    const objectUrl = URL.createObjectURL(file);

    return {
      id: `uploaded-${Date.now()}-${index}`,
      title: file.name.replace(/\.[^/.]+$/, ""),
      meta1: isImage ? "Uploaded image" : "Uploaded document",
      meta2: "Just now",
      file: objectUrl,
      type: isImage ? ("image" as const) : ("pdf" as const),
    };
  });

  setUploadedEvidence((current) => [
    ...current,
    ...newItems,
  ]);

  setSelectedEvidenceId(newItems[0].id);

  event.target.value = "";
}

  return (
    <AppShell>
      <div className="px-5 py-3 sm:px-7 lg:px-8">

      <DealWorkspaceHeader activeTab="evidence" />

        {/* Main evidence workspace */}
        <div className="grid h-[calc(100vh-270px)] min-h-[500px] grid-cols-1 gap-4 pt-3 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
          {/* LEFT: Evidence list */}
          <aside className="rounded-[12px] border border-[#E9E5EE] bg-white p-4">
            <div className="flex items-center justify-between px-1 pb-3">
              <>
  <input
    ref={fileInputRef}
    type="file"
    accept=".pdf,image/*"
    multiple
    onChange={handleEvidenceUpload}
    className="hidden"
  />

  <button
    type="button"
    onClick={() => fileInputRef.current?.click()}
    className="rounded-[7px] bg-[#33218C] px-3 py-2 text-[13px] font-semibold text-white transition hover:bg-[#291B74]"
  >
    + Upload
  </button>
</>
            </div>

            <div className="space-y-1.5">
              {allEvidenceItems.map((item) => (
  <button
    key={item.id}
    onClick={() => setSelectedEvidenceId(item.id)}
    className={[
                    "flex w-full items-start gap-4 rounded-[9px] p-4 text-left transition",
                    selectedEvidenceId === item.id
                      ? "bg-[#F1EDFF] text-[#4C35E9]"
                      : "text-[#686172] hover:bg-[#FAF9FC]",
                  ].join(" ")}
                >
                  <span
                    className={
                      selectedEvidenceId === item.id
                        ? "mt-0.5 text-[#4D35F3]"
                        : "mt-0.5 text-[#8A8494]"
                    }
                  >
                    <FileIcon />
                  </span>

                  <span>
                    <span
                      className={[
                        "block text-[13px] font-semibold",
                        selectedEvidenceId === item.id
                          ? "text-[#4935D8]"
                          : "text-[#40394E]",
                      ].join(" ")}
                    >
                      {item.title}
                    </span>

                    <span className="mt-1 block text-[11px] text-[#8F8898]">
                      {item.meta1}
                    </span>

                    <span className="mt-0.5 block text-[11px] text-[#A09AAA]">
                      {item.meta2}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </aside>

          {/* CENTER: Document viewer */}
<section className="min-w-0 rounded-[12px] border border-[#E9E5EE] bg-white">
  {/* Viewer toolbar */}
  <div className="flex h-[50px] items-center justify-between border-b border-[#ECE8F1] px-4">
    <div className="flex items-center gap-4 text-[10px] text-[#777182]">
      <button className="text-[#6A6375]">‹</button>

      <span className="font-medium text-[#4B4557]">
        1 / 1
      </span>

      <button className="text-[#6A6375]">›</button>

      <span className="h-4 w-px bg-[#E6E1EA]" />

      <span>100%</span>
    </div>

    <div className="flex items-center gap-2">
      <a
        href={selectedEvidence.file}
        target="_blank"
        rel="noreferrer"
        className="flex h-8 w-8 items-center justify-center rounded-[7px] text-[12px] text-[#777181] transition hover:bg-[#F7F5F9]"
      >
        ↗
      </a>

      <a
        href={selectedEvidence.file}
        download
        className="flex h-8 w-8 items-center justify-center rounded-[7px] text-[12px] text-[#777181] transition hover:bg-[#F7F5F9]"
      >
        ⇩
      </a>
    </div>
  </div>

  {/* Real evidence viewer */}
  <div className="flex h-[calc(100%-50px)] items-center justify-center overflow-hidden bg-[#F5F4F8] p-4">
    {selectedEvidence.type === "image" ? (
      <img
        src={selectedEvidence.file}
        alt={selectedEvidence.title}
        className="max-h-full max-w-full rounded-[8px] object-contain shadow-[0_4px_18px_rgba(34,27,53,0.10)]"
      />
    ) : (
      <iframe
        key={selectedEvidence.file}
        src={selectedEvidence.file}
        title={selectedEvidence.title}
        className="h-full w-full rounded-[8px] border-0 bg-white"
      />
    )}
  </div>
</section>

          {/* RIGHT: AI findings */}
<AIEvidenceFindings />
        </div>
      </div>
    </AppShell>
  );
}