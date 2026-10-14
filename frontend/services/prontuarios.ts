import { API_URL, handleResponse } from "@/services/animais";

export interface ProntuarioBase {
  veterinario: string;
  motivo: string;
  anamnese: string;
  exame_fisico: string;
  diagnostico: string;
  tratamento: string;
  observacoes?: string | null;
}

export interface ProntuarioCreate extends ProntuarioBase {
  animal_id: number;
}

export interface ProntuarioUpdate {
  veterinario?: string;
  motivo?: string;
  anamnese?: string;
  exame_fisico?: string;
  diagnostico?: string;
  tratamento?: string;
  observacoes?: string | null;
  animal_id?: number;
}

export interface ProntuarioResponse extends ProntuarioBase {
  id: number;
  animal_id: number;
  data: string;
  horario: string;
}

export async function listarProntuarios(
  animalId?: number,
  signal?: AbortSignal,
): Promise<ProntuarioResponse[]> {
  const query = animalId ? `?animal_id=${animalId}` : "";
  const response = await fetch(`${API_URL}/prontuarios/${query}`, { signal });

  return handleResponse<ProntuarioResponse[]>(response);
}

export async function obterProntuario(
  id: number,
  signal?: AbortSignal,
): Promise<ProntuarioResponse> {
  const response = await fetch(`${API_URL}/prontuarios/${id}`, { signal });

  return handleResponse<ProntuarioResponse>(response);
}

export async function criarProntuario(
  prontuario: ProntuarioCreate,
): Promise<ProntuarioResponse> {
  const response = await fetch(`${API_URL}/prontuarios/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prontuario),
  });

  return handleResponse<ProntuarioResponse>(response);
}

export async function atualizarProntuario(
  id: number,
  prontuario: ProntuarioUpdate,
): Promise<ProntuarioResponse> {
  const response = await fetch(`${API_URL}/prontuarios/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prontuario),
  });

  return handleResponse<ProntuarioResponse>(response);
}

export async function eliminarProntuario(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/prontuarios/${id}`, {
    method: "DELETE",
  });

  await handleResponse<void>(response);
}
