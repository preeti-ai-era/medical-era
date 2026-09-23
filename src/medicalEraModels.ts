export type AnswerValue = string | string[];
export type Answers = Record<string, AnswerValue>;
export type AnswerType = "single" | "multi" | "text";

export type SymptomDomainId =
  | "ophthalmology"
  | "gastroenterology"
  | "ent"
  | "dermatology"
  | "orthopedics"
  | "cardiology"
  | "neurology"
  | "urology"
  | "gynecology"
  | "general-medicine"
  | "other";

export interface FollowUpQuestion {
  id: string;
  text: string;
  hint?: string;
  type: AnswerType;
  options?: string[];
  domains: SymptomDomainId[];
  requiredForRouting?: boolean;
}

export interface SymptomConcept {
  id: string;
  label: string;
  patientText: string;
  source: "patient_complaint" | "patient_answer" | "ai_interpretation";
  evidenceIds: string[];
  certainty: "reported" | "uncertain" | "denied";
}

export interface EvidenceItem {
  id: string;
  sourceType: "patient_text" | "patient_answer" | "uploaded_file" | "system_rule" | "doctor_input";
  sourceId: string;
  quotedText?: string;
  reliability: "direct" | "interpreted" | "inferred";
}

export interface DomainHypothesis {
  domainId: SymptomDomainId;
  relevance: "primary" | "secondary" | "possible";
  confidence: number;
  supportingConceptIds: string[];
}

export interface MissingInformation {
  id: string;
  field: string;
  description: string;
  importance: "required" | "helpful" | "optional";
  relatedDomains: SymptomDomainId[];
  questionIds: string[];
}

export interface RoutingState {
  suggestedDepartment: string | null;
  domainHypotheses: DomainHypothesis[];
  reason: string;
  evidenceIds: string[];
  missingInformationIds: string[];
  requiresVerification: true;
}

export interface UncertaintyState {
  level: "low" | "moderate" | "high";
  reasons: string[];
  unresolvedQuestionIds: string[];
}

export interface PatientUnderstanding {
  originalComplaint: string;
  symptoms: SymptomConcept[];
  answers: Answers;
  askedQuestionIds: string[];
  candidateQuestions: FollowUpQuestion[];
  domainHypotheses: DomainHypothesis[];
  missingInformation: MissingInformation[];
  routing: RoutingState;
  uncertainty: UncertaintyState;
  evidence: EvidenceItem[];
  moreInformationNeeded: boolean;
  confidence: "higher" | "moderate" | "limited";
  confidenceText: string;
}

export interface PatientContextState {
  caseId?: string;
  originalComplaint: string;
  symptoms: SymptomConcept[];
  answers: Answers;
  askedQuestionIds: string[];
  candidateQuestions: FollowUpQuestion[];
  domainHypotheses: DomainHypothesis[];
  missingInformation: MissingInformation[];
  routing: RoutingState;
  uncertainty: UncertaintyState;
  evidence: EvidenceItem[];
  contextVersion: number;
}
