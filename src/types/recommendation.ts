export interface ClaimRequest {
  poliza: string;
  documento: string;
  nombre: string;
  parentesco: string;
  ciudad: string;
  fecha: string;
  producto: string;
  diagnostico: string;
  observaciones: string;
  tratamiento: string;
  tipoServicio: "programado" | "urgencia";
}

export interface ScoreBreakdown {
  costo: number;
  distancia: number;
  capacidad: number;
  especializacion: number;
  google: number;
  historial: number;
}

export interface Recommendation {
  id: number;
  hospital: string;
  especialidad: string;
  ciudad: string;
  distancia: number;
  costoEstimado: string;
  costoNivel: "$" | "$$" | "$$$";
  tiempoRespuesta: string;
  capacidad: "Alta" | "Media" | "Baja";
  google: number;
  score: number;
  reasons: string[];
  breakdown: ScoreBreakdown;
  convenio: boolean;
}

export interface RecommendationResponse {
  requestId: string;
  generatedAt: string;
  recommendations: Recommendation[];
}
