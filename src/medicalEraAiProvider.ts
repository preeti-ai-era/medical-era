import type { Answers, PatientContextState, SymptomConcept, UncertaintyState } from "./medicalEraModels";

export interface AiUnderstandingRequest {
  complaint: string;
  answers: Answers;
  currentContext?: PatientContextState;
}

export interface AiUnderstandingResult {
  concepts: SymptomConcept[];
  uncertainty: UncertaintyState;
  candidateQuestionIds: string[];
  provider: "deterministic-fallback" | "llm";
}

export interface LocalEducationalResponse {
  answer: string;
  caveat: string;
}

const LOCAL_EDUCATIONAL_RESPONSES: Array<{ matches: string[]; response: LocalEducationalResponse }> = [
  {
    matches: ["glaucoma"],
    response: {
      answer: "Glaucoma is a group of eye conditions that can damage the optic nerve, often in association with pressure-related stress inside the eye. It may develop gradually without noticeable symptoms, which is why regular eye examinations are important.",
      caveat: "This is educational reference information, not a diagnosis or medical advice. An eye-care professional must assess symptoms, eye pressure, and the optic nerve for an individual.",
    },
  },
  {
    matches: ["cataract"],
    response: {
      answer: "A cataract is a clouding of the eye's natural lens that can make vision hazy, reduce contrast, or increase glare. Cataracts commonly develop gradually over time.",
      caveat: "This is educational reference information, not a diagnosis or medical advice. Persistent or changing vision should be assessed by an eye-care professional.",
    },
  },
  {
    matches: ["myopia", "short sight", "short-sight", "nearsighted"],
    response: {
      answer: "Myopia, also called short-sightedness, is a focusing condition in which distant objects appear less clear because light focuses in front of the retina rather than directly on it.",
      caveat: "This is educational reference information, not a diagnosis or medical advice. An eye examination is needed to determine an individual's prescription and eye health.",
    },
  },
];

export function getLocalEducationalResponse(question: string): LocalEducationalResponse {
  const normalizedQuestion = question.trim().toLowerCase();
  const match = LOCAL_EDUCATIONAL_RESPONSES.find(({ matches }) => matches.some((term) => normalizedQuestion.includes(term)));

  return match?.response ?? {
    answer: "Grove does not have a verified local reference answer for that question yet. It can provide general educational context when a topic is covered, but it should not guess.",
    caveat: "This is educational reference information, not a diagnosis or medical advice. For personal concerns, speak with a qualified healthcare professional.",
  };
}

export interface MedicalEraAiProvider {
  understand(request: AiUnderstandingRequest): Promise<AiUnderstandingResult>;
}

export class DeterministicFallbackProvider implements MedicalEraAiProvider {
  async understand(request: AiUnderstandingRequest): Promise<AiUnderstandingResult> {
    return {
      concepts: request.currentContext?.symptoms ?? [],
      uncertainty: request.currentContext?.uncertainty ?? {
        level: "high",
        reasons: ["No external AI provider is configured; deterministic workflow support is being used."],
        unresolvedQuestionIds: [],
      },
      candidateQuestionIds: request.currentContext?.candidateQuestions.map((question) => question.id) ?? [],
      provider: "deterministic-fallback",
    };
  }
}

export class BackendLlmProvider implements MedicalEraAiProvider {
  constructor(private readonly endpoint: string) {}

  async understand(request: AiUnderstandingRequest): Promise<AiUnderstandingResult> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) throw new Error(`AI understanding request failed with status ${response.status}`);
    const result = await response.json() as AiUnderstandingResult;
    return { ...result, provider: "llm" };
  }
}

export function createMedicalEraAiProvider(): MedicalEraAiProvider {
  const endpoint = import.meta.env.VITE_MEDICAL_ERA_AI_ENDPOINT;
  return endpoint ? new BackendLlmProvider(endpoint) : new DeterministicFallbackProvider();
}
