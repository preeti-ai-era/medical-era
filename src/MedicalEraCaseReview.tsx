import { useState, useEffect, useRef } from "react"; // useEffect + useRef used in DocPreviewModal
import type { UploadedFile, Answers } from "./MedicalEraAIFollowUp";

function CrossIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
      <rect x="9" y="2" width="6" height="20" rx="2" fill="currentColor" />
      <rect x="2" y="9" width="20" height="6" rx="2" fill="currentColor" />
    </svg>
  );
}

const CASE = {
  name: "Priya Sharma",
  age: 34,
  gender: "Female",
  phone: "+91 98200 12345",
  submittedAt: "Today, 9:14 AM",
  status: "New",
  whoFor: "Myself",
  complaint:
    "Persistent headache and mild fever for two days. No known allergies. Currently on no medicines.",
  medicines: "None",
  allergies: "None known",
  documents: [],
};

type DraftFields = {
  chiefComplaint: string;
  duration: string;
  relevantHistory: string;
  medicines: string;
  allergies: string;
  summary: string;
};

function buildDraft(complaint: string, answers: Answers, uploads: UploadedFile[]): DraftFields {
  const a = (key: string) => answers[key];
  const str = (v: string | string[] | undefined) =>
    Array.isArray(v) ? v.join(", ") : (v ?? "");

  // Chief Complaint
  const chiefComplaint = complaint
    ? `Patient reported: "${complaint}"`
    : "Not provided by patient.";

  // Duration / Timeline
  const onset = str(a("onset"));
  const trend = str(a("trend"));
  const severity = str(a("severity"));
  let duration = "Not provided by patient.";
  if (onset || trend || severity) {
    const parts: string[] = [];
    if (onset) parts.push(`Onset: Patient reported "${onset}"`);
    if (trend) parts.push(`Trend: "${trend}"`);
    if (severity) parts.push(`Severity: "${severity}"`);
    duration = parts.join(" · ");
  }

  // Relevant History — other symptoms reported
  const otherSymptoms = str(a("other_symptoms"));
  const otherSymptomsClean = otherSymptoms === "None of these" ? "" : otherSymptoms;
  const relevantHistory = otherSymptomsClean
    ? `Patient also reported: ${otherSymptomsClean}`
    : "No additional symptoms reported by patient.";

  // Current Medicines
  const medAnswer = str(a("medicines"));
  const prescriptionUploads = uploads.filter((u) => u.category.toLowerCase().includes("prescription"));
  let medicines = "Not provided by patient.";
  if (medAnswer === "No") {
    medicines = "Patient reported: not currently taking any medicines for this problem.";
  } else if (medAnswer === "Yes") {
    medicines = "Patient reported taking medicines for this problem. Details not specified.";
    if (prescriptionUploads.length > 0)
      medicines += ` See uploaded prescription: ${prescriptionUploads.map((u) => u.file.name).join(", ")}`;
  } else if (medAnswer) {
    medicines = `Patient reported: "${medAnswer}"`;
  } else if (prescriptionUploads.length > 0) {
    medicines = `From uploaded prescription: ${prescriptionUploads.map((u) => u.file.name).join(", ")}`;
  }

  // Known Allergies — try to extract from complaint text first
  const allergyMatch = complaint.match(/no known allerg\w*/i);
  const allergyDenial = complaint.match(/no\s+(known\s+)?allerg\w*/i);
  let allergies: string;
  if (allergyDenial) {
    allergies = `Patient reported: no known allergies. (From patient description — doctor to verify.)`;
  } else if (allergyMatch) {
    allergies = `Patient reported: ${allergyMatch[0]}. Doctor to verify.`;
  } else {
    allergies = "Not provided by patient.";
  }

  // AI Case Summary
  const reportUploads = uploads.filter((u) =>
    u.category.toLowerCase().includes("report") || u.category.toLowerCase().includes("opd") || u.category.toLowerCase().includes("photo")
  );
  const uploadSummary = uploads.length > 0
    ? ` Patient uploaded ${uploads.length} document${uploads.length > 1 ? "s" : ""} (${uploads.map((u) => u.category).join(", ")}).`
    : " No documents were uploaded.";
  const reportNote = reportUploads.length > 0
    ? ` Uploaded documents include: ${reportUploads.map((u) => u.file.name).join(", ")} — doctor to review independently.`
    : "";

  const summary = complaint
    ? `AI-organized from patient-provided information and uploaded documents. ${complaint.length > 120 ? complaint.slice(0, 120) + "…" : complaint}${uploadSummary}${reportNote} Doctor to verify, examine, and document clinical findings independently. No diagnosis or clinical recommendation has been made.`
    : `No patient information has been submitted yet. Doctor to collect history directly.${uploadSummary}`;

  return { chiefComplaint, duration, relevantHistory, medicines, allergies, summary };
}

type FindingPriority = "red" | "orange" | "green";
type FindingAction = "confirm" | "modify" | "dismiss" | null;

interface FindingEvidence {
  quote: string;
  source: "Patient intake" | "AI follow-up response" | "Uploaded prescription" | "Uploaded medical/diagnostic report" | "Uploaded photo";
}

interface Finding {
  id: string;
  priority: FindingPriority;
  title: string;
  detected: string;
  basedOn: FindingEvidence[];
  whyFlagged: string;
  medicalRef: string;
}

const AI_FINDINGS: Finding[] = [
  {
    id: "f1",
    priority: "red",
    title: "Fever with headache — duration warrants clinical assessment",
    detected: "Co-occurrence of headache and fever persisting for 2–3 days with no improvement trend and no medicines taken.",
    basedOn: [
      { quote: "\"I have had a persistent headache and mild fever for the past two to three days.\"", source: "Patient intake" },
      { quote: "Onset: \"2–3 days ago\"", source: "AI follow-up response" },
      { quote: "Trend: \"About the same\" (no improvement reported)", source: "AI follow-up response" },
      { quote: "Severity: \"Moderate — affecting my routine\"", source: "AI follow-up response" },
      { quote: "Medicines: \"No\" (no medicines taken for this problem)", source: "AI follow-up response" },
    ],
    whyFlagged: "A multi-day history of concurrent headache and fever in an otherwise untreated patient was noted by the AI. The combination, duration, and absence of any self-treatment were flagged for doctor review. All clinical decisions are made by the doctor.",
    medicalRef: "Reference not connected in prototype.",
  },
  {
    id: "f2",
    priority: "orange",
    title: "No current medicines or prior history reported — completeness unclear",
    detected: "Patient reported no current medicines and provided no prior medical history. The intake did not collect conditions, past diagnoses, or intermittent medications.",
    basedOn: [
      { quote: "\"I am not currently taking any medicines.\"", source: "Patient intake" },
      { quote: "Medicines for this problem: \"No\"", source: "AI follow-up response" },
      { quote: "Additional symptoms: \"None of these\"", source: "AI follow-up response" },
      { quote: "No documents uploaded (no prescription, no reports)", source: "Patient intake" },
    ],
    whyFlagged: "The absence of any medication or prior history may be accurate, or may indicate an incomplete submission. The AI flagged this so the doctor can verbally verify whether the patient has any ongoing conditions, periodic medications, or relevant history not captured in the intake.",
    medicalRef: "Reference not connected in prototype.",
  },
  {
    id: "f3",
    priority: "green",
    title: "No allergy risk identified from submitted information",
    detected: "Patient explicitly reported no known allergies in the intake description.",
    basedOn: [
      { quote: "\"I have no known allergies.\"", source: "Patient intake" },
    ],
    whyFlagged: "No allergy-related risk was identified from the submitted information. \"No priority issue identified\" means only that no priority issue was detected from the available submitted information — it does not confirm that the patient has no allergies. Doctor to verify verbally at consultation.",
    medicalRef: "Reference not connected in prototype.",
  },
];

const PRIORITY_CONFIG: Record<FindingPriority, { dot: string; bg: string; border: string; statusLabel: string; statusBg: string; statusColor: string; statusBorder: string }> = {
  red: {
    dot: "#dc2626",
    bg: "#fff5f5",
    border: "#fecaca",
    statusLabel: "Priority — needs doctor review",
    statusBg: "#fee2e2",
    statusColor: "#991b1b",
    statusBorder: "#fca5a5",
  },
  orange: {
    dot: "#ea580c",
    bg: "#fff8f3",
    border: "#fed7aa",
    statusLabel: "Needs clarification",
    statusBg: "#fff0e6",
    statusColor: "#9a3412",
    statusBorder: "#fdba74",
  },
  green: {
    dot: "#16a34a",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    statusLabel: "No priority issue identified from available information",
    statusBg: "#dcfce7",
    statusColor: "#14532d",
    statusBorder: "#86efac",
  },
};

const SOURCE_COLORS: Record<FindingEvidence["source"], { bg: string; color: string; border: string }> = {
  "Patient intake":                    { bg: "#e8f3fb", color: "#1a5f8c", border: "#90c8e8" },
  "AI follow-up response":             { bg: "#f0f0fe", color: "#3730a3", border: "#c7d2fe" },
  "Uploaded prescription":             { bg: "#fef9ec", color: "#92400e", border: "#fde68a" },
  "Uploaded medical/diagnostic report":{ bg: "#f3fdf3", color: "#14532d", border: "#bbf7d0" },
  "Uploaded photo":                    { bg: "#fdf4ff", color: "#6b21a8", border: "#e9d5ff" },
};

function SourceChip({ source }: { source: FindingEvidence["source"] }) {
  const c = SOURCE_COLORS[source];
  return (
    <span
      className="me-body inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-md"
      style={{ backgroundColor: c.bg, color: c.color, border: `1px solid ${c.border}` }}
    >
      {source}
    </span>
  );
}

function FindingCard({ finding }: { finding: Finding }) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<FindingAction>(null);
  const [note, setNote] = useState("");
  const [showNote, setShowNote] = useState(false);
  const cfg = PRIORITY_CONFIG[finding.priority];

  // Deduplicated sources list for the Source section
  const uniqueSources = Array.from(new Set(finding.basedOn.map((e) => e.source)));

  return (
    <div
      className="rounded-xl overflow-hidden transition-all"
      style={{ border: `1.5px solid ${open ? cfg.dot : cfg.border}`, backgroundColor: open ? "white" : cfg.bg }}
    >
      {/* Header row — always visible */}
      <button
        className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        <span className="shrink-0 w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cfg.dot }} />
        <span className="me-body text-sm font-medium flex-1 leading-snug" style={{ color: "#0c2340" }}>
          {finding.title}
        </span>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className="w-4 h-4 shrink-0 transition-transform"
          style={{ color: "#94a3b8", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden="true"
        >
          <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Expanded content */}
      {open && (
        <div className="px-4 pb-4 flex flex-col gap-4">
          <div className="h-px" style={{ backgroundColor: cfg.border }} />

          {/* 1. Finding status */}
          <div>
            <p className="me-label mb-2">Finding status</p>
            <span
              className="me-body inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ backgroundColor: cfg.statusBg, color: cfg.statusColor, border: `1.5px solid ${cfg.statusBorder}` }}
            >
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: cfg.dot }} />
              {cfg.statusLabel}
            </span>
          </div>

          {/* 2. What AI detected */}
          <div>
            <p className="me-label mb-1.5">What AI detected</p>
            <p className="me-body text-sm leading-relaxed" style={{ color: "#1e3a52" }}>{finding.detected}</p>
          </div>

          {/* 3. Based on — exact patient-provided info */}
          <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${cfg.border}` }}>
            <div className="px-3.5 py-2.5" style={{ backgroundColor: cfg.bg }}>
              <p className="me-label">Based on</p>
            </div>
            <div className="flex flex-col divide-y" style={{ borderTop: `1px solid ${cfg.border}`, backgroundColor: "white" }}>
              {finding.basedOn.map((evidence, i) => (
                <div key={i} className="px-3.5 py-3 flex flex-col gap-1.5">
                  <p className="me-body text-sm leading-relaxed" style={{ color: "#1e3a52", fontStyle: evidence.quote.startsWith('"') ? "normal" : "normal" }}>
                    {evidence.quote}
                  </p>
                  <SourceChip source={evidence.source} />
                </div>
              ))}
            </div>
          </div>

          {/* 4. Source */}
          <div>
            <p className="me-label mb-2">Source</p>
            <div className="flex flex-wrap gap-1.5">
              {uniqueSources.map((s) => <SourceChip key={s} source={s} />)}
            </div>
          </div>

          {/* 5. Why AI flagged it */}
          <div>
            <p className="me-label mb-1.5">Why AI flagged it</p>
            <p className="me-body text-sm leading-relaxed" style={{ color: "#1e3a52" }}>{finding.whyFlagged}</p>
          </div>

          {/* 6. Supporting medical information / reference */}
          <div className="rounded-xl p-3.5" style={{ backgroundColor: "#f8fafc", border: "1px solid #e2eaf3" }}>
            <p className="me-label mb-1.5">Supporting medical information / reference</p>
            <p className="me-body text-sm leading-relaxed italic" style={{ color: "#94a3b8" }}>{finding.medicalRef}</p>
          </div>

          {/* Safety notice */}
          <div className="rounded-lg px-3 py-2.5 flex items-start gap-2" style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a" }}>
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#b45309" }} aria-hidden="true">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
              <path d="M8 5v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
              <circle cx="8" cy="10.5" r="0.6" fill="currentColor" />
            </svg>
            <p className="me-body text-xs leading-relaxed" style={{ color: "#92400e" }}>
              AI does not diagnose, prescribe, or recommend treatment. The doctor is responsible for all clinical interpretation and decisions.
            </p>
          </div>

          {/* 7. Doctor actions */}
          <div>
            <p className="me-label mb-2.5">Doctor action</p>
            <div className="flex flex-wrap gap-2">
              {(["confirm", "modify", "dismiss"] as FindingAction[]).map((a) => {
                const isActive = action === a;
                const colors: Record<string, { bg: string; color: string; border: string }> = {
                  confirm: { bg: isActive ? "#dcfce7" : "#f0fdf4", color: isActive ? "#14532d" : "#16a34a", border: isActive ? "#86efac" : "#bbf7d0" },
                  modify:  { bg: isActive ? "#e8f3fb" : "#f8fafc", color: isActive ? "#1a6fa8" : "#7a9ab5", border: isActive ? "#90c8e8" : "#e2eaf3" },
                  dismiss: { bg: isActive ? "#fee2e2" : "#fff5f5", color: isActive ? "#991b1b" : "#dc2626", border: isActive ? "#fca5a5" : "#fecaca" },
                };
                const c = colors[a!];
                return (
                  <button
                    key={a}
                    className="me-body text-xs font-semibold px-4 py-2 rounded-lg transition-all capitalize"
                    style={{ backgroundColor: c.bg, color: c.color, border: `1.5px solid ${c.border}` }}
                    onClick={() => setAction(isActive ? null : a)}
                  >
                    {a}
                  </button>
                );
              })}
              <button
                className="me-body text-xs font-medium px-4 py-2 rounded-lg transition-all"
                style={{ backgroundColor: showNote ? "#f8fafc" : "transparent", color: "#64748b", border: "1.5px solid #e2eaf3" }}
                onClick={() => setShowNote((s) => !s)}
              >
                {showNote ? "Hide note" : "Add note"}
              </button>
            </div>
            {showNote && (
              <textarea
                className="mt-3 w-full rounded-xl p-3 text-sm resize-none outline-none me-body"
                rows={2}
                placeholder="Add a clinical note about this finding…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                style={{ backgroundColor: "#f8fafc", border: "1.5px solid #e2eaf3", color: "#0c2340" }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#1a6fa8")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "#e2eaf3")}
              />
            )}
            {action && (
              <p className="me-body text-xs mt-2 font-medium" style={{ color: "#64748b" }}>
                Marked as <span className="capitalize font-semibold" style={{ color: action === "confirm" ? "#16a34a" : action === "modify" ? "#1a6fa8" : "#dc2626" }}>{action}ed</span> — recorded locally. Doctor to document in patient record independently.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type CommMode = "video" | "voice" | "chat";

const COMM_OPTIONS: { id: CommMode; label: string; icon: React.ReactNode }[] = [
  {
    id: "video",
    label: "Video",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" aria-hidden="true">
        <rect x="1" y="5" width="12" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M13 8l5-2.5v7L13 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "voice",
    label: "Voice",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" aria-hidden="true">
        <path d="M6 2a2 2 0 00-2 2v.5c0 5.5 4 10 9.5 10H14a2 2 0 002-2v-1.5a.5.5 0 00-.5-.5h-3a.5.5 0 00-.5.5v.5a6.5 6.5 0 01-6.5-6.5h.5A.5.5 0 007 5V2.5A.5.5 0 006.5 2H6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    id: "chat",
    label: "Chat",
    icon: (
      <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" aria-hidden="true">
        <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6l-4 3V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function ContactPatientPanel({ patientName }: { patientName: string }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<CommMode | null>(null);
  const [starting, setStarting] = useState(false);

  function handleSelect(mode: CommMode) {
    setSelected(mode);
  }

  function handleStart() {
    if (!selected) return;
    setStarting(true);
  }

  function handleReset() {
    setSelected(null);
    setStarting(false);
  }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ backgroundColor: "white", border: "1.5px solid #e2eaf3", boxShadow: "0 2px 8px rgba(10,40,80,0.06)" }}
    >
      {/* Header row */}
      <button
        className="w-full flex items-center justify-between px-6 py-4 text-left"
        onClick={() => { setOpen((o) => !o); if (starting) handleReset(); }}
        aria-expanded={open}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "#f0f7ff", color: "#1a6fa8" }}>
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden="true">
              <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H6l-4 3V4z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="me-heading text-sm font-bold" style={{ color: "#0c2340" }}>Contact Patient</span>
        </div>
        <svg
          viewBox="0 0 20 20"
          fill="none"
          className="w-4 h-4 transition-transform"
          style={{ color: "#94a3b8", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          aria-hidden="true"
        >
          <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="px-6 pb-6">
          <div className="h-px mb-5" style={{ backgroundColor: "#f0f4f8" }} />

          {starting ? (
            /* Confirmation state */
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: "#e8f3fb" }}>
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" style={{ color: "#1a6fa8" }} aria-hidden="true">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" />
                  <path d="M8 12l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="me-heading text-sm font-bold mb-1" style={{ color: "#0c2340" }}>
                  Starting secure patient communication…
                </p>
                <p className="me-body text-xs" style={{ color: "#64748b" }}>
                  {selected === "video" ? "Video call" : selected === "voice" ? "Voice call" : "Secure chat"} with {patientName}
                </p>
              </div>
              <button
                className="me-body text-xs font-medium px-4 py-2 rounded-lg transition-all"
                style={{ color: "#94a3b8", border: "1.5px solid #e2eaf3" }}
                onClick={handleReset}
              >
                Cancel
              </button>
            </div>
          ) : (
            /* Option selection */
            <>
              <p className="me-body text-xs mb-4" style={{ color: "#64748b" }}>
                Select how you would like to reach {patientName}. Doctor decides whether communication is needed.
              </p>
              <div className="flex gap-3 mb-4">
                {COMM_OPTIONS.map((opt) => {
                  const isActive = selected === opt.id;
                  return (
                    <button
                      key={opt.id}
                      className="flex-1 flex flex-col items-center gap-2 py-4 rounded-xl transition-all"
                      style={{
                        backgroundColor: isActive ? "#e8f3fb" : "#f8fafc",
                        border: `1.5px solid ${isActive ? "#1a6fa8" : "#e2eaf3"}`,
                        color: isActive ? "#1a6fa8" : "#64748b",
                      }}
                      onClick={() => handleSelect(opt.id)}
                    >
                      {opt.icon}
                      <span className="me-body text-xs font-semibold">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
              <button
                className="w-full py-3 rounded-xl me-body text-sm font-semibold transition-all"
                style={{
                  backgroundColor: selected ? "#1a6fa8" : "#e2eaf3",
                  color: selected ? "white" : "#94a3b8",
                  cursor: selected ? "pointer" : "default",
                  boxShadow: selected ? "0 2px 8px rgba(26,111,168,0.25)" : "none",
                }}
                disabled={!selected}
                onClick={handleStart}
                onMouseEnter={(e) => { if (selected) e.currentTarget.style.backgroundColor = "#155e90"; }}
                onMouseLeave={(e) => { if (selected) e.currentTarget.style.backgroundColor = "#1a6fa8"; }}
              >
                {selected ? `Start ${selected} with ${patientName}` : "Choose a communication option above"}
              </button>
            </>
          )}

          <p
            className="me-body text-xs text-center mt-4"
            style={{ color: "#b0bec5" }}
          >
            Patient communication is managed securely through Medical Era. Doctor decides whether communication is needed.
          </p>
        </div>
      )}
    </div>
  );
}

function fileTypeLabel(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    pdf: "PDF", jpg: "JPEG image", jpeg: "JPEG image", png: "PNG image",
    webp: "WebP image", heic: "HEIC image", gif: "GIF image",
    doc: "Word document", docx: "Word document",
  };
  return (map[ext] ?? ext.toUpperCase()) || "File";
}

function isImage(name: string): boolean {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return ["jpg", "jpeg", "png", "gif", "webp", "heic"].includes(ext);
}

function DocFileIcon({ name }: { name: string }) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "gif", "webp", "heic"].includes(ext))
    return (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 shrink-0" style={{ color: "#1a6fa8" }}>
        <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="7" cy="8" r="1.5" fill="currentColor" opacity="0.5" />
        <path d="M2 13l4-3 3 3 3-4 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (ext === "pdf")
    return (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 shrink-0" style={{ color: "#dc2626" }}>
        <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M6 7h8M6 10h8M6 13h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 shrink-0" style={{ color: "#64748b" }}>
      <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 7h8M6 10h8M6 13h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

function DocPreviewModal({ upload, onClose }: { upload: UploadedFile; onClose: () => void }) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const createdUrl = useRef<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(upload.file);
    createdUrl.current = url;
    setObjectUrl(url);
    return () => { URL.revokeObjectURL(url); };
  }, [upload.file]);

  const img = isImage(upload.file.name);

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(12,35,64,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl overflow-hidden flex flex-col"
        style={{ backgroundColor: "white", boxShadow: "0 8px 40px rgba(10,40,80,0.2)", maxHeight: "85vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #e2eaf3" }}>
          <div className="flex items-center gap-2 min-w-0">
            <DocFileIcon name={upload.file.name} />
            <div className="min-w-0">
              <p className="me-body text-sm font-semibold truncate" style={{ color: "#0c2340" }}>{upload.file.name}</p>
              <p className="me-body text-xs" style={{ color: "#94a3b8" }}>{upload.category}</p>
            </div>
          </div>
          <button
            className="shrink-0 ml-3 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
            style={{ backgroundColor: "#f0f4f8", color: "#64748b" }}
            onClick={onClose}
            aria-label="Close preview"
          >
            <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Preview area */}
        <div className="flex-1 overflow-auto">
          {img && objectUrl ? (
            <img src={objectUrl} alt={upload.file.name} className="w-full h-auto block" />
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 px-6 py-10 text-center">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#f0f4f8" }}>
                <DocFileIcon name={upload.file.name} />
              </div>
              <div>
                <p className="me-body text-sm font-medium mb-1" style={{ color: "#0c2340" }}>{fileTypeLabel(upload.file.name)}</p>
                <p className="me-body text-xs" style={{ color: "#94a3b8" }}>
                  {(upload.file.size / 1024).toFixed(0)} KB · {upload.category}
                </p>
              </div>
              <p className="me-body text-xs" style={{ color: "#b0bec5" }}>
                Preview not available for this file type.<br />File has been received and is ready for doctor review.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3" style={{ borderTop: "1px solid #e2eaf3" }}>
          <p className="me-body text-xs text-center" style={{ color: "#94a3b8" }}>
            Submitted by patient · All medical decisions are made by the doctor
          </p>
        </div>
      </div>
    </div>
  );
}

function EditableField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false);
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <p className="me-label">{label}</p>
        <button
          className="me-body text-xs font-medium transition-colors"
          style={{ color: editing ? "#64748b" : "#1a6fa8" }}
          onClick={() => setEditing((e) => !e)}
        >
          {editing ? "Done" : "Edit"}
        </button>
      </div>
      {editing ? (
        <textarea
          className="w-full rounded-xl p-3 text-sm resize-none outline-none me-body"
          rows={Math.max(2, Math.ceil(value.length / 60))}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ backgroundColor: "#f8fafc", border: "1.5px solid #1a6fa8", color: "#0c2340" }}
          autoFocus
        />
      ) : (
        <p className="me-body text-sm leading-relaxed" style={{ color: "#1e3a52" }}>{value}</p>
      )}
    </div>
  );
}

export default function MedicalEraCaseReview({
  onBack,
  onMarkReviewed,
  patientUploads = [],
  patientAnswers = {},
  patientComplaint = "",
}: {
  onBack: () => void;
  onMarkReviewed?: () => void;
  patientUploads?: UploadedFile[];
  patientAnswers?: Answers;
  patientComplaint?: string;
}) {
  const [draft, setDraft] = useState(() => buildDraft(patientComplaint, patientAnswers, patientUploads));
  const [previewDoc, setPreviewDoc] = useState<UploadedFile | null>(null);

  function setField(key: keyof DraftFields) {
    return (value: string) => setDraft((d) => ({ ...d, [key]: value }));
  }

  return (
    <div
      className="min-h-full flex flex-col"
      style={{ fontFamily: "'Inter','DM Sans',system-ui,sans-serif", backgroundColor: "#eef3f8" }}
    >
      {previewDoc && <DocPreviewModal upload={previewDoc} onClose={() => setPreviewDoc(null)} />}
      <style>{`
        .me-body { font-family: 'Inter', system-ui, sans-serif; }
        .me-heading { font-family: 'DM Sans', system-ui, sans-serif; }
        ::-webkit-scrollbar { display: none; }
        .me-label { font-family: 'Inter', system-ui, sans-serif; font-size: 11px; font-weight: 600; letter-spacing: 0.07em; text-transform: uppercase; color: #94a3b8; }
        .me-value { font-family: 'Inter', system-ui, sans-serif; font-size: 14px; color: #1e3a52; }
      `}</style>

      {/* Header */}
      <header
        className="w-full px-6 py-4 flex items-center justify-between"
        style={{ backgroundColor: "white", borderBottom: "1px solid #e2eaf3" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#1a6fa8", color: "white" }}
          >
            <CrossIcon />
          </div>
          <div>
            <span className="me-heading font-semibold text-base tracking-tight" style={{ color: "#0c2340" }}>
              Medical Era
            </span>
            <span
              className="me-body text-xs ml-2 px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: "#e8f3fb", color: "#1a6fa8" }}
            >
              Doctor view
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="me-heading text-sm font-semibold" style={{ color: "#0c2340" }}>Dr. Anand Mehta</p>
            <p className="me-body text-xs" style={{ color: "#94a3b8" }}>General Physician</p>
          </div>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold"
            style={{ backgroundColor: "#1a6fa8", color: "white" }}
          >
            AM
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 md:px-8 py-8 max-w-3xl mx-auto w-full">

        {/* Back */}
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 me-body text-sm font-medium mb-6 transition-colors"
          style={{ color: "#7a9ab5" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#1a6fa8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#7a9ab5")}
        >
          <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden="true">
            <path d="M12.5 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to cases
        </button>

        {/* Page heading + status */}
        <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
          <div>
            <h1
              className="me-heading text-2xl font-bold"
              style={{ color: "#0c2340", letterSpacing: "-0.02em" }}
            >
              Case Review
            </h1>
            <p className="me-body text-sm mt-0.5" style={{ color: "#64748b" }}>
              Submitted {CASE.submittedAt}
            </p>
          </div>
          <span
            className="me-body text-xs font-semibold px-3 py-1.5 rounded-full"
            style={{ backgroundColor: "#fef9c3", color: "#854d0e" }}
          >
            {CASE.status}
          </span>
        </div>

        <div className="flex flex-col gap-4">

          {/* Patient identity */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: "white", border: "1px solid #e2eaf3", boxShadow: "0 2px 8px rgba(10,40,80,0.06)" }}
          >
            <div className="flex items-center gap-4 mb-5">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-base font-semibold shrink-0"
                style={{ backgroundColor: "#f0f7ff", color: "#1a6fa8" }}
              >
                {CASE.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <p className="me-heading text-lg font-bold" style={{ color: "#0c2340" }}>{CASE.name}</p>
                <p className="me-body text-sm" style={{ color: "#64748b" }}>
                  Age {CASE.age} · {CASE.gender}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="me-label mb-1">Phone</p>
                <p className="me-value">{CASE.phone}</p>
              </div>
              <div>
                <p className="me-label mb-1">Attending for</p>
                <p className="me-value">{CASE.whoFor}</p>
              </div>
            </div>
          </div>

          {/* Main complaint */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: "white", border: "1px solid #e2eaf3", boxShadow: "0 2px 8px rgba(10,40,80,0.06)" }}
          >
            <p className="me-label mb-3">Main complaint</p>
            <p className="me-body text-sm leading-relaxed" style={{ color: "#1e3a52" }}>
              {CASE.complaint}
            </p>
          </div>

          {/* Medicines & allergies */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: "white", border: "1px solid #e2eaf3", boxShadow: "0 2px 8px rgba(10,40,80,0.06)" }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="me-label mb-2">Current medicines</p>
                <p className="me-body text-sm" style={{ color: CASE.medicines === "None" ? "#94a3b8" : "#1e3a52" }}>
                  {CASE.medicines}
                </p>
              </div>
              <div>
                <p className="me-label mb-2">Known allergies</p>
                <p className="me-body text-sm" style={{ color: CASE.allergies === "None known" ? "#94a3b8" : "#dc2626" }}>
                  {CASE.allergies}
                </p>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: "white", border: "1px solid #e2eaf3", boxShadow: "0 2px 8px rgba(10,40,80,0.06)" }}
          >
            <p className="me-label mb-3">Uploaded documents</p>
            {patientUploads.length === 0 ? (
              <p className="me-body text-sm" style={{ color: "#94a3b8" }}>No documents uploaded by patient.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {patientUploads.map((u, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 rounded-xl px-3 py-3"
                    style={{ backgroundColor: "#f8fafc", border: "1px solid #e2eaf3" }}
                  >
                    <DocFileIcon name={u.file.name} />
                    <div className="flex-1 min-w-0">
                      <p className="me-body text-xs font-semibold truncate" style={{ color: "#1e3a52" }}>{u.file.name}</p>
                      <p className="me-body text-xs mt-0.5" style={{ color: "#94a3b8" }}>
                        {u.category} · {fileTypeLabel(u.file.name)} · {(u.file.size / 1024).toFixed(0)} KB
                      </p>
                    </div>
                    <button
                      className="me-body text-xs font-semibold px-3 py-1.5 rounded-lg shrink-0 transition-all"
                      style={{ backgroundColor: "#e8f3fb", color: "#1a6fa8", border: "1px solid #c7ddf0" }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#d0e8f7")}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#e8f3fb")}
                      onClick={() => setPreviewDoc(u)}
                    >
                      View
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI-Generated OPD Draft */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: "white", border: "1.5px solid #c7ddf0", boxShadow: "0 2px 8px rgba(10,40,80,0.06)" }}
          >
            {/* Section header */}
            <div className="flex items-start justify-between gap-3 mb-1">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: "#e8f3fb" }}>
                  <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3" style={{ color: "#1a6fa8" }} aria-hidden="true">
                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M5.5 8h5M8 5.5v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                </div>
                <p className="me-heading text-sm font-bold" style={{ color: "#0c2340" }}>AI-Generated OPD Draft</p>
              </div>
            </div>
            <div
              className="flex items-center gap-1.5 mb-5 px-2.5 py-1.5 rounded-lg w-fit"
              style={{ backgroundColor: "#fef9c3", border: "1px solid #fde68a" }}
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 shrink-0" style={{ color: "#b45309" }} aria-hidden="true">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M8 5v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <circle cx="8" cy="10.5" r="0.6" fill="currentColor" />
              </svg>
              <p className="me-body text-xs font-medium" style={{ color: "#92400e" }}>AI-generated — Doctor must verify</p>
            </div>
            <p className="me-body text-xs mb-5" style={{ color: "#94a3b8" }}>
              AI-organized from patient-provided information and uploaded documents. All fields are editable. Doctor to verify independently.
            </p>

            <div className="flex flex-col gap-5">
              <EditableField label="Chief Complaint" value={draft.chiefComplaint} onChange={setField("chiefComplaint")} />
              <div className="h-px" style={{ backgroundColor: "#f0f4f8" }} />
              <EditableField label="Duration / Timeline" value={draft.duration} onChange={setField("duration")} />
              <div className="h-px" style={{ backgroundColor: "#f0f4f8" }} />
              <EditableField label="Relevant History" value={draft.relevantHistory} onChange={setField("relevantHistory")} />
              <div className="h-px" style={{ backgroundColor: "#f0f4f8" }} />
              <EditableField label="Current Medicines" value={draft.medicines} onChange={setField("medicines")} />
              <div className="h-px" style={{ backgroundColor: "#f0f4f8" }} />
              <EditableField label="Known Allergies" value={draft.allergies} onChange={setField("allergies")} />
              <div className="h-px" style={{ backgroundColor: "#f0f4f8" }} />
              <EditableField label="AI Case Summary" value={draft.summary} onChange={setField("summary")} />
            </div>
          </div>

          {/* AI Priority Findings */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: "white", border: "1.5px solid #c7ddf0", boxShadow: "0 2px 8px rgba(10,40,80,0.06)" }}
          >
            {/* Section header */}
            <div className="flex items-center gap-2 mb-1">
              <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0" style={{ backgroundColor: "#fef9c3" }}>
                <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3" style={{ color: "#b45309" }} aria-hidden="true">
                  <path d="M8 2l1.5 3.5L13 6.5l-2.5 2.5.5 3.5L8 11l-3 1.5.5-3.5L3 6.5l3.5-1L8 2z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="me-heading text-sm font-bold" style={{ color: "#0c2340" }}>AI Priority Findings</p>
            </div>
            <div
              className="flex items-center gap-1.5 mb-5 px-2.5 py-1.5 rounded-lg w-fit"
              style={{ backgroundColor: "#fef9c3", border: "1px solid #fde68a" }}
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 shrink-0" style={{ color: "#b45309" }} aria-hidden="true">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M8 5v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <circle cx="8" cy="10.5" r="0.6" fill="currentColor" />
              </svg>
              <p className="me-body text-xs font-medium" style={{ color: "#92400e" }}>AI-generated — Doctor must verify</p>
            </div>

            <div className="flex flex-col gap-3">
              {AI_FINDINGS.map((f) => (
                <FindingCard key={f.id} finding={f} />
              ))}
            </div>
          </div>

          {/* Contact Patient */}
          <ContactPatientPanel patientName={CASE.name} />

          {/* Doctor action bar */}
          <div
            className="rounded-2xl p-5 flex items-center justify-between gap-4 flex-wrap"
            style={{ backgroundColor: "#f0f7ff", border: "1.5px solid #c7ddf0" }}
          >
            <p className="me-body text-sm" style={{ color: "#1e3a52" }}>
              <span className="font-semibold">Ready to consult?</span>{" "}
              Mark this case as reviewed after your appointment.
            </p>
            <button
              className="me-body text-sm font-semibold px-5 py-2.5 rounded-xl shrink-0 transition-all"
              style={{ backgroundColor: "#1a6fa8", color: "white", boxShadow: "0 2px 8px rgba(26,111,168,0.25)" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#155e90")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1a6fa8")}
              onClick={onMarkReviewed}
            >
              Mark as reviewed
            </button>
          </div>

          {/* Disclaimer */}
          <p className="me-body text-xs text-center" style={{ color: "#c7ddf0" }}>
            Information submitted by the patient. All medical decisions are made by the doctor.
          </p>

        </div>
      </main>

      <footer className="text-center py-5">
        <p className="me-body text-xs" style={{ color: "#b0bec5" }}>Medical Era · Doctor Dashboard</p>
      </footer>
    </div>
  );
}
