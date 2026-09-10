import { useState } from "react";
import MedicalEra from "./MedicalEra";
import MedicalEraWhoFor from "./MedicalEraWhoFor";
import MedicalEraDoctorDashboard from "./MedicalEraDoctorDashboard";
import MedicalEraCaseReview from "./MedicalEraCaseReview";
import MedicalEraAIFollowUp, { type UploadedFile, type Answers } from "./MedicalEraAIFollowUp";

type ActiveApp = "grove" | "patient" | "doctor-login" | "doctor";
type MedicalEraScreen = "welcome" | "who-for" | "step-2" | "follow-up";

// ── Role select screen ──────────────────────────────────────────────────────
function MedicalEraRoleSelect({ onSelect }: { onSelect: (role: "patient" | "doctor-login" | "doctor" | null) => void }) {
  return (
    <div className="min-h-full flex flex-col" style={{ fontFamily: "'Inter','DM Sans',system-ui,sans-serif", backgroundColor: "#eef3f8" }}>
      <style>{`.me-body{font-family:'Inter',system-ui,sans-serif}.me-heading{font-family:'DM Sans',system-ui,sans-serif}`}</style>
      <header className="w-full px-6 py-5 flex items-center" style={{ backgroundColor: "white", borderBottom: "1px solid #e2eaf3" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#1a6fa8", color: "white" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true"><rect x="9" y="2" width="6" height="20" rx="2" fill="currentColor" /><rect x="2" y="9" width="20" height="6" rx="2" fill="currentColor" /></svg>
          </div>
          <span className="me-heading font-semibold text-lg tracking-tight" style={{ color: "#0c2340" }}>Medical Era</span>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="rounded-2xl p-8" style={{ backgroundColor: "white", boxShadow: "0 2px 8px rgba(10,40,80,0.07),0 0 0 1px rgba(10,40,80,0.06)" }}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#1a6fa8" }} />
              <span className="me-body text-xs font-medium uppercase tracking-widest" style={{ color: "#64748b" }}>Prototype — role selection</span>
            </div>
            <h1 className="me-heading text-2xl font-bold leading-snug mb-2" style={{ color: "#0c2340", letterSpacing: "-0.02em" }}>
              Who are you?
            </h1>
            <p className="me-body text-sm mb-8" style={{ color: "#64748b" }}>
              Select your role to enter the correct experience. Each role has a separate, protected view.
            </p>
            <div className="flex flex-col gap-3">
              <button
                className="w-full flex items-center gap-4 p-5 rounded-xl text-left transition-all"
                style={{ backgroundColor: "#f0f7ff", border: "1.5px solid #c7ddf0" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#1a6fa8")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#c7ddf0")}
                onClick={() => onSelect("patient")}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#e8f3fb" }}>
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" style={{ color: "#1a6fa8" }}>
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </div>
                <div>
                  <p className="me-heading text-base font-bold" style={{ color: "#0c2340" }}>Continue as Patient</p>
                  <p className="me-body text-xs mt-0.5" style={{ color: "#64748b" }}>Describe your problem and submit information to your doctor</p>
                </div>
                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 shrink-0 ml-auto" style={{ color: "#94a3b8" }}>
                  <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                className="w-full flex items-center gap-4 p-5 rounded-xl text-left transition-all"
                style={{ backgroundColor: "#f8fafc", border: "1.5px solid #e2eaf3" }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#1a6fa8")}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#e2eaf3")}
                onClick={() => onSelect("doctor-login")}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#f0f4f8" }}>
                  <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" style={{ color: "#0c2340" }}>
                    <rect x="9" y="2" width="6" height="20" rx="2" fill="currentColor" opacity="0.15" />
                    <rect x="2" y="9" width="20" height="6" rx="2" fill="currentColor" opacity="0.15" />
                    <rect x="9" y="2" width="6" height="20" rx="2" stroke="currentColor" strokeWidth="1.4" />
                    <rect x="2" y="9" width="20" height="6" rx="2" stroke="currentColor" strokeWidth="1.4" />
                  </svg>
                </div>
                <div>
                  <p className="me-heading text-base font-bold" style={{ color: "#0c2340" }}>Continue as Doctor</p>
                  <p className="me-body text-xs mt-0.5" style={{ color: "#64748b" }}>Access the doctor dashboard, patient cases, and AI findings</p>
                </div>
                <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 shrink-0 ml-auto" style={{ color: "#94a3b8" }}>
                  <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
            <p className="me-body text-xs text-center mt-6" style={{ color: "#b0bec5" }}>
              Prototype demonstration — no real authentication
            </p>
          </div>
        </div>
      </main>
      <footer className="text-center py-5"><p className="me-body text-xs" style={{ color: "#b0bec5" }}>Medical Era · Healthcare platform</p></footer>
    </div>
  );
}

// ── Doctor login screen ───────────────────────────────────────────────────────
const DEMO_ID = "doctor@medicalera.demo";
const DEMO_PW = "MedicalEra123";

function DoctorLogin({ onSuccess, onBack }: { onSuccess: () => void; onBack: () => void }) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      setLoading(false);
      if (id.trim() === DEMO_ID && pw === DEMO_PW) {
        onSuccess();
      } else {
        setError("Incorrect doctor credentials. Please try again.");
      }
    }, 600);
  }

  return (
    <div className="min-h-full flex flex-col" style={{ fontFamily: "'Inter','DM Sans',system-ui,sans-serif", backgroundColor: "#eef3f8" }}>
      <style>{`.me-body{font-family:'Inter',system-ui,sans-serif}.me-heading{font-family:'DM Sans',system-ui,sans-serif}.me-input{background:#f8fafc;border:1.5px solid #e2eaf3;border-radius:12px;padding:10px 14px;font-size:14px;color:#0c2340;outline:none;width:100%;font-family:'Inter',system-ui,sans-serif;transition:border-color 0.15s}.me-input:focus{border-color:#1a6fa8}.me-input::placeholder{color:#94a3b8}`}</style>
      <header className="w-full px-6 py-5 flex items-center" style={{ backgroundColor: "white", borderBottom: "1px solid #e2eaf3" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#1a6fa8", color: "white" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true"><rect x="9" y="2" width="6" height="20" rx="2" fill="currentColor" /><rect x="2" y="9" width="20" height="6" rx="2" fill="currentColor" /></svg>
          </div>
          <span className="me-heading font-semibold text-lg tracking-tight" style={{ color: "#0c2340" }}>Medical Era</span>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <button onClick={onBack} className="flex items-center gap-1.5 me-body text-sm font-medium mb-6" style={{ color: "#7a9ab5" }}>
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><path d="M12.5 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Back
          </button>
          <form onSubmit={handleLogin}>
            <div className="rounded-2xl p-8" style={{ backgroundColor: "white", boxShadow: "0 2px 8px rgba(10,40,80,0.07),0 0 0 1px rgba(10,40,80,0.06)" }}>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#0c2340" }} />
                <span className="me-body text-xs font-medium uppercase tracking-widest" style={{ color: "#64748b" }}>Doctor access</span>
              </div>
              <h1 className="me-heading text-2xl font-bold leading-snug mb-2" style={{ color: "#0c2340", letterSpacing: "-0.02em" }}>
                Doctor login
              </h1>
              <p className="me-body text-sm mb-7" style={{ color: "#64748b" }}>
                Enter your credentials to access the doctor dashboard.
              </p>

              <div className="flex flex-col gap-4">
                <div>
                  <label className="me-body text-xs font-semibold uppercase tracking-widest block mb-1.5" style={{ color: "#94a3b8" }}>Email or Doctor ID</label>
                  <input
                    className="me-input"
                    type="text"
                    placeholder="doctor@medicalera.demo"
                    value={id}
                    onChange={(e) => { setId(e.target.value); setError(""); }}
                    autoComplete="username"
                    required
                  />
                </div>
                <div>
                  <label className="me-body text-xs font-semibold uppercase tracking-widest block mb-1.5" style={{ color: "#94a3b8" }}>Password</label>
                  <div className="relative">
                    <input
                      className="me-input"
                      type={showPw ? "text" : "password"}
                      placeholder="Enter password"
                      value={pw}
                      onChange={(e) => { setPw(e.target.value); setError(""); }}
                      autoComplete="current-password"
                      style={{ paddingRight: 44 }}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "#94a3b8" }}
                      onClick={() => setShowPw((s) => !s)}
                      aria-label={showPw ? "Hide password" : "Show password"}
                    >
                      {showPw ? (
                        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><path d="M3 3l14 14M8.5 8.6A2 2 0 0011.4 11.5M4.9 4.9C3.1 6.1 1.8 8 1.8 10c0 4 3.6 7 8.2 7a9.7 9.7 0 004.9-1.3M7.4 3.4A9.5 9.5 0 0110 3c4.6 0 8.2 3 8.2 7 0 1.5-.5 3-1.5 4.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
                      ) : (
                        <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><path d="M10 4C5.4 4 1.8 7 1.8 10s3.6 6 8.2 6 8.2-3 8.2-6-3.6-6-8.2-6z" stroke="currentColor" strokeWidth="1.4" /><circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.4" /></svg>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mt-4 flex items-start gap-2 px-3 py-2.5 rounded-xl" style={{ backgroundColor: "#fff5f5", border: "1px solid #fecaca" }}>
                  <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5 shrink-0 mt-0.5" style={{ color: "#dc2626" }}>
                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M8 5v3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                    <circle cx="8" cy="10.5" r="0.6" fill="currentColor" />
                  </svg>
                  <p className="me-body text-xs" style={{ color: "#dc2626" }}>{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-6 py-4 rounded-xl text-base font-semibold transition-all"
                style={{
                  backgroundColor: loading ? "#7ab8d8" : "#1a6fa8",
                  color: "white",
                  boxShadow: "0 2px 10px rgba(26,111,168,0.32)",
                  letterSpacing: "-0.01em",
                  cursor: loading ? "default" : "pointer",
                }}
                onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#155e90"; }}
                onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = "#1a6fa8"; }}
              >
                {loading ? "Verifying…" : "Login"}
              </button>

              <p className="me-body text-xs text-center mt-4" style={{ color: "#b0bec5" }}>
                Prototype demo — credentials are for demonstration only
              </p>
            </div>
          </form>
        </div>
      </main>
      <footer className="text-center py-5"><p className="me-body text-xs" style={{ color: "#b0bec5" }}>Medical Era · Healthcare platform</p></footer>
    </div>
  );
}

// ── Patient flow ─────────────────────────────────────────────────────────────
function MedicalEraFlow({ onExit, onFilesSubmitted, onAnswersSubmitted }: {
  onExit: () => void;
  onFilesSubmitted: (u: UploadedFile[]) => void;
  onAnswersSubmitted: (a: Answers, complaint: string) => void;
}) {
  const [screen, setScreen] = useState<MedicalEraScreen>("welcome");
  const [complaint, setComplaint] = useState("");
  const [answers, setAnswers] = useState<Answers | null>(null);
const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  if (screen === "who-for") return <MedicalEraWhoFor onBack={() => setScreen("welcome")} onContinue={() => setScreen("step-2")} />;
  if (screen === "step-2") return (
    <MedicalEraStep2
      onBack={() => setScreen("who-for")}
      onSubmit={(text) => { setComplaint(text); setScreen("follow-up"); }}
    />
  );
  if (screen === "follow-up") return (
    <MedicalEraAIFollowUp
      complaint={complaint}
      onBack={() => setScreen("step-2")}
      onFilesSubmitted={(files) => {
  setUploadedFiles(files);
  onFilesSubmitted(files);
}}
onAnswersSubmitted={(a, c) => {
  const patientCase = {
    complaint: c,
    answers: a,
    uploadedFiles,
  };

  console.log("Patient case:", patientCase);

  setAnswers(a);
  setComplaint(c);
  onAnswersSubmitted(a, c);
}}

    />
  );
  return <MedicalEra onStart={() => setScreen("who-for")} />;
}

function MedicalEraStep2({ onBack, onSubmit }: { onBack: () => void; onSubmit: (complaint: string) => void }) {
  const [text, setText] = useState("");
  const hasText = text.trim().length > 0;

  return (
    <div className="min-h-full flex flex-col" style={{ fontFamily: "'Inter','DM Sans',system-ui,sans-serif", backgroundColor: "#eef3f8" }}>
      <style>{`.me-body{font-family:'Inter',system-ui,sans-serif}.me-heading{font-family:'DM Sans',system-ui,sans-serif}`}</style>
      <header className="w-full px-6 py-5 flex items-center justify-between" style={{ backgroundColor: "white", borderBottom: "1px solid #e2eaf3" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#1a6fa8", color: "white" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true"><rect x="9" y="2" width="6" height="20" rx="2" fill="currentColor" /><rect x="2" y="9" width="20" height="6" rx="2" fill="currentColor" /></svg>
          </div>
          <span className="me-heading font-semibold text-lg tracking-tight" style={{ color: "#0c2340" }}>Medical Era</span>
        </div>
      </header>
      <div className="w-full h-1" style={{ backgroundColor: "#e2eaf3" }}>
        <div className="h-1 rounded-full" style={{ width: "50%", backgroundColor: "#1a6fa8" }} />
      </div>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-6" style={{ color: "#7a9ab5" }}>
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><path d="M12.5 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Back
          </button>
          <div className="rounded-2xl p-8" style={{ backgroundColor: "white", boxShadow: "0 2px 8px rgba(10,40,80,0.07),0 0 0 1px rgba(10,40,80,0.06)" }}>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#1a6fa8" }} />
              <span className="me-body text-xs font-medium uppercase tracking-widest" style={{ color: "#64748b" }}>Step 1 of 2</span>
            </div>
            <h1 className="me-heading text-2xl font-bold leading-snug mb-2" style={{ color: "#0c2340", letterSpacing: "-0.02em" }}>
              What brings you in today?
            </h1>
            <p className="me-body text-sm mb-6" style={{ color: "#64748b" }}>Describe what you are experiencing in your own words.</p>
            <textarea
              className="w-full rounded-xl p-4 text-sm resize-none outline-none me-body"
              rows={5}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. I have had a headache and fever for two days…"
              style={{ backgroundColor: "#f8fafc", border: "1.5px solid #e2eaf3", color: "#0c2340" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#1a6fa8")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e2eaf3")}
            />
            <button
              className="w-full mt-4 py-4 rounded-xl text-base font-semibold transition-all"
              style={{
                backgroundColor: hasText ? "#1a6fa8" : "#e2eaf3",
                color: hasText ? "white" : "#94a3b8",
                boxShadow: hasText ? "0 2px 10px rgba(26,111,168,0.32)" : "none",
                letterSpacing: "-0.01em",
                cursor: hasText ? "pointer" : "default",
              }}
              disabled={!hasText}
              onClick={() => onSubmit(text.trim())}
              onMouseEnter={(e) => { if (hasText) e.currentTarget.style.backgroundColor = "#155e90"; }}
              onMouseLeave={(e) => { if (hasText) e.currentTarget.style.backgroundColor = "#1a6fa8"; }}
            >
              Continue
            </button>
            <p className="me-body text-xs text-center mt-3" style={{ color: "#94a3b8" }}>
              AI will ask a few follow-up questions to help organize your information for the doctor.
            </p>
          </div>
        </div>
      </main>
      <footer className="text-center py-5"><p className="me-body text-xs" style={{ color: "#b0bec5" }}>Medical Era · Healthcare platform</p></footer>
    </div>
  );
}

function MedicalEraStep4({ onBack }: { onBack: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);

  function addFiles(incoming: FileList | null) {
    if (!incoming) return;
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      const next = Array.from(incoming).filter((f) => !existing.has(f.name + f.size));
      return [...prev, ...next];
    });
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function fileIcon(name: string) {
    const ext = name.split(".").pop()?.toLowerCase() ?? "";
    if (["jpg", "jpeg", "png", "gif", "webp", "heic"].includes(ext))
      return <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" style={{ color: "#1a6fa8" }}><rect x="2" y="3" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.4"/><circle cx="7" cy="8" r="1.5" fill="currentColor" opacity="0.5"/><path d="M2 13l4-3 3 3 3-4 4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/></svg>;
    if (["pdf"].includes(ext))
      return <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" style={{ color: "#dc2626" }}><rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M6 7h8M6 10h8M6 13h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
    return <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" style={{ color: "#64748b" }}><rect x="3" y="2" width="14" height="16" rx="2" stroke="currentColor" strokeWidth="1.4"/><path d="M6 7h8M6 10h8M6 13h5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/></svg>;
  }

  if (submitted) {
    return (
      <div className="min-h-full flex flex-col" style={{ fontFamily: "'Inter','DM Sans',system-ui,sans-serif", backgroundColor: "#eef3f8" }}>
        <style>{`.me-body{font-family:'Inter',system-ui,sans-serif}.me-heading{font-family:'DM Sans',system-ui,sans-serif}`}</style>
        <header className="w-full px-6 py-5 flex items-center" style={{ backgroundColor: "white", borderBottom: "1px solid #e2eaf3" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#1a6fa8", color: "white" }}>
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true"><rect x="9" y="2" width="6" height="20" rx="2" fill="currentColor" /><rect x="2" y="9" width="20" height="6" rx="2" fill="currentColor" /></svg>
            </div>
            <span className="me-heading font-semibold text-lg tracking-tight" style={{ color: "#0c2340" }}>Medical Era</span>
          </div>
        </header>
        <div className="w-full h-1" style={{ backgroundColor: "#1a6fa8" }} />
        <main className="flex-1 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-sm text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: "#dcfce7" }}>
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" style={{ color: "#16a34a" }}><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h1 className="me-heading text-2xl font-bold mb-3" style={{ color: "#0c2340" }}>Information submitted.</h1>
            <p className="me-body text-sm leading-relaxed" style={{ color: "#64748b" }}>
              Your doctor has been notified and will review your information before your appointment.
            </p>
            <div className="mt-8 rounded-xl p-4 text-left" style={{ backgroundColor: "white", border: "1px solid #e2eaf3" }}>
              <p className="me-body text-xs" style={{ color: "#94a3b8" }}>
                <span className="font-semibold" style={{ color: "#64748b" }}>What happens next?</span><br />
                Your information has been organised by Medical Era and shared securely with your healthcare provider. All medical decisions are made by your doctor.
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
      <style>{`.me-body{font-family:'Inter',system-ui,sans-serif}.me-heading{font-family:'DM Sans',system-ui,sans-serif}.me-input{background:#f8fafc;border:1.5px solid #e2eaf3;border-radius:12px;padding:10px 14px;font-size:14px;color:#0c2340;outline:none;width:100%;font-family:'Inter',system-ui,sans-serif;transition:border-color 0.15s}.me-input:focus{border-color:#1a6fa8}.me-input::placeholder{color:#94a3b8}`}</style>
      <header className="w-full px-6 py-5 flex items-center justify-between" style={{ backgroundColor: "white", borderBottom: "1px solid #e2eaf3" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#1a6fa8", color: "white" }}>
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true"><rect x="9" y="2" width="6" height="20" rx="2" fill="currentColor" /><rect x="2" y="9" width="20" height="6" rx="2" fill="currentColor" /></svg>
          </div>
          <span className="me-heading font-semibold text-lg tracking-tight" style={{ color: "#0c2340" }}>Medical Era</span>
        </div>
      </header>
      <div className="w-full h-1" style={{ backgroundColor: "#e2eaf3" }}>
        <div className="h-1 rounded-full" style={{ width: "100%", backgroundColor: "#1a6fa8" }} />
      </div>

      <main className="flex-1 px-4 py-8 overflow-y-auto">
        <div className="w-full max-w-sm mx-auto">
          <button onClick={onBack} className="flex items-center gap-1.5 text-sm font-medium mb-6" style={{ color: "#7a9ab5" }}>
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4"><path d="M12.5 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            Back
          </button>

          {/* Card */}
          <div className="rounded-2xl p-7" style={{ backgroundColor: "white", boxShadow: "0 2px 8px rgba(10,40,80,0.07),0 0 0 1px rgba(10,40,80,0.06)" }}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#22c55e" }} />
              <span className="me-body text-xs font-medium uppercase tracking-widest" style={{ color: "#64748b" }}>Step 4 of 4</span>
            </div>
            <h1 className="me-heading text-2xl font-bold leading-snug mb-1" style={{ color: "#0c2340", letterSpacing: "-0.02em" }}>
              Your information
            </h1>
            <p className="me-body text-sm mb-7" style={{ color: "#64748b" }}>
              All fields are optional. Share only what you are comfortable with.
            </p>

            {/* Basic info */}
            <p className="me-body text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Basic details</p>
            <div className="flex flex-col gap-3 mb-6">
              <input className="me-input" placeholder="Full name" />
              <div className="flex gap-3">
                <input className="me-input" placeholder="Age" style={{ width: "30%" }} />
                <select className="me-input" style={{ width: "70%", appearance: "none", backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 20 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M6 8l4 4 4-4' stroke='%2394a3b8' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center", backgroundSize: "16px", cursor: "pointer" }}>
                  <option value="">Gender (optional)</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
              <input className="me-input" placeholder="Phone number (optional)" />
            </div>

            {/* Medicines */}
            <p className="me-body text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Current medicines</p>
            <textarea
              className="me-input"
              rows={3}
              placeholder="e.g. Metformin 500 mg twice daily, Amlodipine 5 mg…"
              style={{ resize: "none" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#1a6fa8")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e2eaf3")}
            />
            <p className="me-body text-xs mt-1 mb-5" style={{ color: "#94a3b8" }}>Leave blank if you are not on any medicines or do not know.</p>

            {/* Allergies */}
            <p className="me-body text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Known allergies</p>
            <textarea
              className="me-input"
              rows={2}
              placeholder="e.g. Penicillin, Sulfa drugs, peanuts…"
              style={{ resize: "none" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#1a6fa8")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "#e2eaf3")}
            />
            <p className="me-body text-xs mt-1 mb-6" style={{ color: "#94a3b8" }}>Leave blank if none known.</p>

            {/* Documents upload */}
            <p className="me-body text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: "#94a3b8" }}>Documents & images</p>
            <p className="me-body text-xs mb-3" style={{ color: "#64748b" }}>OPD cards, prescriptions, lab reports, scans, or any relevant image.</p>

            {/* Drop zone */}
            <label
              className="flex flex-col items-center justify-center rounded-xl cursor-pointer transition-all"
              style={{
                padding: "24px 16px",
                border: `2px dashed ${dragOver ? "#1a6fa8" : "#c7ddf0"}`,
                backgroundColor: dragOver ? "#f0f7ff" : "#f8fafc",
              }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
            >
              <input
                type="file"
                multiple
                accept="image/*,.pdf,.doc,.docx"
                className="sr-only"
                onChange={(e) => addFiles(e.target.files)}
              />
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 mb-2" style={{ color: "#7ab8d8" }}>
                <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 4v12m0-12l-3.5 3.5M12 4l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="me-body text-sm font-medium" style={{ color: "#1a6fa8" }}>Tap to upload</span>
              <span className="me-body text-xs mt-1" style={{ color: "#94a3b8" }}>or drag files here · PDF, images, documents</span>
            </label>

            {/* File list */}
            {files.length > 0 && (
              <div className="mt-3 flex flex-col gap-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl px-3 py-2.5" style={{ backgroundColor: "#f0f7ff", border: "1px solid #c7ddf0" }}>
                    {fileIcon(f.name)}
                    <span className="me-body text-xs flex-1 truncate" style={{ color: "#1e3a52" }}>{f.name}</span>
                    <span className="me-body text-xs" style={{ color: "#94a3b8" }}>{(f.size / 1024).toFixed(0)} KB</span>
                    <button onClick={() => removeFile(i)} style={{ color: "#94a3b8", lineHeight: 1 }} aria-label="Remove file">
                      <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Submit */}
            <button
              className="w-full mt-7 py-4 rounded-xl text-base font-semibold"
              style={{ backgroundColor: "#1a6fa8", color: "white", boxShadow: "0 2px 10px rgba(26,111,168,0.32)", letterSpacing: "-0.01em" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#155e90")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1a6fa8")}
              onClick={() => setSubmitted(true)}
            >
              Submit to doctor
            </button>
            <p className="me-body text-xs text-center mt-3" style={{ color: "#94a3b8" }}>
              Your information will be reviewed by your healthcare provider. Medical decisions are made by your doctor.
            </p>
          </div>

          <div className="h-8" />
        </div>
      </main>

      <footer className="text-center py-5"><p className="me-body text-xs" style={{ color: "#b0bec5" }}>Medical Era · Healthcare platform</p></footer>
    </div>
  );
}

type DoctorScreen = "dashboard" | "case-review";

function DoctorFlow({ switcher, patientUploads, patientAnswers, patientComplaint }: {
  switcher: React.ReactNode;
  patientUploads: UploadedFile[];
  patientAnswers: Answers;
  patientComplaint: string;
}) {
  const [screen, setScreen] = useState<DoctorScreen>("dashboard");
  const [caseStatus, setCaseStatus] = useState<"New" | "Reviewed">("New");

  function markReviewed() {
    setCaseStatus("Reviewed");
    setScreen("dashboard");
  }

  return (
    <>
      {screen === "case-review"
        ? <MedicalEraCaseReview onBack={() => setScreen("dashboard")} onMarkReviewed={markReviewed} patientUploads={patientUploads} patientAnswers={patientAnswers} patientComplaint={patientComplaint} />
        : <MedicalEraDoctorDashboard onReviewCase={() => setScreen("case-review")} caseStatus={caseStatus} />}
      {switcher}
    </>
  );
}

function AppSwitcher({ active, onGrove, onPatient, onDoctor }: {
  active: ActiveApp;
  onGrove: () => void;
  onPatient: () => void;
  onDoctor: () => void;
}) {
  const tabs: { id: ActiveApp; label: string; action: () => void }[] = [
    { id: "grove", label: "Grove", action: onGrove },
    { id: "patient", label: "Patient", action: onPatient },
    { id: "doctor", label: "Doctor", action: onDoctor },
  ];
  const activeTab = active === "doctor-login" ? "doctor" : active;
  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1 rounded-full px-1.5 py-1.5 shadow-xl"
      style={{ backgroundColor: "rgba(15,15,15,0.88)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.1)" }}
    >
      {tabs.map(({ id, label, action }) => (
        <button
          key={id}
          onClick={action}
          className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
          style={{
            backgroundColor: activeTab === id ? "white" : "transparent",
            color: activeTab === id ? "#111" : "rgba(255,255,255,0.5)",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

const NAV_LINKS = ["Notes", "Books", "Medicines", "Ward", "Agent"];

const PILLARS = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
      </svg>
    ),
    name: "Notes",
    tagline: "Subject notes, ward templates, your own.",
    body: "Structured UG/PG notes across anatomy, medicine, surgery, and more. Grove notes are authored and verified. Your notes are yours — tagged, private, searchable.",
    href: "/notes",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.966 8.966 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    name: "Books",
    tagline: "The right book, the right edition.",
    body: "Curated textbook recommendations by subject, level, and purpose. We point you to what is worth reading. No pirated PDFs. Honest about editions and gaps.",
    href: "/books",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
      </svg>
    ),
    name: "Search",
    tagline: "One search across everything.",
    body: "Notes, book metadata, medicines, educational protocols — searched together. Typo-tolerant. Filter by subject, level, exam vs ward. Results labeled by source.",
    href: "/search",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
      </svg>
    ),
    name: "Medicines",
    tagline: "Educational monographs. Not a prescription.",
    body: "Drug class, typical uses, contraindications, major interactions, monitoring. Doses only when sourced — otherwise unknown. Look-alike / sound-alike callouts included.",
    href: "/medicines",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
      </svg>
    ),
    name: "Ward",
    tagline: "Templates for history, rounds, handover.",
    body: "Progress note structure, discharge summary templates, investigation primers, fluid and oxygen principles. For learning — no real patient data stored.",
    href: "/ward",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    name: "Agent",
    tagline: "Ask. Get an answer. Not a performance.",
    body: "Direct answer first, then why, then honest caveats. Three modes: Explain, Ward, Exam. Will not invent doses or citations. Will say when it does not know.",
    href: "/ask",
  },
];

const AGENT_MODES = ["Explain", "Ward", "Exam"] as const;
type AgentMode = (typeof AGENT_MODES)[number];

const AGENT_EXAMPLE: Record<AgentMode, { q: string; a: string; caveat: string }> = {
  Explain: {
    q: "What is the mechanism of action of furosemide?",
    a: "Furosemide inhibits the Na⁺-K⁺-2Cl⁻ co-transporter (NKCC2) in the thick ascending limb of the loop of Henle, preventing chloride reabsorption. This reduces the medullary concentration gradient, leading to decreased water reabsorption and increased urine output. It also has a mild vasodilatory effect that precedes diuresis.",
    caveat: "Mechanism is well-established standard teaching. Dosing and use in specific clinical situations should follow your hospital protocol and a licensed prescriber.",
  },
  Ward: {
    q: "Patient with 3 days of fever, cough, and SpO₂ 91% on room air. Next step?",
    a: "On a ward teaching basis: assess severity (RR, HR, BP, GCS, SpO₂), start supplemental oxygen targeting SpO₂ ≥94%, obtain chest X-ray, full blood count, CRP, and blood cultures before antibiotics if patient condition allows. Notify your senior.",
    caveat: "This is educational template guidance. Always escalate to your senior or registrar for real clinical decisions. Follow your institution's sepsis and pneumonia protocols.",
  },
  Exam: {
    q: "Mnemonic for causes of clubbing?",
    a: "CLUBBING — Cardiac (cyanotic heart disease, IE), Lung (bronchiectasis, abscess, fibrosis, cancer, empyema), Ulcerative colitis, Biliary cirrhosis, Benign familial, IBD (Crohn's), Neurogenic (rare), Gut (malabsorption). The respiratory causes are most commonly tested in UG exams.",
    caveat: "Mnemonics are memory aids. Verify against a standard textbook (e.g., Davidson's or Harrison's) before your exam.",
  },
};

const PERSONAS = [
  { role: "MBBS / Medical Student", needs: "Subject notes, exam explanations, book guidance, accurate mnemonics." },
  { role: "Intern", needs: "Ward lookups: fluids, common drugs, investigations, how to write notes, when to escalate." },
  { role: "Resident / Junior Doctor", needs: "Guidelines, differentials, drug classes, high-level procedures, night-float questions." },
  { role: "Practicing Doctor", needs: "Fast honest refreshers, medicine monographs, search across trusted material." },
];

const PRINCIPLES = [
  { heading: "Answer or decline.", body: "Grove gives a direct answer or says it cannot. It will not produce a polished guess." },
  { heading: "Source or unknown.", body: "Doses and citations appear only when verified and sourced. Unknown is not a failure — it is the honest answer." },
  { heading: "Caveats where they matter.", body: "High-stakes content — chemotherapy, potassium, paediatric doses, pregnancy — carries extra caution every time." },
  { heading: "Not a prescriber.", body: "Grove is an educational reference. Confirm with your hospital formulary, a licensed prescriber, and current guidelines." },
];

// Demo patient data for Priya Sharma — pre-populated so the Doctor Case Review
// shows real information even before the patient completes the live intake flow.
const DEMO_COMPLAINT =
  "I have had a persistent headache and mild fever for the past two to three days. I have no known allergies and I am not currently taking any medicines.";

const DEMO_ANSWERS: Answers = {
  onset: "2–3 days ago",
  trend: "About the same",
  severity: "Moderate — affecting my routine",
  medicines: "No",
  other_symptoms: ["None of these"],
};

export default function App() {
  const [activeApp, setActiveApp] = useState<ActiveApp>("patient");
  const [doctorAuthenticated, setDoctorAuthenticated] = useState(false);
  const [query, setQuery] = useState("");
  const [agentMode, setAgentMode] = useState<AgentMode>("Explain");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [patientUploads, setPatientUploads] = useState<UploadedFile[]>([]);
  const [patientAnswers, setPatientAnswers] = useState<Answers>(DEMO_ANSWERS);
  const [patientComplaint, setPatientComplaint] = useState(DEMO_COMPLAINT);

  function goToDoctor() {
    // Always require login — never bypass to dashboard directly
    setActiveApp("doctor-login");
    setDoctorAuthenticated(false);
  }

  const switcher = (
    <AppSwitcher
      active={activeApp}
      onGrove={() => setActiveApp("grove")}
      onPatient={() => setActiveApp("patient")}
      onDoctor={goToDoctor}
    />
  );

  if (activeApp === "patient") {
    return (
      <>
        <MedicalEraFlow
          onExit={() => setActiveApp("grove")}
          onFilesSubmitted={setPatientUploads}
onAnswersSubmitted={(a, c) => {
  setPatientAnswers(a);
  setPatientComplaint(c);

  fetch("https://medical-era.onrender.com/api/patient", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      complaint: c,
      answers: a,
      uploadedFiles: patientUploads,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Backend response:", data);
    })
    .catch((error) => {
      console.error("Backend error:", error);
    });
    fetch("https://medical-era.onrender.com/api/ai-summary", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    complaint: c,
    answers: a,
    uploadedFiles: patientUploads,
  }),
})
  .then((response) => response.json())
  .then((data) => {
    console.log("AI summary:", data);
  })
  .catch((error) => {
    console.error("AI error:", error);
  });
}}
        />
        {switcher}
      </>
    );
  }

  if (activeApp === "doctor-login") {
    return (
      <>
        <DoctorLogin
          onSuccess={() => { setDoctorAuthenticated(true); setActiveApp("doctor"); }}
          onBack={() => setActiveApp("grove")}
        />
        {switcher}
      </>
    );
  }

  if (activeApp === "doctor") {
    if (!doctorAuthenticated) {
      // Guard: if somehow doctor state reached without auth, send back to login
      setActiveApp("doctor-login");
      return null;
    }
    return <DoctorFlow switcher={switcher} patientUploads={patientUploads} patientAnswers={patientAnswers} patientComplaint={patientComplaint} />;
  }

  return (
    <div
      className="min-h-full text-[#e4dfd0]"
      style={{
        fontFamily: "'Source Sans 3', system-ui, sans-serif",
        backgroundColor: "#141a12",
        scrollbarWidth: "none",
      }}
    >
      <style>{`
        ::-webkit-scrollbar { display: none; }
        .lora { font-family: 'Lora', Georgia, serif; }
        .lora-italic { font-family: 'Lora', Georgia, serif; font-style: italic; }
        .leaf-divider::before {
          content: '⬡';
          color: #4a6644;
          margin: 0 0.75rem;
          font-size: 0.5rem;
          vertical-align: middle;
        }
      `}</style>

      {/* Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4"
        style={{ backgroundColor: "rgba(20,26,18,0.88)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(74,102,68,0.2)" }}
      >
        <a href="/" className="lora-italic text-xl tracking-tight" style={{ color: "#c4b87a" }}>
          Grove
        </a>
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map((l) => (
            <a key={l} href={`/${l.toLowerCase()}`} className="text-sm font-light tracking-wide transition-colors hover:text-[#c4b87a]" style={{ color: "#8a9e80" }}>
              {l}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a href="/login" className="hidden md:block text-sm font-light" style={{ color: "#8a9e80" }}>
            Sign in
          </a>
          <a
            href="/signup"
            className="text-sm px-4 py-1.5 rounded-full font-medium transition-all"
            style={{ backgroundColor: "#3a5435", color: "#c8e0c0", border: "1px solid #4a6644" }}
          >
            Get started
          </a>
          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ color: "#8a9e80" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"} />
            </svg>
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-x-0 top-[61px] z-40 py-4 px-6 flex flex-col gap-4" style={{ backgroundColor: "#141a12", borderBottom: "1px solid rgba(74,102,68,0.2)" }}>
          {NAV_LINKS.map((l) => (
            <a key={l} href={`/${l.toLowerCase()}`} className="text-sm py-1" style={{ color: "#8a9e80" }} onClick={() => setMobileMenuOpen(false)}>
              {l}
            </a>
          ))}
          <a href="/login" className="text-sm py-1" style={{ color: "#8a9e80" }} onClick={() => setMobileMenuOpen(false)}>
            Sign in
          </a>
        </div>
      )}

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20 pb-24 overflow-hidden">
        {/* Forest background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1774198137303-5425e592a4da?w=1600&h=900&fit=crop&auto=format"
            alt="Tall trees in misty fog"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.22) saturate(0.7)" }}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(20,26,18,0.3) 0%, rgba(20,26,18,0.6) 60%, rgba(20,26,18,1) 100%)" }} />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 mb-8 px-3 py-1 rounded-full text-xs tracking-widest uppercase" style={{ backgroundColor: "rgba(58,84,53,0.5)", color: "#8aba82", border: "1px solid rgba(74,102,68,0.4)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#8aba82] animate-pulse" />
            Educational reference — not a medical device
          </div>

          <h1 className="lora text-5xl md:text-7xl font-medium leading-tight mb-6" style={{ color: "#e8e0cc" }}>
            A grove for people<br />
            <span className="lora-italic" style={{ color: "#c4b87a" }}>in medicine.</span>
          </h1>

          <p className="text-lg md:text-xl font-light leading-relaxed mb-10 max-w-xl mx-auto" style={{ color: "#9aad90" }}>
            Notes, books, search, medicines, and an agent that will not pretend.<br />
            If we are not sure, we say so.
          </p>

          {/* Search bar */}
          <div className="relative max-w-2xl mx-auto">
            <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "rgba(26,34,22,0.95)", border: "1px solid rgba(74,102,68,0.5)", boxShadow: "0 8px 40px rgba(0,0,0,0.6)" }}>
              <div className="flex border-b" style={{ borderColor: "rgba(74,102,68,0.3)" }}>
                {AGENT_MODES.map((m) => (
                  <button
                    key={m}
                    onClick={() => setAgentMode(m)}
                    className="flex-1 py-3 text-sm font-medium transition-all"
                    style={{
                      color: agentMode === m ? "#c4b87a" : "#4a6644",
                      borderBottom: agentMode === m ? "2px solid #c4b87a" : "2px solid transparent",
                      backgroundColor: "transparent",
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4 shrink-0" style={{ color: "#4a6644" }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0016.803 15.803z" />
                </svg>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    agentMode === "Explain"
                      ? "Ask a teaching question…"
                      : agentMode === "Ward"
                      ? "Ask a ward question…"
                      : "Ask an exam question…"
                  }
                  className="flex-1 bg-transparent text-sm outline-none placeholder:opacity-40"
                  style={{ color: "#e4dfd0", fontFamily: "'Source Sans 3', sans-serif" }}
                />
                <button
                  className="shrink-0 px-4 py-1.5 rounded-xl text-sm font-medium transition-all"
                  style={{ backgroundColor: "#3a5435", color: "#c8e0c0" }}
                >
                  Ask
                </button>
              </div>
              <p className="px-4 pb-3 text-xs" style={{ color: "#4a6644" }}>
                Do not paste patient names or identifiers.
              </p>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l}
                href={`/${l.toLowerCase()}`}
                className="px-4 py-1.5 rounded-full text-xs font-medium tracking-wide transition-all hover:bg-[#2a3828]"
                style={{ color: "#6a8a64", border: "1px solid rgba(74,102,68,0.35)" }}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="px-6 md:px-10 py-24 max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="text-xs uppercase tracking-widest mb-3 font-medium" style={{ color: "#4a6644" }}>
            What Grove provides
          </p>
          <h2 className="lora text-3xl md:text-4xl font-medium" style={{ color: "#e0d8c4" }}>
            One place for study and hospital work.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px" style={{ backgroundColor: "rgba(74,102,68,0.2)" }}>
          {PILLARS.map((p) => (
            <a
              key={p.name}
              href={p.href}
              className="group relative p-7 transition-all"
              style={{ backgroundColor: "#161d14" }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ backgroundColor: "#1a2418" }}
              />
              <div className="relative z-10">
                <div className="mb-4 w-10 h-10 flex items-center justify-center rounded-xl" style={{ backgroundColor: "#1e2a1b", color: "#7aab6e" }}>
                  {p.icon}
                </div>
                <h3 className="lora text-lg font-medium mb-1" style={{ color: "#ddd5be" }}>
                  {p.name}
                </h3>
                <p className="text-xs mb-3 font-medium uppercase tracking-wide" style={{ color: "#c4b87a" }}>
                  {p.tagline}
                </p>
                <p className="text-sm leading-relaxed font-light" style={{ color: "#7a9076" }}>
                  {p.body}
                </p>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Agent showcase */}
      <section className="px-6 md:px-10 py-24" style={{ backgroundColor: "#111810" }}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <p className="text-xs uppercase tracking-widest mb-3 font-medium" style={{ color: "#4a6644" }}>
              The Grove Agent
            </p>
            <h2 className="lora text-3xl md:text-4xl font-medium mb-3" style={{ color: "#e0d8c4" }}>
              Ask. Get an answer, not a performance.
            </h2>
            <p className="text-sm font-light" style={{ color: "#6a8a64" }}>
              Direct answer first, then why, then caveats. Three modes — Explain, Ward, Exam.
            </p>
          </div>

          {/* Mode tabs */}
          <div className="flex gap-2 mb-6">
            {AGENT_MODES.map((m) => (
              <button
                key={m}
                onClick={() => setAgentMode(m)}
                className="px-5 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  backgroundColor: agentMode === m ? "#3a5435" : "transparent",
                  color: agentMode === m ? "#c8e0c0" : "#4a6644",
                  border: "1px solid rgba(74,102,68,0.4)",
                }}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Chat card */}
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#1a2218", border: "1px solid rgba(74,102,68,0.3)" }}>
            {/* Question */}
            <div className="px-6 pt-6 pb-4 flex items-start gap-3">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-semibold" style={{ backgroundColor: "#2a3828", color: "#7aab6e" }}>
                U
              </div>
              <p className="text-sm leading-relaxed pt-0.5" style={{ color: "#b8c8b0" }}>
                {AGENT_EXAMPLE[agentMode].q}
              </p>
            </div>

            <div className="mx-6 h-px" style={{ backgroundColor: "rgba(74,102,68,0.2)" }} />

            {/* Answer */}
            <div className="px-6 pt-4 pb-4 flex items-start gap-3">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                style={{ backgroundColor: "#1e2a1b" }}
              >
                <span className="lora-italic text-xs" style={{ color: "#c4b87a" }}>G</span>
              </div>
              <div>
                <p className="text-sm leading-relaxed mb-3" style={{ color: "#d0c8b0" }}>
                  {AGENT_EXAMPLE[agentMode].a}
                </p>
                <div className="rounded-xl px-4 py-3 text-xs leading-relaxed" style={{ backgroundColor: "#141a12", color: "#6a8a64", border: "1px solid rgba(74,102,68,0.2)" }}>
                  <span className="font-semibold" style={{ color: "#c4b87a" }}>Caveat · </span>
                  {AGENT_EXAMPLE[agentMode].caveat}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-3 flex items-center justify-between" style={{ borderTop: "1px solid rgba(74,102,68,0.15)", backgroundColor: "rgba(0,0,0,0.15)" }}>
              <p className="text-xs" style={{ color: "#3a5435" }}>Mode: {agentMode}</p>
              <div className="flex gap-3">
                {["Helpful", "Not sure", "Flag"].map((l) => (
                  <button key={l} className="text-xs transition-colors hover:text-[#c4b87a]" style={{ color: "#3a5435" }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="px-6 md:px-10 py-24 max-w-6xl mx-auto">
        <div className="mb-14">
          <p className="text-xs uppercase tracking-widest mb-3 font-medium" style={{ color: "#4a6644" }}>
            Who Grove is for
          </p>
          <h2 className="lora text-3xl md:text-4xl font-medium" style={{ color: "#e0d8c4" }}>
            From first year to the night float.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PERSONAS.map((p) => (
            <div key={p.role} className="p-6 rounded-2xl" style={{ backgroundColor: "#1a2218", border: "1px solid rgba(74,102,68,0.2)" }}>
              <h3 className="lora font-medium mb-2 text-lg" style={{ color: "#ddd5be" }}>
                {p.role}
              </h3>
              <p className="text-sm font-light leading-relaxed" style={{ color: "#6a8a64" }}>
                {p.needs}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Principles */}
      <section className="px-6 md:px-10 py-24 relative overflow-hidden" style={{ backgroundColor: "#111810" }}>
        <div className="absolute inset-0 pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1622305307877-81859c3841ef?w=1400&h=600&fit=crop&auto=format"
            alt="Forest"
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.08) saturate(0.5)", mixBlendMode: "luminosity" }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-xs uppercase tracking-widest mb-3 font-medium" style={{ color: "#4a6644" }}>
              Principles
            </p>
            <h2 className="lora text-3xl md:text-4xl font-medium" style={{ color: "#e0d8c4" }}>
              Close to nature in feel.<br />
              <span className="lora-italic" style={{ color: "#c4b87a" }}>Close to truth in content.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PRINCIPLES.map((p, i) => (
              <div key={i} className="flex gap-5">
                <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold mt-1" style={{ backgroundColor: "#1e2a1b", color: "#7aab6e", border: "1px solid rgba(74,102,68,0.4)" }}>
                  {i + 1}
                </div>
                <div>
                  <h4 className="lora font-medium mb-1.5" style={{ color: "#ddd5be" }}>
                    {p.heading}
                  </h4>
                  <p className="text-sm font-light leading-relaxed" style={{ color: "#6a8a64" }}>
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 md:px-10 py-28 text-center relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(58,84,53,0.15) 0%, transparent 70%)" }} />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="lora-italic text-6xl md:text-8xl mb-8" style={{ color: "#c4b87a", opacity: 0.6 }}>
            Grove
          </div>
          <h2 className="lora text-3xl md:text-4xl font-medium mb-4" style={{ color: "#e0d8c4" }}>
            Start in the grove.
          </h2>
          <p className="text-sm font-light mb-10" style={{ color: "#6a8a64" }}>
            Guest search and agent available without an account.<br />
            My Notes and saved work require a free account.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/ask"
              className="px-8 py-3.5 rounded-full text-sm font-medium transition-all hover:brightness-110"
              style={{ backgroundColor: "#3a5435", color: "#c8e0c0" }}
            >
              Ask Grove a question
            </a>
            <a
              href="/signup"
              className="px-8 py-3.5 rounded-full text-sm font-medium transition-all"
              style={{ color: "#8a9e80", border: "1px solid rgba(74,102,68,0.4)" }}
            >
              Create free account
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 md:px-10 py-10" style={{ borderTop: "1px solid rgba(74,102,68,0.2)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="lora-italic text-lg" style={{ color: "#c4b87a" }}>
              Grove
            </span>
            <p className="text-xs mt-1 font-light max-w-xs" style={{ color: "#3a5435" }}>
              Educational and professional reference. Not a medical device. Not a prescriber.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {["About", "Principles", "Privacy", "Settings"].map((l) => (
              <a key={l} href={`/${l.toLowerCase()}`} className="text-xs transition-colors hover:text-[#c4b87a]" style={{ color: "#3a5435" }}>
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
      {switcher}
    </div>
  );
}
