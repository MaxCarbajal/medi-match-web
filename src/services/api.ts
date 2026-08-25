import type {
  RecomendarRequest,
  Proveedor,
  ReservarRequest,
  ReservarResponse,
} from "@/types/provider";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || "http://localhost:8000";

async function post<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    throw new Error(`${path} respondió ${res.status}`);
  }
  return res.json();
}

async function get<TResponse>(path: string): Promise<TResponse> {
  const res = await fetch(`${API_BASE_URL}${path}`);
  if (!res.ok) {
    throw new Error(`${path} respondió ${res.status}`);
  }
  return res.json();
}

export const ProviderService = {
  recomendar: (body: RecomendarRequest) => post<Proveedor[]>("/recomendar", body),
  reservar: (body: ReservarRequest) => post<ReservarResponse>("/reservar", body),
};

export const FiltrosService = {
  listarCiudades: () => get<string[]>("/ciudades"),
  listarTratamientos: (ciudad: string) =>
    get<string[]>(`/tratamientos?ciudad=${encodeURIComponent(ciudad)}`),
};
