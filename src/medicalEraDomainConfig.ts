import type { AnswerType, Answers, SymptomDomainId } from "./medicalEraModels";

export interface FollowUpQuestionConfig {
  id: string;
  text: string;
  hint?: string;
  type: AnswerType;
  options?: string[];
  domains: SymptomDomainId[];
  requiredForRouting?: boolean;
}

export interface ClinicalDomainConfig {
  id: SymptomDomainId;
  label: string;
  department: string;
  concepts: string[];
  questions: FollowUpQuestionConfig[];
  requiredAnswerIds: string[];
  routingExplanation: string;
}

const commonQuestions: FollowUpQuestionConfig[] = [
  { id: "onset", text: "When did this problem start?", type: "single", options: ["Today", "Yesterday", "2–3 days ago", "More than 3 days ago", "I'm not sure"], domains: ["other"], requiredForRouting: true },
  { id: "trend", text: "Has it become better, worse, or stayed the same since it started?", type: "single", options: ["Getting better", "Getting worse", "About the same", "It comes and goes"], domains: ["other"], requiredForRouting: true },
  { id: "severity", text: "How severe is it right now?", type: "single", options: ["Mild — manageable", "Moderate — affecting my routine", "Severe — hard to function"], domains: ["other"], requiredForRouting: true },
  { id: "medicines", text: "Are you currently taking any medicines for this problem?", hint: "Include any tablets, drops, or home remedies you have tried.", type: "single", options: ["Yes", "No", "I tried something but I'm not sure what it was"], domains: ["other"] },
  { id: "allergies", text: "Do you have any known allergies?", hint: "Include medicine, food, or other allergies, or choose none known.", type: "single", options: ["No known allergies", "Yes, I will describe them", "I'm not sure"], domains: ["other"] },
];

const domainQuestions: Record<SymptomDomainId, FollowUpQuestionConfig[]> = {
  ophthalmology: [
    { id: "eye_side", text: "Is the problem in one eye or both?", type: "single", options: ["One eye", "Both eyes", "I'm not sure"], domains: ["ophthalmology"], requiredForRouting: true },
    { id: "vision_change", text: "Has your vision changed?", type: "single", options: ["No change", "Blurred", "Reduced", "Double vision", "I'm not sure"], domains: ["ophthalmology"], requiredForRouting: true },
    { id: "eye_associated", text: "Are there redness, discharge, or sensitivity to light?", type: "multi", options: ["Redness", "Discharge", "Sensitivity to light", "None of these"], domains: ["ophthalmology"] },
  ],
  gastroenterology: [
    { id: "abdominal_location", text: "Where exactly is the discomfort?", type: "text", hint: "For example, upper abdomen, lower abdomen, or one side.", domains: ["gastroenterology"], requiredForRouting: true },
    { id: "abdominal_pattern", text: "What pattern does it follow?", type: "single", options: ["Constant", "Comes and goes", "Related to eating", "I'm not sure"], domains: ["gastroenterology"], requiredForRouting: true },
    { id: "gastro_associated", text: "Which other symptoms are present?", type: "multi", options: ["Nausea", "Vomiting", "Diarrhea", "Constipation", "Blood in stool or vomit", "None of these"], domains: ["gastroenterology"] },
  ],
  ent: [
    { id: "ent_area", text: "Which area is affected?", type: "single", options: ["Ear", "Nose", "Throat", "More than one area", "I'm not sure"], domains: ["ent"], requiredForRouting: true },
    { id: "ent_associated", text: "Which associated symptoms are present?", type: "multi", options: ["Hearing change", "Discharge", "Blocked nose", "Fever", "None of these"], domains: ["ent"] },
  ],
  dermatology: [
    { id: "skin_location", text: "Where is the skin problem?", type: "text", domains: ["dermatology"], requiredForRouting: true },
    { id: "skin_pattern", text: "How has the skin problem changed?", type: "single", options: ["Staying in one area", "Spreading", "Comes and goes", "I'm not sure"], domains: ["dermatology"], requiredForRouting: true },
    { id: "skin_features", text: "What does it feel like?", type: "multi", options: ["Itchy", "Painful", "Blistered", "Swollen", "None of these"], domains: ["dermatology"] },
  ],
  orthopedics: [
    { id: "musculoskeletal_location", text: "Where exactly is the pain or movement problem?", type: "text", domains: ["orthopedics"], requiredForRouting: true },
    { id: "musculoskeletal_trigger", text: "Did it start after an injury or unusual activity?", type: "single", options: ["After an injury", "After unusual activity", "Without either", "I'm not sure"], domains: ["orthopedics"], requiredForRouting: true },
    { id: "musculoskeletal_function", text: "Is movement or bearing weight limited?", type: "single", options: ["Yes", "No", "I'm not sure"], domains: ["orthopedics"] },
  ],
  cardiology: [
    { id: "chest_pattern", text: "When does the chest symptom occur?", type: "single", options: ["With activity", "At rest", "Both", "I'm not sure"], domains: ["cardiology"], requiredForRouting: true },
    { id: "cardiac_associated", text: "Which associated symptoms are present?", type: "multi", options: ["Shortness of breath", "Palpitations", "Dizziness or fainting", "None of these"], domains: ["cardiology"], requiredForRouting: true },
  ],
  neurology: [
    { id: "neurologic_pattern", text: "Which pattern best describes the problem?", type: "multi", options: ["Headache", "Weakness", "Numbness or tingling", "Confusion", "None of these"], domains: ["neurology"], requiredForRouting: true },
    { id: "neurologic_onset", text: "Did it begin suddenly or gradually?", type: "single", options: ["Suddenly", "Gradually", "Comes and goes", "I'm not sure"], domains: ["neurology"], requiredForRouting: true },
  ],
  urology: [
    { id: "urinary_features", text: "Which urinary symptoms are present?", type: "multi", options: ["Burning or pain", "Frequent urination or urgency", "Blood in urine", "Lower abdominal or side pain", "None of these"], domains: ["urology"], requiredForRouting: true },
    { id: "urinary_onset", text: "When did the urinary problem start?", type: "single", options: ["Today", "Within the last few days", "More than a week ago", "I'm not sure"], domains: ["urology"], requiredForRouting: true },
  ],
  gynecology: [
    { id: "gynecologic_features", text: "Which symptoms are present?", type: "multi", options: ["Pelvic pain", "Bleeding", "Discharge", "Pregnancy concern", "None of these"], domains: ["gynecology"], requiredForRouting: true },
    { id: "gynecologic_onset", text: "When did this problem start?", type: "single", options: ["Today", "Within the last few days", "More than a week ago", "I'm not sure"], domains: ["gynecology"], requiredForRouting: true },
  ],
  "general-medicine": [
    { id: "general_associated", text: "Which other symptoms are present?", type: "multi", options: ["Fever", "Fatigue or weakness", "Body aches", "Cough or breathing problem", "None of these"], domains: ["general-medicine"] },
  ],
  other: [
    { id: "problem_area", text: "Which area of the body is affected?", type: "text", domains: ["other"], requiredForRouting: true },
    { id: "other_associated", text: "Are there other symptoms you want to mention?", type: "text", domains: ["other"] },
  ],
};

const definitions: Record<SymptomDomainId, Omit<ClinicalDomainConfig, "questions">> = {
  ophthalmology: { id: "ophthalmology", label: "Ophthalmology", department: "Ophthalmology", concepts: ["eye", "vision", "blurred", "red eye", "eye pain", "floaters", "light sensitivity", "double vision"], requiredAnswerIds: ["eye_side", "vision_change"], routingExplanation: "The patient reported eye or vision-related information." },
  gastroenterology: { id: "gastroenterology", label: "Gastroenterology", department: "Gastroenterology / General Medicine", concepts: ["stomach", "abdominal", "belly", "nausea", "vomiting", "diarrhea", "constipation", "acid reflux", "pain after eating"], requiredAnswerIds: ["abdominal_location", "abdominal_pattern"], routingExplanation: "The patient reported abdominal or digestive information." },
  ent: { id: "ent", label: "ENT", department: "ENT", concepts: ["ear", "hearing", "sore throat", "throat", "runny nose", "blocked nose", "sinus", "voice"], requiredAnswerIds: ["ent_area"], routingExplanation: "The patient reported ear, nose, or throat information." },
  dermatology: { id: "dermatology", label: "Dermatology", department: "Dermatology", concepts: ["rash", "itching", "skin", "hives", "blister", "red spot", "swelling"], requiredAnswerIds: ["skin_location", "skin_pattern"], routingExplanation: "The patient reported skin-related information." },
  orthopedics: { id: "orthopedics", label: "Orthopedics", department: "Orthopedics", concepts: ["joint", "knee", "back", "ankle", "muscle", "wrist", "limb", "bone", "injury"], requiredAnswerIds: ["musculoskeletal_location", "musculoskeletal_trigger"], routingExplanation: "The patient reported bone, joint, muscle, or injury-related information." },
  cardiology: { id: "cardiology", label: "Cardiology", department: "Cardiology / appropriate medical evaluation", concepts: ["chest pain", "palpitations", "shortness of breath", "chest tightness", "heart racing"], requiredAnswerIds: ["chest_pattern", "cardiac_associated"], routingExplanation: "The patient reported chest or cardiovascular-related information." },
  neurology: { id: "neurology", label: "Neurology", department: "Neurology", concepts: ["headache", "dizziness", "weakness", "numbness", "tingling", "seizure", "confusion"], requiredAnswerIds: ["neurologic_pattern", "neurologic_onset"], routingExplanation: "The patient reported neurological information." },
  urology: { id: "urology", label: "Urology", department: "Urology", concepts: ["urinary", "urination", "burning urination", "blood in urine", "bladder", "pelvic"], requiredAnswerIds: ["urinary_features", "urinary_onset"], routingExplanation: "The patient reported urinary or bladder-related information." },
  gynecology: { id: "gynecology", label: "Gynecology", department: "Obstetrics & Gynecology", concepts: ["pelvic", "period", "vaginal", "pregnancy", "discharge", "bleeding"], requiredAnswerIds: ["gynecologic_features", "gynecologic_onset"], routingExplanation: "The patient reported gynecologic or reproductive information." },
  "general-medicine": { id: "general-medicine", label: "General Medicine", department: "General Medicine", concepts: ["fever", "illness", "fatigue", "body ache", "malaise", "general discomfort"], requiredAnswerIds: ["general_associated"], routingExplanation: "The patient reported general medical information without a more specific domain." },
  other: { id: "other", label: "Other / unclear", department: "Department unclear — additional information needed", concepts: [], requiredAnswerIds: ["problem_area"], routingExplanation: "The available patient information is not specific enough to suggest a domain." },
};

export const CLINICAL_DOMAINS: Record<SymptomDomainId, ClinicalDomainConfig> = Object.fromEntries(
  Object.entries(definitions).map(([id, definition]) => [id, { ...definition, questions: [...commonQuestions, ...domainQuestions[id as SymptomDomainId]] }])
) as Record<SymptomDomainId, ClinicalDomainConfig>;

export const QUESTION_LABELS: Record<string, string> = {
  onset: "When it started",
  trend: "How it has changed",
  severity: "Current severity",
  medicines: "Medicines taken",
  allergies: "Known allergies",
};

export function getAllQuestionsForDomains(domainIds: SymptomDomainId[]): FollowUpQuestionConfig[] {
  const questions = domainIds.flatMap((id) => CLINICAL_DOMAINS[id].questions);
  return questions.filter((question, index, all) => all.findIndex((candidate) => candidate.id === question.id) === index);
}

export function isAnswerAllowed(question: FollowUpQuestionConfig, answer: Answers[string]): boolean {
  if (question.type === "multi") return Array.isArray(answer) && answer.every((value) => question.options?.includes(value));
  if (typeof answer !== "string") return false;
  return question.type === "text" || !question.options || question.options.includes(answer);
}
