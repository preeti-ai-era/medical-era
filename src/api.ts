const API_BASE_URL = "https://medical-era.onrender.com";

export type PatientStatus = "New" | "Reviewed";

export type PatientIdentity = {
  fullName: string;
  age: string;
  gender: string;
  phone: string;
};

export async function getPatientCases() {
  const response = await fetch(`${API_BASE_URL}/api/patient`);
  if (!response.ok) {
    throw new Error(`Unable to load patient cases (${response.status})`);
  }
  return response.json();
}

export async function createPatientCase(payload: {
  fullName: string;
  age: string;
  gender: string;
  phone: string;
  complaint: string;
  answers: Record<string, string | string[]>;
  uploadedFiles: Array<{
    category: string;
    file: {
      name: string;
      size: number;
      type?: string;
      lastModified?: number;
    };
  }>;
}) {
  const response = await fetch(`${API_BASE_URL}/api/patient`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Unable to submit patient case (${response.status})`);
  }
  return response.json();
}

export async function updatePatientCaseStatus(
  id: number,
  status: PatientStatus,
) {
  const response = await fetch(`${API_BASE_URL}/api/patient/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(`Unable to update patient case (${response.status})`);
  }
  return response.json();
}

export async function createAISummary(payload: {
  complaint: string;
  answers: Record<string, string | string[]>;
  uploadedFiles: Array<{
    category: string;
    file: {
      name: string;
      size: number;
      type?: string;
      lastModified?: number;
    };
  }>;
}) {
  const response = await fetch(`${API_BASE_URL}/api/ai-summary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Unable to create AI summary (${response.status})`);
  }
  return response.json();
}
