import type { ClaimRequest, RecommendationResponse } from "@/types/recommendation";

/**
 * RecommendationService
 * Abstrae la fuente de datos de recomendaciones.
 * Hoy: mock. Mañana: POST /api/recommendations.
 */
export const RecommendationService = {
  async getRecommendations(request: ClaimRequest): Promise<RecommendationResponse> {
    // Simular latencia de red / motor de IA
    await new Promise((r) => setTimeout(r, 1600));

    // TODO: reemplazar por fetch real
    // const res = await fetch("/api/recommendations", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(request),
    // });
    // return res.json();

    return buildMock(request);
  },
};

function buildMock(req: ClaimRequest): RecommendationResponse {
  const base = [
    {
      id: 1,
      hospital: "Clínica Caracas",
      especialidad: req.tratamiento || "Medicina General",
      ciudad: req.ciudad || "Caracas",
      distancia: 2.3,
      costoEstimado: "$1.850",
      costoNivel: "$$" as const,
      tiempoRespuesta: req.tipoServicio === "urgencia" ? "12 min" : "1.5 h",
      capacidad: "Alta" as const,
      google: 4.8,
      score: 94,
      convenio: true,
      reasons: [
        "Excelente relación costo-beneficio",
        "Alta disponibilidad para atención inmediata",
        "Se encuentra a solo 2.3 km del paciente",
        "Calificación Google de 4.8/5",
        "Especializada en el tratamiento solicitado",
        "Históricamente presenta baja tasa de rechazos",
        "Convenio preferencial con la aseguradora",
      ],
      breakdown: { costo: 24, distancia: 19, capacidad: 14, especializacion: 19, google: 9, historial: 9 },
    },
    {
      id: 2,
      hospital: "Centro Médico La Trinidad",
      especialidad: req.tratamiento || "Medicina General",
      ciudad: req.ciudad || "Caracas",
      distancia: 4.2,
      costoEstimado: "$2.340",
      costoNivel: "$$$" as const,
      tiempoRespuesta: req.tipoServicio === "urgencia" ? "18 min" : "2 h",
      capacidad: "Media" as const,
      google: 4.7,
      score: 88,
      convenio: true,
      reasons: [
        "Especialistas certificados disponibles",
        "Alta calidad clínica reconocida",
        "Muy buenas opiniones de pacientes",
        "Convenio activo con la aseguradora",
        "Historial estable de aprobaciones",
      ],
      breakdown: { costo: 19, distancia: 17, capacidad: 12, especializacion: 18, google: 9, historial: 8 },
    },
    {
      id: 3,
      hospital: "Hospital Metropolitano",
      especialidad: req.tratamiento || "Medicina General",
      ciudad: req.ciudad || "Caracas",
      distancia: 6.8,
      costoEstimado: "$1.620",
      costoNivel: "$$" as const,
      tiempoRespuesta: req.tipoServicio === "urgencia" ? "22 min" : "3 h",
      capacidad: "Alta" as const,
      google: 4.5,
      score: 82,
      convenio: false,
      reasons: [
        "Buen costo estimado del procedimiento",
        "Alta capacidad operativa",
        "Amplia cobertura de especialidades",
        "Tiempos de respuesta razonables",
      ],
      breakdown: { costo: 23, distancia: 13, capacidad: 14, especializacion: 15, google: 8, historial: 9 },
    },
    {
      id: 4,
      hospital: "Policlínica Metropolitana",
      especialidad: req.tratamiento || "Medicina General",
      ciudad: req.ciudad || "Caracas",
      distancia: 8.5,
      costoEstimado: "$2.910",
      costoNivel: "$$$" as const,
      tiempoRespuesta: req.tipoServicio === "urgencia" ? "28 min" : "4 h",
      capacidad: "Baja" as const,
      google: 4.3,
      score: 71,
      convenio: false,
      reasons: [
        "Reconocimiento clínico establecido",
        "Buenas opiniones de pacientes",
        "Cobertura del tratamiento solicitado",
      ],
      breakdown: { costo: 15, distancia: 10, capacidad: 9, especializacion: 16, google: 8, historial: 13 },
    },
  ];

  return {
    requestId: crypto.randomUUID(),
    generatedAt: new Date().toISOString(),
    recommendations: base,
  };
}
