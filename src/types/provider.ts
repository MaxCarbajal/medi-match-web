export interface Municipio {
  id_municipio: string;
  municipio: string;
}

export interface RecomendarRequest {
  id_municipio: string;
  tratamiento: string;
  umbral_valoracion: number;
}

export interface Proveedor {
  id_proveedor: number;
  nombre_proveedor: string;
  coste_estimado: number;
  valoracion: number;
  capacidad_restante: number;
  ahorro_pct: number;
  indice_ranking: number;
  modelo_aplicado: boolean;
}

export type TipoServicio = "programado" | "urgencia";

export interface Cliente {
  id_cliente: string;
  poliza: string;
  documento: string;
  nombre_completo: string;
  tipo_usuario: string;
}

export interface BusquedaFormData extends RecomendarRequest {
  municipio: string; // nombre para mostrar (resumen, reserva) — el filtro real es id_municipio
  cliente: Cliente;
  fechaServicio: string;
  tipoServicio: TipoServicio;
  observaciones?: string;
}

export interface ReservarRequest {
  id_proveedor: number;
  municipio: string;
  tratamiento: string;
  id_cliente: string;
  id_gestor: string;
  fecha_servicio: string;
  tipo_servicio: TipoServicio;
  observaciones?: string;
  id_reserva?: string;
}

export interface ReservarResponse {
  status: string;
  mensaje: string;
  id_reserva?: string;
}

export interface Gestor {
  id_gestor: string;
  nombre: string;
  email: string;
}

export interface AsignacionDetalle {
  id_reserva: string;
  id_proveedor: number;
  fecha_reserva: string;
  fecha_servicio: string;
  tipo_servicio: TipoServicio;
  tratamiento: string;
  observaciones?: string;
  nombre_proveedor: string;
  municipio: string;
  id_cliente: string;
  nombre_cliente: string;
  poliza: string;
  documento: string;
  tipo_usuario: string;
  id_gestor: string;
  nombre_gestor: string;
}
