import {
  API_URL,
  handleResponse,
  type AnimalResponse,
} from "@/services/animais";

export interface TutorBase {
  nome: string;
  email: string;
  telefone?: string | null;
}

export type TutorCreate = TutorBase;

export interface TutorUpdate {
  nome?: string;
  email?: string;
  telefone?: string | null;
}

export interface TutorResponse extends TutorBase {
  id: number;
  telefone: string | null;
  animais: AnimalResponse[];
}

export async function listarTutores(
  signal?: AbortSignal,
): Promise<TutorResponse[]> {
  const response = await fetch(`${API_URL}/tutores/`, { signal });

  return handleResponse<TutorResponse[]>(response);
}

export async function obterTutor(
  id: number,
  signal?: AbortSignal,
): Promise<TutorResponse> {
  const response = await fetch(`${API_URL}/tutores/${id}`, { signal });

  return handleResponse<TutorResponse>(response);
}

export async function criarTutor(
  tutor: TutorCreate,
): Promise<TutorResponse> {
  const response = await fetch(`${API_URL}/tutores/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tutor),
  });

  return handleResponse<TutorResponse>(response);
}

export async function atualizarTutor(
  id: number,
  tutor: TutorUpdate,
): Promise<TutorResponse> {
  const response = await fetch(`${API_URL}/tutores/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tutor),
  });

  return handleResponse<TutorResponse>(response);
}

export async function eliminarTutor(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/tutores/${id}`, {
    method: "DELETE",
  });

  await handleResponse<void>(response);
}
