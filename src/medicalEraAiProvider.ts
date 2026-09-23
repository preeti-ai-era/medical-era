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
