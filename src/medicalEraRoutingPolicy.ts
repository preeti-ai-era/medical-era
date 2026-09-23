import { CLINICAL_DOMAINS } from "./medicalEraDomainConfig";
import type { Answers, DomainHypothesis, MissingInformation, RoutingState, SymptomConcept } from "./medicalEraModels";

export function buildRoutingState(
  complaint: string,
  answers: Answers,
  symptoms: SymptomConcept[],
  domainHypotheses: DomainHypothesis[],
  missingInformation: MissingInformation[],
): RoutingState {
  const primary = domainHypotheses[0];
  const department = primary ? CLINICAL_DOMAINS[primary.domainId].department : null;
  const evidenceIds = symptoms.flatMap((symptom) => symptom.evidenceIds);
  const reason = primary
    ? `The patient-reported information supports ${CLINICAL_DOMAINS[primary.domainId].label} as a workflow domain for staff review.`
    : "The available patient information does not support a specific workflow domain yet.";

  return {
    suggestedDepartment: department,
    domainHypotheses,
    reason,
    evidenceIds,
    missingInformationIds: missingInformation.map((item) => item.id),
    requiresVerification: true,
  };
}
