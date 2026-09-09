import { useState } from "react";

function CrossIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
      <rect x="9" y="2" width="6" height="20" rx="2" fill="currentColor" />
      <rect x="2" y="9" width="20" height="6" rx="2" fill="currentColor" />
    </svg>
  );
}

function MicIcon({ size = 24 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" width={size} height={size} aria-hidden="true">
      <rect x="8" y="2" width="8" height="13" rx="4" fill="currentColor" opacity="0.9" />
      <path d="M5 10a7 7 0 0014 0" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="9" y1="21" x2="15" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5" aria-hidden="true">
      <path d="M12 2L4 6v6c0 5 3.5 9.74 8 11 4.5-1.26 8-6 8-11V6L12 2z" fill="currentColor" opacity="0.2" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HelpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" aria-hidden="true">
      <circle cx="12" cy="12" r="9.25" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9.5 9.5C9.5 8.12 10.62 7 12 7s2.5 1.12 2.5 2.5c0 1.5-2.5 3-2.5 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="0.75" fill="currentColor" />
    </svg>
  );
}

export default function MedicalEra({ onStart }: { onStart?: () => void }) {
  const [listening, setListening] = useState(false);

  return (
    <div
      className="min-h-full flex flex-col"
      style={{
        fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
        backgroundColor: "#eef3f8",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        .me-body { font-family: 'Inter', system-ui, sans-serif; }
        .me-heading { font-family: 'DM Sans', system-ui, sans-serif; }
        ::-webkit-scrollbar { display: none; }
      `}</style>

      {/* Top bar */}
      <header className="w-full px-6 py-5 flex items-center justify-between" style={{ backgroundColor: "white", borderBottom: "1px solid #e2eaf3" }}>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#1a6fa8", color: "white" }}>
            <CrossIcon />
          </div>
          <span className="me-heading font-semibold text-lg tracking-tight" style={{ color: "#0c2340" }}>
            Medical Era
          </span>
        </div>
        <button
          className="flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-lg transition-colors hover:bg-blue-50"
          style={{ color: "#4a7fa8" }}
        >
          <HelpIcon />
          Help
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">

          {/* Card */}
          <div
            className="rounded-2xl p-8"
            style={{
              backgroundColor: "white",
              boxShadow: "0 2px 8px rgba(10,40,80,0.07), 0 0 0 1px rgba(10,40,80,0.06)",
            }}
          >
            {/* Greeting label */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#22c55e" }} />
              <span className="me-body text-xs font-medium uppercase tracking-widest" style={{ color: "#64748b" }}>
                Patient check-in
              </span>
            </div>

            {/* Heading */}
            <h1 className="me-heading text-3xl font-bold leading-snug mb-3" style={{ color: "#0c2340", letterSpacing: "-0.02em" }}>
              Healthcare,<br />made simpler.
            </h1>

            {/* Description */}
            <p className="me-body text-sm leading-relaxed mb-8" style={{ color: "#4a6580" }}>
              Tell us what you need help with. Medical Era helps organize your information for your doctor — so they can focus on&nbsp;you.
            </p>

            {/* Primary CTA */}
            <button
              className="w-full py-4 rounded-xl text-base font-semibold transition-all active:scale-[0.98]"
              style={{
                backgroundColor: "#1a6fa8",
                color: "white",
                boxShadow: "0 2px 10px rgba(26,111,168,0.32)",
                letterSpacing: "-0.01em",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#155e90")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1a6fa8")}
              onClick={onStart}
            >
              Start
            </button>

            {/* Voice — secondary card */}
            <button
              onClick={() => setListening(!listening)}
              className="w-full mt-3 rounded-2xl flex items-center gap-4 transition-all active:scale-[0.99]"
              style={{
                padding: "14px 18px",
                backgroundColor: listening ? "#f0faf5" : "white",
                border: `2px solid ${listening ? "#86efac" : "#d1e6f5"}`,
                boxShadow: "0 1px 4px rgba(10,40,80,0.07)",
                color: listening ? "#15803d" : "#1a6fa8",
                textAlign: "left",
              }}
              aria-label={listening ? "Stop voice input" : "Talk instead of typing"}
            >
              <span
                className="shrink-0 flex items-center justify-center rounded-xl"
                style={{
                  width: 44,
                  height: 44,
                  backgroundColor: listening ? "#dcfce7" : "#e8f3fb",
                  animation: listening ? "pulse 1.5s ease-in-out infinite" : "none",
                }}
              >
                <MicIcon size={22} />
              </span>
              <span>
                <span className="me-body block text-sm font-semibold leading-tight">
                  {listening ? "Listening… tap to stop" : "Talk instead of typing"}
                </span>
                {!listening && (
                  <span className="me-body block text-xs mt-0.5" style={{ color: "#7a9ab5" }}>
                    Speak your question or concern
                  </span>
                )}
              </span>
            </button>

            {/* I need help */}
            <button
              className="w-full mt-3 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-slate-50"
              style={{ color: "#4a6580", border: "1.5px solid #e2eaf3" }}
            >
              I need help
            </button>
          </div>

          {/* AI vs Doctor distinction badge */}
          <div
            className="mt-4 mx-1 rounded-xl px-4 py-3 flex items-start gap-2.5"
            style={{ backgroundColor: "#fffbeb", border: "1px solid #fde68a" }}
          >
            <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#b45309" }} aria-hidden="true">
              <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" />
              <path d="M10 6v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="10" cy="13.5" r="0.75" fill="currentColor" />
            </svg>
            <p className="me-body text-xs leading-relaxed" style={{ color: "#92400e" }}>
              <span className="font-semibold">AI assists — your doctor decides.</span>{" "}
              Medical Era organizes what you share, but all medical decisions are made by your healthcare provider.
            </p>
          </div>

          {/* Privacy message */}
          <div className="mt-3 flex items-start gap-2 px-1">
            <span style={{ color: "#94a3b8", marginTop: "1px" }}>
              <ShieldIcon />
            </span>
            <p className="me-body text-xs leading-relaxed" style={{ color: "#94a3b8" }}>
              Your information is shared only with the healthcare professionals involved in your care today. It is not sold or used for advertising.
            </p>
          </div>

        </div>
      </main>

      {/* Subtle footer */}
      <footer className="text-center py-5">
        <p className="me-body text-xs" style={{ color: "#b0bec5" }}>
          Medical Era · Healthcare platform
        </p>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.08); }
        }
      `}</style>
    </div>
  );
}
