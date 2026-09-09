import { useState, type ReactNode } from "react";

function CrossIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
      <rect x="9" y="2" width="6" height="20" rx="2" fill="currentColor" />
      <rect x="2" y="9" width="20" height="6" rx="2" fill="currentColor" />
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

function PersonSelfIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" width={40} height={40} aria-hidden="true">
      <circle cx="20" cy="13" r="7" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.8" />
      <path d="M6 35c0-7.732 6.268-14 14-14s14 6.268 14 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function PersonOtherIcon() {
  return (
    <svg viewBox="0 0 40 40" fill="none" width={40} height={40} aria-hidden="true">
      <circle cx="14" cy="13" r="6" fill="currentColor" opacity="0.12" stroke="currentColor" strokeWidth="1.8" />
      <path d="M2 34c0-6.627 5.373-12 12-12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="27" cy="13" r="6" fill="currentColor" opacity="0.18" stroke="currentColor" strokeWidth="1.8" />
      <path d="M39 34c0-6.627-5.373-12-12-12s-12 5.373-12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5" aria-hidden="true">
      <path d="M7.5 5l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type Selection = "myself" | "someone-else" | null;

export default function MedicalEraWhoFor({ onBack, onContinue }: { onBack?: () => void; onContinue?: () => void }) {
  const [selected, setSelected] = useState<Selection>(null);

  const options: { id: Selection; label: string; sub: string; icon: ReactNode }[] = [
    {
      id: "myself",
      label: "Myself",
      sub: "I am the patient",
      icon: <PersonSelfIcon />,
    },
    {
      id: "someone-else",
      label: "Someone else",
      sub: "I am helping another person",
      icon: <PersonOtherIcon />,
    },
  ];

  return (
    <div
      className="min-h-full flex flex-col"
      style={{ fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif", backgroundColor: "#eef3f8" }}
    >
      <style>{`
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

      {/* Progress bar */}
      <div className="w-full h-1" style={{ backgroundColor: "#e2eaf3" }}>
        <div className="h-1 rounded-full transition-all" style={{ width: "33%", backgroundColor: "#1a6fa8" }} />
      </div>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">

          {/* Back link */}
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-sm font-medium mb-6 transition-colors hover:text-[#1a6fa8]"
              style={{ color: "#7a9ab5" }}
            >
              <svg viewBox="0 0 20 20" fill="none" className="w-4 h-4" aria-hidden="true">
                <path d="M12.5 5l-5 5 5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back
            </button>
          )}

          {/* Card */}
          <div
            className="rounded-2xl p-8"
            style={{ backgroundColor: "white", boxShadow: "0 2px 8px rgba(10,40,80,0.07), 0 0 0 1px rgba(10,40,80,0.06)" }}
          >
            {/* Step label */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#1a6fa8" }} />
              <span className="me-body text-xs font-medium uppercase tracking-widest" style={{ color: "#64748b" }}>
                Step 1 of 3
              </span>
            </div>

            <h1 className="me-heading text-2xl font-bold leading-snug mb-2" style={{ color: "#0c2340", letterSpacing: "-0.02em" }}>
              Who are you getting<br />help for?
            </h1>

            <p className="me-body text-sm mb-7" style={{ color: "#64748b" }}>
              This helps us collect the right information for the patient.
            </p>

            {/* Options */}
            <div className="flex flex-col gap-3">
              {options.map((opt) => {
                const isSelected = selected === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSelected(opt.id)}
                    className="w-full flex items-center gap-4 rounded-xl transition-all active:scale-[0.99]"
                    style={{
                      padding: "18px 20px",
                      backgroundColor: isSelected ? "#f0f7ff" : "#f8fafc",
                      border: `2px solid ${isSelected ? "#1a6fa8" : "#e2eaf3"}`,
                      boxShadow: isSelected ? "0 0 0 3px rgba(26,111,168,0.1)" : "none",
                      textAlign: "left",
                    }}
                    aria-pressed={isSelected}
                  >
                    <span style={{ color: isSelected ? "#1a6fa8" : "#7a9ab5" }}>
                      {opt.icon}
                    </span>
                    <span className="flex-1">
                      <span className="me-heading block text-base font-semibold" style={{ color: isSelected ? "#0c2340" : "#1e3a52" }}>
                        {opt.label}
                      </span>
                      <span className="me-body block text-xs mt-0.5" style={{ color: "#7a9ab5" }}>
                        {opt.sub}
                      </span>
                    </span>
                    <span style={{ color: isSelected ? "#1a6fa8" : "#c7ddf0" }}>
                      <ChevronRight />
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Continue — appears once selected */}
            <div
              className="overflow-hidden transition-all"
              style={{ maxHeight: selected ? 80 : 0, marginTop: selected ? 20 : 0, opacity: selected ? 1 : 0 }}
            >
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
                onClick={onContinue}
              >
                Continue
              </button>
            </div>
          </div>

        </div>
      </main>

      <footer className="text-center py-5">
        <p className="me-body text-xs" style={{ color: "#b0bec5" }}>
          Medical Era · Healthcare platform
        </p>
      </footer>
    </div>
  );
}
