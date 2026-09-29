export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface AnimalBase {
  nome: string;
  especie: string;
  raca?: string | null;
  data_nascimento?: string | null;
}

export interface AnimalCreate extends AnimalBase {
  tutor_id: number;
}

export interface AnimalUpdate {
  nome?: string;
  especie?: string;
  raca?: string | null;
  data_nascimento?: string | null;
  tutor_id?: number;
}

export interface AnimalResponse extends AnimalBase {
  id: number;
  tutor_id: number;
  raca: string | null;
  data_nascimento: string | null;
}

export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let message = `Erro ${response.status}`;

    try {
      const body = (await response.json()) as { detail?: unknown };

      if (typeof body.detail === "string") {
        message = body.detail;
      }
    } catch {
      message = `Erro ${response.status}`;
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export async function listarAnimais(
  signal?: AbortSignal,
): Promise<AnimalResponse[]> {
  const response = await fetch(`${API_URL}/animais/`, { signal });

  return handleResponse<AnimalResponse[]>(response);
}

export async function obterAnimal(
  id: number,
  signal?: AbortSignal,
): Promise<AnimalResponse> {
  const response = await fetch(`${API_URL}/animais/${id}`, { signal });

  return handleResponse<AnimalResponse>(response);
}

export async function criarAnimal(
  animal: AnimalCreate,
): Promise<AnimalResponse> {
  const response = await fetch(`${API_URL}/animais/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(animal),
  });

  return handleResponse<AnimalResponse>(response);
}

export async function atualizarAnimal(
  id: number,
  animal: AnimalUpdate,
): Promise<AnimalResponse> {
  const response = await fetch(`${API_URL}/animais/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(animal),
  });

  return handleResponse<AnimalResponse>(response);
}

export async function eliminarAnimal(id: number): Promise<void> {
  const response = await fetch(`${API_URL}/animais/${id}`, {
    method: "DELETE",
  });

  await handleResponse<void>(response);
}
