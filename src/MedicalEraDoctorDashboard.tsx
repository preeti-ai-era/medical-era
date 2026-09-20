import { useEffect, useState } from "react";

const PATIENT_CASES_URL = "https://medical-era.onrender.com/api/patient";

export type PatientCase = {
  id: number;
  name?: string;
  fullName?: string;
  age?: number | string;
  gender?: string;
  phone?: string;
  complaint?: string;
  answers?: Record<string, string | string[]>;
  uploadedFiles?: unknown[];
  submittedAt?: string;
  status: "New" | "Reviewed";
};

function CrossIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" aria-hidden="true">
      <rect x="9" y="2" width="6" height="20" rx="2" fill="currentColor" />
      <rect x="2" y="9" width="20" height="6" rx="2" fill="currentColor" />
    </svg>
  );
}

export default function MedicalEraDoctorDashboard({
  onReviewCase,
  caseStatus: _caseStatus,
}: {
  onReviewCase?: (patientCase: PatientCase) => void;
  caseStatus?: "New" | "Reviewed";
}) {
  const [cases, setCases] = useState<PatientCase[]>([]);
  const [activeTab, setActiveTab] = useState<"All" | "New" | "Reviewed">("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadCases() {
      try {
        const response = await fetch(PATIENT_CASES_URL);
        if (!response.ok) {
          throw new Error(`Unable to load patient cases (${response.status})`);
        }
        const data: { cases?: PatientCase[] } = await response.json();
        if (!cancelled) {
          setCases(data.cases || []);
          setError("");
        }
      } catch (loadError) {
        if (!cancelled) {
          console.error("Unable to load patient cases:", loadError);
          setError("Unable to load patient cases right now.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadCases();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredCases = activeTab === "All"
    ? cases
    : cases.filter((patientCase) => patientCase.status === activeTab);
  const newCount = cases.filter((patientCase) => patientCase.status === "New").length;
  const reviewedCount = cases.filter((patientCase) => patientCase.status === "Reviewed").length;

  return (
    <div
      className="min-h-full flex flex-col"
      style={{ fontFamily: "'Inter','DM Sans',system-ui,sans-serif", backgroundColor: "#eef3f8" }}
    >
      <style>{`
        .me-body { font-family: 'Inter', system-ui, sans-serif; }
        .me-heading { font-family: 'DM Sans', system-ui, sans-serif; }
        ::-webkit-scrollbar { display: none; }
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

        {/* Page title + stats row */}
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <h1 className="me-heading text-2xl font-bold" style={{ color: "#0c2340", letterSpacing: "-0.02em" }}>
              Patient Cases
            </h1>
            <p className="me-body text-sm mt-0.5" style={{ color: "#64748b" }}>
              Submitted today · {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <div className="flex gap-3">
            <div
              className="rounded-xl px-4 py-3 text-center"
              style={{ backgroundColor: "white", border: "1px solid #e2eaf3", minWidth: 72 }}
            >
              <p className="me-heading text-xl font-bold" style={{ color: "#1a6fa8" }}>{newCount}</p>
              <p className="me-body text-xs" style={{ color: "#94a3b8" }}>New</p>
            </div>
            <div
              className="rounded-xl px-4 py-3 text-center"
              style={{ backgroundColor: "white", border: "1px solid #e2eaf3", minWidth: 72 }}
            >
              <p className="me-heading text-xl font-bold" style={{ color: "#0c2340" }}>{cases.length}</p>
              <p className="me-body text-xs" style={{ color: "#94a3b8" }}>Total</p>
            </div>
            <div
              className="rounded-xl px-4 py-3 text-center"
              style={{ backgroundColor: "white", border: "1px solid #e2eaf3", minWidth: 72 }}
            >
              <p className="me-heading text-xl font-bold" style={{ color: "#15803d" }}>{reviewedCount}</p>
              <p className="me-body text-xs" style={{ color: "#94a3b8" }}>Reviewed</p>
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-5">
          {["All", "New", "Reviewed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "All" | "New" | "Reviewed")}
              className="me-body text-sm font-medium px-4 py-1.5 rounded-full transition-colors"
              style={{
                backgroundColor: activeTab === tab ? "#1a6fa8" : "white",
                color: activeTab === tab ? "white" : "#64748b",
                border: "1px solid",
                borderColor: activeTab === tab ? "#1a6fa8" : "#e2eaf3",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Case list */}
        <div className="flex flex-col gap-4">
          {filteredCases.map((patientCase) => {
            const patientName = patientCase.name || patientCase.fullName || "Patient";
            const initials = patientName
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
            <div
              key={patientCase.id}
              className="rounded-2xl p-6"
              style={{
                backgroundColor: "white",
                border: "1px solid #e2eaf3",
                boxShadow: "0 2px 8px rgba(10,40,80,0.06)",
              }}
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
                    style={{ backgroundColor: "#f0f7ff", color: "#1a6fa8" }}
                  >
                    {initials}
                  </div>
                  <div>
                    <p className="me-heading font-semibold text-base" style={{ color: "#0c2340" }}>
                      {patientName}
                    </p>
                    <p className="me-body text-xs" style={{ color: "#94a3b8" }}>
                      {patientCase.age !== undefined && patientCase.age !== "" ? `Age ${patientCase.age}` : "Age not provided"}
                    </p>
                  </div>
                </div>
                <span
                  className="me-body text-xs font-semibold px-2.5 py-1 rounded-full shrink-0"
                  style={patientCase.status === "Reviewed"
                    ? { backgroundColor: "#dcfce7", color: "#15803d" }
                    : { backgroundColor: "#fef9c3", color: "#854d0e" }}
                >
                  {patientCase.status}
                </span>
              </div>

              {/* Complaint */}
              <div
                className="rounded-xl px-4 py-3 mb-4"
                style={{ backgroundColor: "#f8fafc", border: "1px solid #e2eaf3" }}
              >
                <p className="me-body text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#94a3b8" }}>
                  Main complaint
                </p>
                <p className="me-body text-sm leading-relaxed" style={{ color: "#1e3a52" }}>
                  {patientCase.complaint || "No complaint provided."}
                </p>
              </div>

              {/* Bottom row */}
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <svg viewBox="0 0 16 16" fill="none" className="w-3.5 h-3.5" style={{ color: "#94a3b8" }} aria-hidden="true">
                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.3" />
                    <path d="M8 5v3.5l2 1.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="me-body text-xs" style={{ color: "#94a3b8" }}>
                    Submitted {patientCase.submittedAt ? new Date(patientCase.submittedAt).toLocaleString("en-IN") : "Unknown"}
                  </p>
                </div>
                <button
                  className="me-body text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
                  style={{
                    backgroundColor: "#1a6fa8",
                    color: "white",
                    boxShadow: "0 2px 8px rgba(26,111,168,0.25)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#155e90")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1a6fa8")}
                  onClick={() => onReviewCase?.(patientCase)}
                >
                  Review case
                </button>

              </div>
            </div>
            );
          })}
        </div>

        {/* Empty-state hint below the list */}
        <p className="me-body text-xs text-center mt-8" style={{ color: error ? "#b45309" : "#c7ddf0" }}>
          {loading ? "Loading patient cases…" : error || (filteredCases.length === 0 ? "No patient cases in this category." : "New patient submissions will appear here automatically.")}
        </p>
      </main>

      <footer className="text-center py-5">
        <p className="me-body text-xs" style={{ color: "#b0bec5" }}>Medical Era · Doctor Dashboard</p>
      </footer>
    </div>
  );
}
