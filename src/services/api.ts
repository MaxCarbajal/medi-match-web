import type {
  RecomendarRequest,
  Proveedor,
  ReservarRequest,
  ReservarResponse,
  Cliente,
  Gestor,
  AsignacionDetalle,
  Municipio,
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

async function del<TResponse>(path: string): Promise<TResponse> {
  const res = await fetch(`${API_BASE_URL}${path}`, { method: "DELETE" });
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
  listarMunicipios: () => get<Municipio[]>("/municipios"),
  listarTratamientos: (idMunicipio: string) =>
    get<string[]>(`/tratamientos?id_municipio=${encodeURIComponent(idMunicipio)}`),
};

export const ClienteService = {
  buscar: (q: string) => get<Cliente[]>(`/clientes?q=${encodeURIComponent(q)}`),
};

export const AuthService = {
  login: (email: string, password: string) => post<Gestor>("/login", { email, password }),
};

export const AsignacionesService = {
  listar: (idGestor?: string) =>
    get<AsignacionDetalle[]>(
      idGestor ? `/asignaciones?id_gestor=${encodeURIComponent(idGestor)}` : "/asignaciones",
    ),
  eliminar: (idReserva: string) => del<ReservarResponse>(`/asignaciones/${idReserva}`),
};
