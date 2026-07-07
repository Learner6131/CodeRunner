import { api } from "../lib/axios";

export async function createSubmission(code: string, language: string) {
  const response = await api.post("/submission", {
    code,
    language,
  });

  return response.data;
}

export async function getSubmission(id: string) {
  const response = await api.get(`/submission/${id}`);

  return response.data;
}
