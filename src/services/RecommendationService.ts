import { supabase } from "@/integrations/supabase/client";
import type { ClaimRequest, RecommendationResponse, Recommendation } from "@/types/recommendation";

/**
 * RecommendationService
 * Lee proveedores desde Supabase, calcula scoring y persiste el historial.
 */
export const RecommendationService = {
  async getRecommendations(request: ClaimRequest): Promise<RecommendationResponse> {
    // 1. Traer proveedores del catálogo (filtrando por ciudad si aplica)
    let query = supabase.from("providers").select("*");
    if (request.ciudad) query = query.ilike("ciudad", `%${request.ciudad}%`);

    const { data: providers, error } = await query;
    if (error) {
      console.error("[RecommendationService] fetch providers error:", error);
      throw new Error("No se pudieron obtener los proveedores");
    }

    // Fallback: si no hay match por ciudad, tomar todos
    let pool = providers ?? [];
    if (pool.length === 0) {
      const { data: all } = await supabase.from("providers").select("*");
      pool = all ?? [];
    }

    // 2. Calcular score de cada proveedor
    const isUrgencia = request.tipoServicio === "urgencia";
    const tratamiento = (request.tratamiento || "").toLowerCase();

    const scored: Recommendation[] = pool.map((p, idx) => {
      const especializacion = p.especialidades?.some((e: string) =>
        e.toLowerCase().includes(tratamiento) || tratamiento.includes(e.toLowerCase())
      )
        ? 20
        : 12;

      const costoScore = p.costo_nivel === "$" ? 25 : p.costo_nivel === "$$" ? 22 : 16;
      const distanciaScore = Math.max(5, Math.round(20 - Number(p.distancia_km) * 1.2));
      const capacidadScore = p.capacidad === "Alta" ? 15 : p.capacidad === "Media" ? 11 : 7;
      const googleScore = Math.round(Number(p.google_rating) * 2);
      const historialScore = Math.round(Number(p.historial_aprobacion) * 10);

      const breakdown = {
        costo: costoScore,
        distancia: distanciaScore,
        capacidad: capacidadScore,
        especializacion,
        google: googleScore,
        historial: historialScore,
      };
      const score = Math.min(
        99,
        breakdown.costo + breakdown.distancia + breakdown.capacidad +
        breakdown.especializacion + breakdown.google + breakdown.historial
      );

      const reasons: string[] = [];
      if (p.convenio) reasons.push("Convenio preferencial con la aseguradora");
      if (Number(p.distancia_km) < 5) reasons.push(`Se encuentra a solo ${p.distancia_km} km del paciente`);
      if (p.capacidad === "Alta") reasons.push("Alta disponibilidad para atención inmediata");
      if (Number(p.google_rating) >= 4.5) reasons.push(`Calificación Google de ${p.google_rating}/5`);
      if (especializacion === 20) reasons.push("Especializada en el tratamiento solicitado");
      if (Number(p.historial_aprobacion) >= 0.9) reasons.push("Históricamente presenta baja tasa de rechazos");
      if (p.costo_nivel !== "$$$") reasons.push("Buena relación costo-beneficio");

      const tiempoMin = isUrgencia ? p.tiempo_urgencia_min : p.tiempo_programado_min;
      const tiempoRespuesta = tiempoMin < 60 ? `${tiempoMin} min` : `${(tiempoMin / 60).toFixed(1)} h`;

      return {
        id: idx + 1,
        hospital: p.hospital,
        especialidad: request.tratamiento || p.especialidades?.[0] || "Medicina General",
        ciudad: p.ciudad,
        distancia: Number(p.distancia_km),
        costoEstimado: p.costo_estimado,
        costoNivel: p.costo_nivel as "$" | "$$" | "$$$",
        tiempoRespuesta,
        capacidad: p.capacidad as "Alta" | "Media" | "Baja",
        google: Number(p.google_rating),
        score,
        convenio: p.convenio,
        reasons,
        breakdown,
      };
    });

    scored.sort((a, b) => b.score - a.score);
    const top = scored.slice(0, 4).map((r, i) => ({ ...r, id: i + 1 }));

    const response: RecommendationResponse = {
      requestId: crypto.randomUUID(),
      generatedAt: new Date().toISOString(),
      recommendations: top,
    };

    // 3. Persistir el historial de la búsqueda
    const { error: insertError } = await supabase.from("recommendation_requests").insert({
      usuario: null,
      poliza: request.poliza,
      paciente: request.nombre,
      documento: request.documento,
      ciudad: request.ciudad,
      tratamiento: request.tratamiento,
      tipo_servicio: request.tipoServicio,
      json_request: request as never,
      json_response: response as never,
    });
    if (insertError) console.error("[RecommendationService] persist error:", insertError);

    return response;
  },
};
