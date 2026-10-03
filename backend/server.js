require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const { Pool } = require("pg");
const crypto = require("crypto");
const app = express();
const DEMO_DOCTOR_EMAIL =
  process.env.DEMO_DOCTOR_EMAIL || "doctor@medicalera.demo";

const DEMO_DOCTOR_PASSWORD =
  process.env.DEMO_DOCTOR_PASSWORD || "MedicalEra123";

const activeSessions = new Map();

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000;
function createSession() {
  const token = crypto.randomBytes(32).toString("hex");

  activeSessions.set(token, {
    role: "doctor",
    expiresAt: Date.now() + SESSION_DURATION_MS,
  });

  return token;
}

function requireDoctor(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = authHeader.slice(7);
  const session = activeSessions.get(token);

  if (!session || session.expiresAt <= Date.now()) {
    activeSessions.delete(token);
    return res.status(401).json({ message: "Session expired or invalid" });
  }

  if (session.role !== "doctor") {
    return res.status(403).json({ message: "Doctor access required" });
  }

  next();
}
if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is required to start the Medical Era backend.");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : undefined,
});

const allowedOrigins = new Set([
  "https://medical-era-frontend.onrender.com",
  "http://localhost:5173",
]);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.has(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
); 
app.use(express.json());
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body || {};

  if (email !== DEMO_DOCTOR_EMAIL || password !== DEMO_DOCTOR_PASSWORD) {
    return res.status(401).json({
      message: "Invalid doctor credentials",
    });
  }

  const token = createSession();

  return res.json({
    message: "Doctor login successful",
    token,
    role: "doctor",
  });
});
const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS patient_cases (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL DEFAULT '',
      age TEXT NOT NULL DEFAULT '',
      gender TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      complaint TEXT NOT NULL DEFAULT '',
      answers JSONB NOT NULL DEFAULT '{}'::jsonb,
      "uploadedFiles" JSONB NOT NULL DEFAULT '[]'::jsonb,
      "submittedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Reviewed'))
    )
  `);
}

function mapPatientCase(row) {
  return {
    id: Number(row.id),
    name: row.name,
    fullName: row.name,
    age: row.age,
    gender: row.gender,
    phone: row.phone,
    complaint: row.complaint,
    answers: row.answers,
    uploadedFiles: row.uploadedFiles,
    submittedAt: new Date(row.submittedAt).toISOString(),
    status: row.status,
  };
}

// Test backend
app.get("/", (req, res) => {
  res.json({
    message: "Medical Era backend is running",
  });
});

// Patient submits a case
app.post("/api/patient", async (req, res) => {
  try {
    const {
      fullName,
      age,
      gender,
      phone,
      complaint,
      answers,
      uploadedFiles,
    } = req.body || {};

    if (
      typeof fullName !== "string" ||
      fullName.length > 100 ||
      typeof complaint !== "string" ||
      complaint.length > 1000
    ) {
      return res.status(400).json({
        message: "Invalid patient information",
      });
    }

    if (
      typeof phone !== "string" ||
      phone.length > 20 ||
      typeof gender !== "string" ||
      gender.length > 50
    ) {
      return res.status(400).json({
        message: "Invalid patient information",
      });
    }

    if (
      answers !== undefined &&
      (typeof answers !== "object" || Array.isArray(answers))
    ) {
      return res.status(400).json({
        message: "Invalid answers format",
      });
    }

    if (
      uploadedFiles !== undefined &&
      !Array.isArray(uploadedFiles)
    ) {
      return res.status(400).json({
        message: "Invalid uploaded files format",
      });
    }

    const result = await pool.query(
      `
        INSERT INTO patient_cases
          (name, age, gender, phone, complaint, answers, "uploadedFiles", "submittedAt", status)
        VALUES ($1, $2, $3, $4, $5, $6::jsonb, $7::jsonb, $8, 'New')
        RETURNING *
      `,
      [
        req.body.fullName || req.body.name || "",
        req.body.age || "",
        req.body.gender || "",
        req.body.phone || "",
        req.body.complaint || "",
        JSON.stringify(req.body.answers || {}),
        JSON.stringify(req.body.uploadedFiles || []),
        new Date().toISOString(),
      ],
    );

    const patientCase = mapPatientCase(result.rows[0]);
    console.log("Patient case received:", patientCase);

    res.status(201).json({
      message: "Patient data received successfully",
      case: patientCase,
    });
  } catch (error) {
    console.error("Patient case creation error:", error);
    res.status(500).json({ message: "Unable to save patient case" });
  }
});

// Doctor retrieves all patient cases
app.get("/api/patient", requireDoctor, async (req, res) => {  try {
    const result = await pool.query(
      'SELECT * FROM patient_cases ORDER BY "submittedAt" DESC, id DESC',
    );
    res.json({ cases: result.rows.map(mapPatientCase) });
  } catch (error) {
    console.error("Patient case list error:", error);
    res.status(500).json({ message: "Unable to load patient cases" });
  }
});

// Doctor retrieves one patient case
app.get("/api/patient/:id", requireDoctor, async (req, res) => {  try {
    const result = await pool.query(
      "SELECT * FROM patient_cases WHERE id = $1",
      [req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Patient case not found" });
    }

    res.json({ case: mapPatientCase(result.rows[0]) });
  } catch (error) {
    console.error("Patient case lookup error:", error);
    res.status(500).json({ message: "Unable to load patient case" });
  }
});

// Doctor updates a patient case status
app.patch("/api/patient/:id/status", requireDoctor, async (req, res) => {  try {
    const result = await pool.query(
      `
        UPDATE patient_cases
        SET status = $1
        WHERE id = $2
        RETURNING *
      `,
      [req.body.status === "Reviewed" ? "Reviewed" : "New", req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Patient case not found" });
    }

    res.json({ case: mapPatientCase(result.rows[0]) });
  } catch (error) {
    console.error("Patient case status update error:", error);
    res.status(500).json({ message: "Unable to update patient case status" });
  }
});

// AI creates a structured case summary
app.post("/api/ai-summary", requireDoctor, async (req, res) => {  if (!client) {
    return res.status(503).json({
      message: "AI summary is unavailable because OPENAI_API_KEY is not configured on the backend.",
    });
  }

  try {
    const { complaint, answers, uploadedFiles } = req.body;

    const patientInformation = {
      complaint: complaint || "Not provided",
      answers: answers || {},
      uploadedFiles: uploadedFiles || [],
    };

    const response = await client.responses.create({
      model: "gpt-5.6-luna",

      instructions: `
You are the AI information-organizing assistant for Medical Era.

Medical Era follows this principle:

AI prepares → Doctor verifies → Doctor decides → Medical Era communicates.

Your job is ONLY to organize patient-provided information for a doctor.

You MUST NOT:
- diagnose a disease or condition
- prescribe medication
- recommend treatment
- make a clinical decision
- tell the patient they are safe or healthy
- invent information

You MAY:
- organize the patient's information
- summarize the reported complaint
- organize the timeline
- organize reported medicines
- identify missing or unclear information
- flag information that may need doctor review
- explain what patient information caused a flag

Red, orange and green are review-priority labels only.
They are NOT diagnoses.

Green means:
"No priority issue identified from the available information."

It does NOT mean the patient is healthy.

If allergies were not provided, write:
"Not reported"

Do not assume the patient has no allergies.

Every finding must be based only on information provided by the patient.
`,

      input: JSON.stringify(patientInformation),

      text: {
        format: {
          type: "json_schema",
          name: "medical_era_case_summary",
          strict: true,
          schema: {
            type: "object",
            properties: {
              chiefComplaint: {
                type: "string",
              },

              duration: {
                type: "string",
              },

              relevantHistory: {
                type: "string",
              },

              medicines: {
                type: "string",
              },

              allergies: {
                type: "string",
              },

              caseSummary: {
                type: "string",
              },

              priorityFindings: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    level: {
                      type: "string",
                      enum: ["red", "orange", "green"],
                    },

                    finding: {
                      type: "string",
                    },

                    supportingInformation: {
                      type: "string",
                    },

                    whyFlagged: {
                      type: "string",
                    },
                  },

                  required: [
                    "level",
                    "finding",
                    "supportingInformation",
                    "whyFlagged",
                  ],

                  additionalProperties: false,
                },
              },
            },

            required: [
              "chiefComplaint",
              "duration",
              "relevantHistory",
              "medicines",
              "allergies",
              "caseSummary",
              "priorityFindings",
            ],

            additionalProperties: false,
          },
        },
      },
    });

    const aiSummary = JSON.parse(response.output_text);

    res.json({
      message: "AI case summary created successfully",
      summary: aiSummary,
    });
  } catch (error) {
    console.error("AI summary error:", error);

    res.status(500).json({
      message: "Unable to create AI case summary",
      error: error.message,
    });
  }
});

const PORT = process.env.PORT || 5000;

async function startServer() {
  await initializeDatabase();
  app.listen(PORT, () => {
    console.log(`Medical Era backend running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Unable to initialize Medical Era backend:", error);
  process.exitCode = 1;
});
