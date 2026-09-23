import { getPolicyQuestions } from "./medicalEraPolicy";
import { CLINICAL_DOMAINS } from "./medicalEraDomainConfig";
import type { Answers, EvidenceItem, FollowUpQuestion, MissingInformation, SymptomDomainId, UncertaintyState } from "./medicalEraModels";

function hasAnswer(answers: Answers, id: string): boolean {
  const value = answers[id];
  return Array.isArray(value) ? value.length > 0 : typeof value === "string" && value.trim().length > 0;
}

export interface FollowUpStateResult {
  candidateQuestions: FollowUpQuestion[];
  missingInformation: MissingInformation[];
  uncertainty: UncertaintyState;
  evidence: EvidenceItem[];
}

export function buildFollowUpState(complaint: string, answers: Answers, askedQuestionIds: string[], domainIds?: SymptomDomainId[]): FollowUpStateResult {
  const domains = domainIds && domainIds.length > 0 ? domainIds : [];
  const activeDomains: SymptomDomainId[] = domains.length > 0 ? domains : ["other"];
  const questions = getPolicyQuestions(activeDomains);
  const missingInformation = activeDomains.flatMap((domainId) => {
    const domain = CLINICAL_DOMAINS[domainId];
    return domain.requiredAnswerIds
      .filter((id) => !hasAnswer(answers, id))
      .map((id) => ({
        id: `${domainId}:${id}`,
        field: id,
        description: `Information needed to organize the ${domain.label} workflow context`,
        importance: "required" as const,
        relatedDomains: [domainId],
        questionIds: [id],
      }));
  }).filter((item, index, all) => all.findIndex((candidate) => candidate.field === item.field) === index);

  const candidateQuestions = questions
    .filter((question) => !askedQuestionIds.includes(question.id) && !hasAnswer(answers, question.id))
    .sort((left, right) => {
      const leftMissing = missingInformation.some((item) => item.questionIds.includes(left.id));
      const rightMissing = missingInformation.some((item) => item.questionIds.includes(right.id));
      return Number(rightMissing) - Number(leftMissing);
    });

  const evidence: EvidenceItem[] = [
    { id: "complaint", sourceType: "patient_text", sourceId: "complaint", quotedText: complaint, reliability: "direct" },
    ...Object.entries(answers).map(([id, value]) => ({ id: `answer:${id}`, sourceType: "patient_answer" as const, sourceId: id, quotedText: Array.isArray(value) ? value.join(", ") : value, reliability: "direct" as const })),
  ];
  const uncertainty: UncertaintyState = {
    level: activeDomains.length > 1 || activeDomains[0] === "other" ? "high" : missingInformation.length > 0 ? "moderate" : "low",
    reasons: activeDomains.length > 1
      ? ["More than one clinical domain may be relevant; staff verification is required."]
      : activeDomains[0] === "other"
        ? ["The complaint is not specific enough to identify a domain; more information is needed."]
        : missingInformation.length > 0
          ? ["Important routing information is still missing; staff verification is required."]
          : [],
    unresolvedQuestionIds: candidateQuestions.map((question) => question.id),
  };

  return { candidateQuestions, missingInformation, uncertainty, evidence };
}
