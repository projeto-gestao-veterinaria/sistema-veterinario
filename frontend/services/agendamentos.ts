import {
  API_URL,
  handleResponse,
  type AnimalResponse,
} from "@/services/animais";

export interface AgendamentoBase {
  data: string;
  horario: string;
  anotacoes: string;
  animal_id: number;
}

export type AgendamentoCreate = AgendamentoBase;

export interface AgendamentoUpdate {
  data?: string;
  horario?: string;
  anotacoes?: string;
  animal_id?: number;
}

export interface AgendamentoResponse extends AgendamentoBase {
  id: number;
  animal: AnimalResponse;
}

export async function listarAgendamentos(
  signal?: AbortSignal,
): Promise<AgendamentoResponse[]> {
  const response = await fetch(`${API_URL}/agendamentos/`, { signal });

  return handleResponse<AgendamentoResponse[]>(response);
}

export async function obterAgendamento(
  id: number,
  signal?: AbortSignal,
): Promise<AgendamentoResponse> {
  const response = await fetch(`${API_URL}/agendamentos/${id}`, { signal });

  return handleResponse<AgendamentoResponse>(response);
}

export async function criarAgendamento(
  agendamento: AgendamentoCreate,
): Promise<AgendamentoResponse> {
  const response = await fetch(`${API_URL}/agendamentos/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(agendamento),
  });

  return handleResponse<AgendamentoResponse>(response);
}

export async function atualizarAgendamento(
  id: number,
  agendamento: AgendamentoUpdate,
): Promise<AgendamentoResponse> {
  const response = await fetch(`${API_URL}/agendamentos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(agendamento),
  });

  return handleResponse<AgendamentoResponse>(response);
}

export async function eliminarAgendamento(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/agendamentos/${id}`, {
    method: "DELETE",
  });

  await handleResponse<void>(response);
}
