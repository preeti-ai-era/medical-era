import { useState } from "react";

function CrossIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
      <rect x="9" y="2" width="6" height="20" rx="2" fill="currentColor" />
      <rect x="2" y="9" width="20" height="6" rx="2" fill="currentColor" />
    </svg>
  );
}

type AnswerType = "single" | "multi" | "text";

interface Question {
  id: string;
  text: string;
  hint?: string;
  type: AnswerType;
  options?: string[];
}

const QUESTIONS: Question[] = [
  {
    id: "onset",
    text: "When did this problem start?",
    type: "single",
    options: ["Today", "Yesterday", "2–3 days ago", "More than 3 days ago", "I'm not sure"],
  },
  {
    id: "trend",
    text: "Has it become better, worse, or stayed the same since it started?",
    type: "single",
    options: ["Getting better", "Getting worse", "About the same", "It comes and goes"],
  },
  {
    id: "severity",
    text: "How severe is it right now?",
    type: "single",
    options: ["Mild — manageable", "Moderate — affecting my routine", "Severe — hard to function"],
  },
  {
    id: "medicines",
    text: "Are you currently taking any medicines for this problem?",
    hint: "Include any tablets, drops, or home remedies you have tried.",
    type: "single",
    options: ["Yes", "No", "I tried something but I'm not sure what it was"],
  },
  {
    id: "other_symptoms",
    text: "Do you have any of these additional symptoms?",
    hint: "Select all that apply.",
    type: "multi",
    options: ["Nausea", "Vomiting", "Dizziness", "Fatigue", "Difficulty sleeping", "Sensitivity to light", "None of these"],
  },
];

const QUESTION_LABELS: Record<string, string> = {
  onset: "When it started",
  trend: "How it has changed",
  severity: "Current severity",
  medicines: "Medicines taken",
  other_symptoms: "Other symptoms",
};

export type Answers = Record<string, string | string[]>;

function ProgressDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className="rounded-full transition-all"
          style={{
            width: i === current ? 18 : 6,
            height: 6,
            backgroundColor: i < current ? "#1a6fa8" : i === current ? "#1a6fa8" : "#e2eaf3",
            opacity: i < current ? 0.4 : 1,
          }}
        />
      ))}
    </div>
  );
}

function ChipButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="me-body text-sm font-medium px-4 py-2.5 rounded-xl transition-all text-left"
      style={{
        backgroundColor: selected ? "#e8f3fb" : "#f8fafc",
        border: `1.5px solid ${selected ? "#1a6fa8" : "#e2eaf3"}`,
        color: selected ? "#1a6fa8" : "#4a6580",
      }}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function QuestionScreen({
  question,
  index,
  total,
  answer,
  onAnswer,
  onBack,
  onNext,
}: {
  question: Question;
  index: number;
  total: number;
  answer: string | string[] | undefined;
  onAnswer: (v: string | string[]) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const hasAnswer =
    question.type === "multi"
      ? Array.isArray(answer) && answer.length > 0
      : typeof answer === "string" && answer.length > 0;

  function toggleMulti(opt: string) {
    const current = Array.isArray(answer) ? answer : [];
    if (opt === "None of these") {
      onAnswer(current.includes("None of these") ? [] : ["None of these"]);
      return;
    }
    const without = current.filter((o) => o !== "None of these");
    if (without.includes(opt)) {
      onAnswer(without.filter((o) => o !== opt));
    } else {
      onAnswer([...without, opt]);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <ProgressDots total={total} current={index} />
        <span className="me-body text-xs font-medium" style={{ color: "#94a3b8" }}>
          {index + 1} of {total}
        </span>
      </div>

      {/* Question */}
      <div>
        <p className="me-heading text-lg font-bold leading-snug mb-1" style={{ color: "#0c2340", letterSpacing: "-0.01em" }}>
          {question.text}
        </p>
        {question.hint && (
          <p className="me-body text-xs mt-1" style={{ color: "#94a3b8" }}>
            {question.hint}
          </p>
        )}
      </div>

      {/* Options */}
      {question.type === "single" && (
        <div className="flex flex-col gap-2">
          {question.options!.map((opt) => (
            <ChipButton
              key={opt}
              label={opt}
              selected={answer === opt}
              onClick={() => onAnswer(opt)}
            />
          ))}
        </div>
      )}

      {question.type === "multi" && (
        <div className="flex flex-col gap-2">
          {question.options!.map((opt) => (
            <ChipButton
              key={opt}
              label={opt}
              selected={Array.isArray(answer) && answer.includes(opt)}
              onClick={() => toggleMulti(opt)}
            />
          ))}
        </div>
      )}

      {question.type === "text" && (
        <textarea
          className="w-full rounded-xl p-3.5 text-sm resize-none outline-none me-body"
          rows={3}
          placeholder="Type your answer here…"
          value={typeof answer === "string" ? answer : ""}
          onChange={(e) => onAnswer(e.target.value)}
          style={{ backgroundColor: "#f8fafc", border: "1.5px solid #e2eaf3", color: "#0c2340" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#1a6fa8")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#e2eaf3")}
        />
      )}

      {/* Nav buttons */}
      <div className="flex gap-3 pt-1">
        <button
          className="me-body flex-1 py-3 rounded-xl text-sm font-medium transition-all"
          style={{ color: "#7a9ab5", border: "1.5px solid #e2eaf3", backgroundColor: "white" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#c7ddf0")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e2eaf3")}
          onClick={onBack}
        >
          Back
        </button>
        <button
          className="me-body flex-[2] py-3 rounded-xl text-sm font-semibold transition-all"
          style={{
            backgroundColor: hasAnswer ? "#1a6fa8" : "#e2eaf3",
            color: hasAnswer ? "white" : "#94a3b8",
            cursor: hasAnswer ? "pointer" : "default",
            boxShadow: hasAnswer ? "0 2px 8px rgba(26,111,168,0.25)" : "none",
          }}
          disabled={!hasAnswer}
          onClick={hasAnswer ? onNext : undefined}
          onMouseEnter={(e) => { if (hasAnswer) e.currentTarget.style.backgroundColor = "#155e90"; }}
          onMouseLeave={(e) => { if (hasAnswer) e.currentTarget.style.backgroundColor = "#1a6fa8"; }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}

function ReviewScreen({
  complaint,
  answers,
  files = [],
  onBack,
  onSubmit,
}: {
  complaint: string;
  answers: Answers;
  files?: UploadedFile[];
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="me-body text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#94a3b8" }}>
          Review before sending
        </p>
        <p className="me-heading text-lg font-bold" style={{ color: "#0c2340", letterSpacing: "-0.01em" }}>
          Information for your doctor
        </p>
        <p className="me-body text-xs mt-1" style={{ color: "#64748b" }}>
          Check what will be sent. You can go back to change any answer.
        </p>
      </div>

      {/* AI label */}
      <div
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg w-fit"
        style={{ backgroundColor: "#fef9c3", border: "1px solid #fde68a" }}
      >
        <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 shrink-0" style={{ color: "#b45309" }} aria-hidden="true">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M8 5v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="8" cy="10.5" r="0.6" fill="currentColor" />
        </svg>
        <p className="me-body text-xs font-medium" style={{ color: "#92400e" }}>
          AI-assisted — Doctor will review this information
        </p>
      </div>

      {/* Summary card */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid #e2eaf3", backgroundColor: "white" }}
      >
        {/* Complaint */}
        <div className="px-5 py-4" style={{ borderBottom: "1px solid #f0f4f8" }}>
          <p className="me-label mb-1.5">Main complaint</p>
          <p className="me-body text-sm leading-relaxed" style={{ color: "#1e3a52" }}>{complaint}</p>
        </div>

        {/* Follow-up answers */}
        {QUESTIONS.map((q) => {
          const ans = answers[q.id];
          if (!ans) return null;
          const display = Array.isArray(ans) ? ans.join(", ") : ans;
          return (
            <div
              key={q.id}
              className="px-5 py-4"
              style={{ borderBottom: "1px solid #f0f4f8" }}
            >
              <p className="me-label mb-1.5">{QUESTION_LABELS[q.id] ?? q.id}</p>
              <p className="me-body text-sm" style={{ color: "#1e3a52" }}>{display}</p>
            </div>
          );
        })}

        {/* Uploaded documents */}
        <div className="px-5 py-4">
          <p className="me-label mb-1.5">Uploaded documents</p>
          {(files ?? []).length === 0 ? (
            <p className="me-body text-sm" style={{ color: "#94a3b8" }}>None uploaded</p>
          ) : (
            <div className="flex flex-col gap-1.5 mt-1">
              {files.map((u, i) => (
                <div key={i} className="flex items-center gap-2">
                  {fileIcon(u.file.name)}
                  <div className="flex-1 min-w-0">
                    <p className="me-body text-xs truncate" style={{ color: "#1e3a52" }}>{u.file.name}</p>
                    <p className="me-body text-xs" style={{ color: "#7ab8d8" }}>{u.category}</p>
                  </div>
                  <span className="me-body text-xs shrink-0" style={{ color: "#94a3b8" }}>
                    {(u.file.size / 1024).toFixed(0)} KB
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <p className="me-body text-xs text-center" style={{ color: "#94a3b8" }}>
        AI has only organized the information you provided. No diagnosis or recommendation has been made. All medical decisions are made by your doctor.
      </p>

      {/* Nav buttons */}
      <div className="flex gap-3">
        <button
          className="me-body flex-1 py-3 rounded-xl text-sm font-medium transition-all"
          style={{ color: "#7a9ab5", border: "1.5px solid #e2eaf3", backgroundColor: "white" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#c7ddf0")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e2eaf3")}
          onClick={onBack}
        >
          Back
        </button>
        <button
          className="me-body flex-[2] py-3.5 rounded-xl text-sm font-semibold transition-all"
          style={{ backgroundColor: "#1a6fa8", color: "white", boxShadow: "0 2px 10px rgba(26,111,168,0.32)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#155e90")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1a6fa8")}
          onClick={onSubmit}
        >
          Submit to doctor
        </button>
      </div>
    </div>
  );
}

const DOC_CATEGORIES = [
  { id: "prescription", label: "Prescription", icon: "💊" },
  { id: "report", label: "Medical / diagnostic report", icon: "📋" },
  { id: "opd", label: "Previous OPD card", icon: "🏥" },
  { id: "photo", label: "Relevant photo", icon: "📷" },
];

function fileIcon(name: string) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "gif", "webp", "heic"].includes(ext))
    return (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" style={{ color: "#1a6fa8" }}>
        <rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="7" cy="8" r="1.5" fill="currentColor" opacity="0.5" />
        <path d="M2 13l4-3 3 3 3-4 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (ext === "pdf")
    return (
      <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" style={{ color: "#dc2626" }}>
        <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M6 7h8M6 10h8M6 13h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" style={{ color: "#64748b" }}>
      <rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M6 7h8M6 10h8M6 13h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export interface UploadedFile {
  file: File;
  category: string;
}

function UploadScreen({
  uploads = [],
  onAddFiles,
  onRemoveFile,
  onBack,
  onContinue,
  onSkip,
}: {
  uploads?: UploadedFile[];
  onAddFiles: (fl: FileList | null, category: string) => void;
  onRemoveFile: (i: number) => void;
  onBack: () => void;
  onContinue: () => void;
  onSkip: () => void;
}) {
  const [dragOver, setDragOver] = useState(false);

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="me-body text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#94a3b8" }}>
          Optional
        </p>
        <p className="me-heading text-lg font-bold leading-snug" style={{ color: "#0c2340", letterSpacing: "-0.01em" }}>
          Upload medical documents
        </p>
        <p className="me-body text-xs mt-1.5" style={{ color: "#64748b" }}>
          Share any existing documents so your doctor has the full picture. You can skip this if you have nothing to upload.
        </p>
      </div>

      {/* Category buttons — each opens its own file picker */}
      <div className="grid grid-cols-2 gap-2">
        {DOC_CATEGORIES.map((c) => {
          const inputId = `upload-${c.id}`;
          return (
            <label
              key={c.id}
              htmlFor={inputId}
              className="flex items-center gap-2 px-3 py-2.5 rounded-xl cursor-pointer transition-all"
              style={{ backgroundColor: "#f8fafc", border: "1px solid #e2eaf3" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#f0f7ff";
                (e.currentTarget as HTMLElement).style.borderColor = "#c7ddf0";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = "#f8fafc";
                (e.currentTarget as HTMLElement).style.borderColor = "#e2eaf3";
              }}
            >
              <input
                id={inputId}
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                className="sr-only"
                onChange={(e) => onAddFiles(e.target.files, c.label)}
              />
              <span className="text-base">{c.icon}</span>
              <span className="me-body text-xs font-medium" style={{ color: "#1a6fa8" }}>{c.label}</span>
            </label>
          );
        })}
      </div>

      {/* Drop zone (general upload) */}
      <label
        className="flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all"
        style={{
          padding: "24px 16px",
          border: `2px dashed ${dragOver ? "#1a6fa8" : "#c7ddf0"}`,
          backgroundColor: dragOver ? "#f0f7ff" : "#f8fafc",
        }}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); onAddFiles(e.dataTransfer.files, "Document"); }}
      >
        <input
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          className="sr-only"
          onChange={(e) => onAddFiles(e.target.files, "Document")}
        />
        <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 mb-2" style={{ color: "#7ab8d8" }}>
          <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 4v12m0-12l-3.5 3.5M12 4l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="me-body text-sm font-medium" style={{ color: "#1a6fa8" }}>Tap to upload</span>
        <span className="me-body text-xs mt-0.5" style={{ color: "#94a3b8" }}>or drag files here · PDF, images, documents</span>
      </label>

      {/* File list */}
      {uploads.length > 0 && (
        <div className="flex flex-col gap-2">
          {uploads.map((u, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5"
              style={{ backgroundColor: "#f0f7ff", border: "1px solid #c7ddf0" }}
            >
              {fileIcon(u.file.name)}
              <div className="flex-1 min-w-0">
                <p className="me-body text-xs font-medium truncate" style={{ color: "#1e3a52" }}>{u.file.name}</p>
                <p className="me-body text-xs" style={{ color: "#7ab8d8" }}>{u.category}</p>
              </div>
              <span className="me-body text-xs shrink-0" style={{ color: "#94a3b8" }}>
                {(u.file.size / 1024).toFixed(0)} KB
              </span>
              <button
                onClick={() => onRemoveFile(i)}
                className="me-body text-xs font-medium transition-colors shrink-0"
                style={{ color: "#dc2626" }}
                aria-label={`Remove ${u.file.name}`}
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Note */}
      <div
        className="flex items-start gap-2 px-3 py-2.5 rounded-xl"
        style={{ backgroundColor: "#fef9c3", border: "1px solid #fde68a" }}
      >
        <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 shrink-0 mt-0.5" style={{ color: "#b45309" }} aria-hidden="true">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
          <path d="M8 5v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
          <circle cx="8" cy="10.5" r="0.6" fill="currentColor" />
        </svg>
        <p className="me-body text-xs leading-relaxed" style={{ color: "#92400e" }}>
          Medical Era will organize the information from your uploaded documents for your doctor to review. AI does not make a diagnosis.
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          className="me-body flex-1 py-3 rounded-xl text-sm font-medium transition-all"
          style={{ color: "#7a9ab5", border: "1.5px solid #e2eaf3", backgroundColor: "white" }}
          onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#c7ddf0")}
          onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e2eaf3")}
          onClick={onBack}
        >
          Back
        </button>
        <button
          className="me-body flex-[2] py-3 rounded-xl text-sm font-semibold transition-all"
          style={{ backgroundColor: "#1a6fa8", color: "white", boxShadow: "0 2px 8px rgba(26,111,168,0.25)" }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#155e90")}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1a6fa8")}
          onClick={onContinue}
        >
          {uploads.length > 0 ? `Continue with ${uploads.length} file${uploads.length > 1 ? "s" : ""}` : "Continue"}
        </button>
      </div>

      {/* Skip */}
      <button
        className="me-body text-sm font-medium text-center transition-colors"
        style={{ color: "#94a3b8" }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#64748b")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
        onClick={onSkip}
      >
        I don't have any documents — skip this step
      </button>
    </div>
  );
}

type FlowStep = number | "upload" | "review" | "done";

export default function MedicalEraAIFollowUp({
  complaint,
  onBack,
  onFilesSubmitted,
  onAnswersSubmitted,
}: {
  complaint: string;
  onBack: () => void;
  onFilesSubmitted?: (uploads: UploadedFile[]) => void;
  onAnswersSubmitted?: (answers: Answers, complaint: string) => void;
}) {
  const [step, setStep] = useState<FlowStep>(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [uploads, setUploads] = useState<UploadedFile[]>([]);

  function setAnswer(id: string, value: string | string[]) {
    setAnswers((a) => ({ ...a, [id]: value }));
  }

  function addFiles(incoming: FileList | null, category: string) {
    if (!incoming) return;
    setUploads((prev) => {
      const existing = new Set(prev.map((u) => u.file.name + u.file.size));
      const newEntries = Array.from(incoming)
        .filter((f) => !existing.has(f.name + f.size))
        .map((f) => ({ file: f, category }));
      return [...prev, ...newEntries];
    });
  }

  function removeFile(index: number) {
    setUploads((prev) => prev.filter((_, i) => i !== index));
  }

  function goNext() {
    const currentIndex = step as number;
    if (currentIndex < QUESTIONS.length - 1) {
      setStep(currentIndex + 1);
    } else {
      setStep("upload");
    }
  }

  function goBack() {
    if (step === "review") {
      setStep("upload");
    } else if (step === "upload") {
      setStep(QUESTIONS.length - 1);
    } else if ((step as number) === 0) {
      onBack();
    } else {
      setStep((step as number) - 1);
    }
  }

  if (step === "done") {
    return (
      <div className="min-h-full flex flex-col" style={{ fontFamily: "'Inter','DM Sans',system-ui,sans-serif", backgroundColor: "#eef3f8" }}>
        <style>{`.me-body{font-family:'Inter',system-ui,sans-serif}.me-heading{font-family:'DM Sans',system-ui,sans-serif}.me-label{font-family:'Inter',system-ui,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;color:#94a3b8}`}</style>
        <header className="w-full px-6 py-5 flex items-center" style={{ backgroundColor: "white", borderBottom: "1px solid #e2eaf3" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#1a6fa8", color: "white" }}>
              <CrossIcon />
            </div>
            <span className="me-heading font-semibold text-lg tracking-tight" style={{ color: "#0c2340" }}>Medical Era</span>
          </div>
        </header>
        <div className="w-full h-1" style={{ backgroundColor: "#1a6fa8" }} />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-sm text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "#dcfce7" }}>
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" style={{ color: "#16a34a" }}>
                <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="me-heading text-2xl font-bold mb-3" style={{ color: "#0c2340" }}>
              Your information has been submitted.
            </h1>
            <p className="me-body text-sm leading-relaxed mb-6" style={{ color: "#64748b" }}>
              Your doctor has been notified and will review everything before your appointment.
            </p>
            <div className="rounded-xl p-4 text-left" style={{ backgroundColor: "white", border: "1px solid #e2eaf3" }}>
              <p className="me-body text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
                <span className="font-semibold" style={{ color: "#64748b" }}>What happens next?</span><br />
                Medical Era has organized your responses and shared them securely with your healthcare provider. All medical decisions are made by your doctor.
              </p>
            </div>
          </div>
        </main>
        <footer className="text-center py-5"><p className="me-body text-xs" style={{ color: "#b0bec5" }}>Medical Era · Healthcare platform</p></footer>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col" style={{ fontFamily: "'Inter','DM Sans',system-ui,sans-serif", backgroundColor: "#eef3f8" }}>
      <style>{`.me-body{font-family:'Inter',system-ui,sans-serif}.me-heading{font-family:'DM Sans',system-ui,sans-serif}.me-label{font-family:'Inter',system-ui,sans-serif;font-size:11px;font-weight:600;letter-spacing:0.07em;text-transform:uppercase;color:#94a3b8}`}</style>

      {/* Header */}
      <header className="w-full px-6 py-5 flex items-center justify-between" style={{ backgroundColor: "white", borderBottom: "1px solid #e2eaf3" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#1a6fa8", color: "white" }}>
            <CrossIcon />
          </div>
          <span className="me-heading font-semibold text-lg tracking-tight" style={{ color: "#0c2340" }}>Medical Era</span>
        </div>
        <span
          className="me-body text-xs font-medium px-2.5 py-1 rounded-full"
          style={{ backgroundColor: "#e8f3fb", color: "#1a6fa8" }}
        >
          AI-assisted intake
        </span>
      </header>

      {/* Progress bar */}
      <div className="w-full h-1" style={{ backgroundColor: "#e2eaf3" }}>
        <div
          className="h-1 transition-all duration-300"
          style={{
            width:
              step === "review"
                ? "100%"
                : step === "upload"
                ? "90%"
                : `${((step as number) / QUESTIONS.length) * 85}%`,
            backgroundColor: "#1a6fa8",
          }}
        />
      </div>

      <main className="flex-1 px-4 py-8 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto">

          {/* Context label */}
          {step !== "review" && step !== "upload" && (
            <div className="mb-5 rounded-xl px-4 py-3" style={{ backgroundColor: "#f0f7ff", border: "1px solid #c7ddf0" }}>
              <p className="me-body text-xs font-medium mb-0.5" style={{ color: "#1a6fa8" }}>Your complaint</p>
              <p className="me-body text-xs leading-relaxed" style={{ color: "#1e3a52" }}>
                {complaint.length > 120 ? complaint.slice(0, 120) + "…" : complaint}
              </p>
            </div>
          )}

          {/* AI label (on question screens only) */}
          {step !== "review" && step !== "upload" && (
            <div
              className="flex items-center gap-1.5 mb-5 px-2.5 py-1.5 rounded-lg w-fit"
              style={{ backgroundColor: "#fef9c3", border: "1px solid #fde68a" }}
            >
              <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 shrink-0" style={{ color: "#b45309" }} aria-hidden="true">
                <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
                <path d="M8 5v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                <circle cx="8" cy="10.5" r="0.6" fill="currentColor" />
              </svg>
              <p className="me-body text-xs font-medium" style={{ color: "#92400e" }}>
                AI-assisted — Doctor will review this information
              </p>
            </div>
          )}

          {/* Card */}
          <div
            className="rounded-2xl p-6"
            style={{ backgroundColor: "white", boxShadow: "0 2px 8px rgba(10,40,80,0.07),0 0 0 1px rgba(10,40,80,0.06)" }}
          >
            {step === "review" ? (
              <ReviewScreen
                complaint={complaint}
                answers={answers}
                files={uploads}
                onBack={goBack}
                onSubmit={() => { onFilesSubmitted?.(uploads); onAnswersSubmitted?.(answers, complaint); setStep("done"); }}
              />
            ) : step === "upload" ? (
              <UploadScreen
                uploads={uploads}
                onAddFiles={addFiles}
                onRemoveFile={removeFile}
                onBack={goBack}
                onContinue={() => setStep("review")}
                onSkip={() => setStep("review")}
              />
            ) : (
              <QuestionScreen
                question={QUESTIONS[step as number]}
                index={step as number}
                total={QUESTIONS.length}
                answer={answers[QUESTIONS[step as number].id]}
                onAnswer={(v) => setAnswer(QUESTIONS[step as number].id, v)}
                onBack={goBack}
                onNext={goNext}
              />
            )}
          </div>

          {step !== "review" && step !== "upload" && (
            <p className="me-body text-xs text-center mt-4" style={{ color: "#94a3b8" }}>
              AI collects and organizes only. No diagnosis or recommendation is made.
            </p>
          )}

        </div>
      </main>

      <footer className="text-center py-5">
        <p className="me-body text-xs" style={{ color: "#b0bec5" }}>Medical Era · Healthcare platform</p>
      </footer>
    </div>
  );
}
