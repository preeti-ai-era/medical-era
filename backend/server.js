require("dotenv").config();

const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

let latestPatientCase = null;

// Test backend
app.get("/", (req, res) => {
  res.json({
    message: "Medical Era backend is running",
  });
});

// Patient submits a case
app.post("/api/patient", (req, res) => {
  latestPatientCase = {
    ...req.body,
    submittedAt: new Date().toISOString(),
  };

  console.log("Patient case received:", latestPatientCase);

  res.json({
    message: "Patient data received successfully",
    case: latestPatientCase,
  });
});

// Doctor retrieves the latest patient case
app.get("/api/patient/latest", (req, res) => {
  res.json({
    case: latestPatientCase,
  });
});

// AI creates a structured case summary
app.post("/api/ai-summary", async (req, res) => {
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

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `Medical Era backend running on http://localhost:${PORT}`
  );
});