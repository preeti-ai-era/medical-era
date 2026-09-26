# Medical Era

### AI-assisted healthcare workflow for collecting, organizing, and reviewing patient information.

Medical Era is a healthcare technology prototype designed around one principle:

> **AI prepares → Doctor verifies → Doctor decides → Medical Era communicates.**

The goal is to reduce the repetitive work involved in collecting and organizing patient information while keeping clinical decisions under human control.

## Live Demo

https://medical-era-frontend.onrender.com

## The Problem

Doctors can spend significant time collecting, reading, and organizing information before they can focus on the clinical decision itself.

Medical Era explores how AI can assist with the information-gathering and organization layer without replacing the healthcare professional.

## What Medical Era Does

### Patient workflow

1. Patient describes their problem in their own words.
2. AI-assisted follow-up questions collect relevant information.
3. Patient can provide additional information and documents.
4. The information is organized into a structured case.
5. The case is submitted to the doctor.

### AI-assisted reasoning

Medical Era can organize submitted information into:

- Detected symptom domain
- Suggested clinical department
- Reason for routing
- Information supporting the suggestion
- Missing information
- Relevant follow-up questions
- AI Priority Findings

The system is designed to show **why information was flagged**, rather than presenting an unexplained conclusion.

### Doctor workflow

The doctor can:

- Review the submitted patient information
- Review the AI-generated case organization
- Review AI Priority Findings
- Confirm, modify, or dismiss findings
- Add clinical notes
- Contact the patient
- Mark the case as reviewed

The doctor remains responsible for clinical interpretation and decisions.

## Safety Principle

Medical Era is designed as an **AI-assisted workflow**, not an autonomous clinical decision-maker.

The AI does not independently:

- Diagnose
- Prescribe medication
- Recommend treatment
- Make final clinical decisions

AI-generated information must be reviewed by the healthcare professional.

## AI Architecture

The intended architecture separates AI interpretation from safety and workflow controls:

Patient information
        ↓
AI interpretation
        ↓
Information extraction & organization
        ↓
Relevant domain detection
        ↓
Adaptive follow-up questions
        ↓
Structured patient information
        ↓
Suggested department
        ↓
AI Priority Findings
        ↓
Doctor verification
        ↓
Doctor decision

This separation helps keep the AI useful while maintaining human oversight.

## Current Prototype

The current prototype demonstrates:

- Patient intake
- AI-assisted follow-up
- Patient information collection
- Document information handling
- Doctor dashboard
- Case review
- AI-generated OPD draft
- AI Priority Findings
- Domain and department suggestion
- Doctor actions
- Patient communication options
- Case review status persistence
- Grove educational/search experience

## Grove

Medical Era also includes **Grove**, an educational healthcare knowledge interface with:

- Notes
- Books
- Medicines
- Ward references
- Search
- Agent

Grove is designed to provide educational information while clearly distinguishing educational content from patient-specific clinical decision-making.

## Technology

- React
- TypeScript
- Vite
- Node.js
- Express
- PostgreSQL
- Render
- GitHub

## Project Structure

```text
Medical Era
├── frontend
│   ├── Patient workflow
│   ├── Doctor workflow
│   ├── AI-assisted follow-up
│   ├── Case review
│   └── Grove
│
└── backend
    ├── Patient case API
    ├── Case persistence
    └── Review status
