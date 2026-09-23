import { isAnswerAllowed, getAllQuestionsForDomains, CLINICAL_DOMAINS } from "./medicalEraDomainConfig";
import type { Answers, FollowUpQuestion, SymptomDomainId } from "./medicalEraModels";

export interface PolicyResult {
  answers: Answers;
  rejectedAnswerIds: string[];
  allowedQuestions: FollowUpQuestion[];
  safetyNotice: string;
}

export function validateAnswers(answers: Answers, questions: FollowUpQuestion[]): PolicyResult {
  const questionMap = new Map(questions.map((question) => [question.id, question]));
  const accepted: Answers = {};
  const rejectedAnswerIds: string[] = [];

  for (const [id, answer] of Object.entries(answers)) {
    const question = questionMap.get(id);
    if (question && isAnswerAllowed(question, answer)) accepted[id] = answer;
    else rejectedAnswerIds.push(id);
  }

  return {
    answers: accepted,
    rejectedAnswerIds,
    allowedQuestions: questions,
    safetyNotice: "This system organizes patient information for workflow review. It does not diagnose, prescribe, recommend treatment, or replace clinician judgment.",
  };
}

export function getPolicyQuestions(domainIds: SymptomDomainId[]): FollowUpQuestion[] {
  return getAllQuestionsForDomains(domainIds).filter((question) =>
    question.domains.some((domain) => domain === "other" || domainIds.includes(domain))
  );
}

export function isAllowedDepartment(department: string): boolean {
  return Object.values(CLINICAL_DOMAINS).some((domain) => domain.department === department);
}
