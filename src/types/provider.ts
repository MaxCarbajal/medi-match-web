export interface RecomendarRequest {
  ciudad: string;
  tratamiento: string;
  umbral_valoracion: number;
}

export interface Proveedor {
  id_proveedor: number;
  nombre_proveedor: string;
  coste_estimado: number;
  valoracion: number;
  capacidad_restante: number;
  indice_ranking: number;
}

export interface ReservarRequest {
  id_proveedor: number;
  ciudad: string;
  tratamiento: string;
  id_cliente: string;
}

export interface ReservarResponse {
  status: string;
  mensaje: string;
}
