import { API_URL, handleResponse } from "@/services/animais";

export interface VacinaBase {
  nome: string;
  dose: string;
  data_aplicacao: string;
  proxima_dose?: string | null;
  veterinario: string;
  status: string;
}

export interface VacinaCreate extends VacinaBase {
  animal_id: number;
  catalogo_id?: number | null;
}

export interface VacinaResponse extends VacinaBase {
  id: number;
  animal_id: number;
  catalogo_id?: number | null;
}

export async function listarVacinas(
  animalId?: number,
  signal?: AbortSignal,
): Promise<VacinaResponse[]> {
  const query = animalId ? `?animal_id=${animalId}` : "";
  const response = await fetch(`${API_URL}/vacinas/${query}`, { signal });

  return handleResponse<VacinaResponse[]>(response);
}

export async function criarVacina(
  vacina: VacinaCreate,
): Promise<VacinaResponse> {
  const response = await fetch(`${API_URL}/vacinas/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(vacina),
  });

  return handleResponse<VacinaResponse>(response);
}

export async function eliminarVacina(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/vacinas/${id}`, {
    method: "DELETE",
  });

  await handleResponse<void>(response);
}
