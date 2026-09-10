# Medical Era

### AI-powered healthcare information organization and doctor review system

Medical Era is a healthcare-focused AI project designed to reduce the time doctors spend collecting, reading, and organizing patient information.

The system allows patients to describe their concerns, answer relevant follow-up questions, and submit supporting information. AI then organizes the submitted information into a structured case summary for doctor review.

## Problem

Doctors can spend significant time collecting and organizing patient information before they can focus on clinical decision-making.

Medical Era aims to reduce this administrative and information-organization workload while keeping the doctor in control of all clinical decisions.

## Solution

Medical Era follows a simple principle:

**AI prepares → Doctor verifies → Doctor decides → Medical Era communicates**

The AI organizes information provided by the patient and prepares it for review. It does not replace the doctor.

## Patient Workflow

1. Patient starts a healthcare check-in.
2. Patient describes the problem in their own words.
3. AI asks relevant follow-up questions.
4. Patient can provide supporting documents or images.
5. Patient reviews and submits the information.
6. The information is sent for doctor review.

## Doctor Workflow

1. Doctor views submitted patient cases.
2. Doctor opens a patient's case.
3. Medical Era presents the patient's submitted information.
4. AI-generated information is organized into an OPD-style draft.
5. AI priority findings help the doctor identify information that may require attention or clarification.
6. Doctor verifies, modifies, dismisses, or adds information.
7. Doctor makes the final clinical decision.
8. Doctor can communicate with the patient when needed.

## Role of AI

The AI is used for:

- Organizing patient-provided information
- Structuring patient history
- Creating an AI-generated case summary
- Highlighting information for doctor review
- Explaining why information was flagged
- Helping reduce repetitive information-organization work

### What the AI does NOT do

Medical Era does not allow the AI to independently:

- Diagnose a patient
- Prescribe medication
- Choose treatment
- Make the final clinical decision
- Replace a doctor

AI-generated information must be reviewed and verified by a healthcare professional.

## Safety Principle

Medical Era is designed around **human-in-the-loop healthcare AI**.

**AI prepares → Doctor verifies → Doctor decides**

Priority labels are review aids, not diagnoses.

For example:

- 🔴 **Priority** — needs doctor review
- 🟠 **Needs clarification**
- 🟢 **No priority issue identified from available information**

A green finding does not mean that a patient is healthy.

## Technology

### Frontend
- React
- TypeScript
- Vite
- Figma Make for initial product prototyping

### Backend
- Node.js
- Express
- REST API

### AI
- OpenAI API
- GPT-5.6 Luna
- Structured AI case summaries

### Development
- Git
- GitHub
- VS Code

## System Flow

```text
Patient
   ↓
Patient information + follow-up answers
   ↓
Medical Era
   ↓
Backend API
   ↓
AI information organization
   ↓
Structured case summary
   ↓
Doctor review
   ↓
Doctor verifies and makes clinical decisions
   ↓
Patient communication when required