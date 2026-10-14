import { API_URL, handleResponse } from "@/services/animais";

export interface CatalogoVacinaResponse {
  id: number;
  nome: string;
  especie: string;
  tipo: string;
  doencas: string;
  protocolo: string;
  observacoes?: string | null;
}

export async function listarCatalogoVacinas(
  especie?: string,
  signal?: AbortSignal,
): Promise<CatalogoVacinaResponse[]> {
  const query = especie ? `?especie=${encodeURIComponent(especie)}` : "";
  const response = await fetch(`${API_URL}/catalogo-vacinas/${query}`, {
    signal,
  });

  return handleResponse<CatalogoVacinaResponse[]>(response);
}
