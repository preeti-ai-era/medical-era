import { CLINICAL_DOMAINS, getAllQuestionsForDomains } from "./medicalEraDomainConfig";
import { buildFollowUpState } from "./medicalEraFollowUpEngine";
import { getPolicyQuestions, validateAnswers } from "./medicalEraPolicy";
import { buildRoutingState } from "./medicalEraRoutingPolicy";
import type {
  Answers,
  FollowUpQuestion,
  PatientContextState,
  PatientUnderstanding,
  SymptomConcept,
  SymptomDomainId,
} from "./medicalEraModels";

export type { Answers, FollowUpQuestion, PatientUnderstanding, SymptomDomainId } from "./medicalEraModels";
export { QUESTION_LABELS } from "./medicalEraDomainConfig";

export function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function answerText(answers: Answers): string {
  return Object.values(answers).flatMap((value) => Array.isArray(value) ? value : [value]).join(" ");
}

function extractConcepts(complaint: string, answers: Answers): SymptomConcept[] {
  const concepts: SymptomConcept[] = [];
  const normalized = normalizeText(`${complaint} ${answerText(answers)}`);

  for (const domain of Object.values(CLINICAL_DOMAINS)) {
    for (const concept of domain.concepts) {
      if (normalized.includes(normalizeText(concept))) {
        const source = normalizeText(complaint).includes(normalizeText(concept)) ? "patient_complaint" : "patient_answer";
        const id = `${domain.id}:${normalizeText(concept).replace(/\s+/g, "-")}`;
        if (!concepts.some((item) => item.id === id)) {
          concepts.push({
            id,
            label: concept,
            patientText: source === "patient_complaint" ? complaint : concept,
            source,
            evidenceIds: [source === "patient_complaint" ? "complaint" : `answer:${id}`],
            certainty: "reported",
          });
        }
      }
    }
  }

  return concepts;
}

export function detectSymptomDomains(complaint: string, answers: Answers = {}) {
  const text = normalizeText(`${complaint} ${answerText(answers)}`);
  const scored = Object.values(CLINICAL_DOMAINS).map((domain) => {
    const supportingConceptIds = domain.concepts
      .filter((concept) => text.includes(normalizeText(concept)))
      .map((concept) => `${domain.id}:${normalizeText(concept).replace(/\s+/g, "-")}`);
    return { domain, score: supportingConceptIds.length, supportingConceptIds };
  }).filter(({ domain, score }) => domain.id === "other" || score > 0);

  const ranked = scored.sort((left, right) => right.score - left.score);
  const highest = ranked.find(({ domain }) => domain.id !== "other")?.score ?? 0;
  return ranked
    .filter(({ domain, score }) => domain.id !== "other" && score > 0)
    .map(({ domain, score, supportingConceptIds }, index) => ({
      domainId: domain.id,
      relevance: index === 0 ? "primary" : score === highest ? "secondary" : "possible",
      confidence: Math.min(0.95, score / Math.max(domain.concepts.length, 1)),
      supportingConceptIds,
    })) as PatientContextState["domainHypotheses"];
}

export function detectSymptomDomain(complaint: string, answers: Answers = {}) {
  const hypotheses = detectSymptomDomains(complaint, answers);
  const id = hypotheses[0]?.domainId ?? "other";
  return { ...CLINICAL_DOMAINS[id], questions: getAllQuestionsForDomains([id]) };
}

export function buildPatientContext(complaint: string, answers: Answers = {}, askedQuestionIds: string[] = []): PatientContextState {
  const symptoms = extractConcepts(complaint, answers);
  const domainHypotheses = detectSymptomDomains(complaint, answers);
  const selectedDomains: SymptomDomainId[] = domainHypotheses.length > 0 ? domainHypotheses.map((item) => item.domainId) : ["other"];
    const policy = validateAnswers(answers, getPolicyQuestions(selectedDomains));
    const followUp = buildFollowUpState(complaint, policy.answers, askedQuestionIds, selectedDomains);
    const routing = buildRoutingState(complaint, policy.answers, symptoms, domainHypotheses, followUp.missingInformation);
  return {
    originalComplaint: complaint,
    symptoms,
      answers: policy.answers,
    askedQuestionIds,
    candidateQuestions: followUp.candidateQuestions,
    domainHypotheses,
    missingInformation: followUp.missingInformation,
    routing,
    uncertainty: followUp.uncertainty,
    evidence: followUp.evidence,
    contextVersion: 1,
  };
}

export function getRelevantQuestions(complaint: string, answers: Answers = {}): FollowUpQuestion[] {
  return buildPatientContext(complaint, answers).candidateQuestions;
}

export function getNextFollowUpQuestion(complaint: string, answers: Answers = {}, askedQuestionIds: string[] = []): FollowUpQuestion | null {
  return buildPatientContext(complaint, answers, askedQuestionIds).candidateQuestions[0] ?? null;
}

export function buildPatientUnderstanding(complaint: string, answers: Answers = {}): PatientUnderstanding {
  const context = buildPatientContext(complaint, answers);
  const moreInformationNeeded = context.missingInformation.length > 0 || context.domainHypotheses.length === 0;
  const confidence = context.uncertainty.level === "high" ? "limited" : moreInformationNeeded ? "moderate" : "higher";
  return {
    originalComplaint: complaint,
    symptoms: context.symptoms,
    answers,
    askedQuestionIds: [],
    candidateQuestions: context.candidateQuestions,
    domainHypotheses: context.domainHypotheses,
    missingInformation: context.missingInformation,
    routing: context.routing,
    uncertainty: context.uncertainty,
    evidence: context.evidence,
    moreInformationNeeded,
    confidence,
    confidenceText: context.uncertainty.reasons.join(" ") || "The structured information is available for clinician/staff verification.",
  };
}
