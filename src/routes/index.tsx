import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ClipboardList, Stethoscope } from "lucide-react";
import { Header } from "@/components/Header";
import { ClaimForm } from "@/components/ClaimForm";
import { RecommendationList } from "@/components/RecommendationList";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RecommendationService } from "@/services/RecommendationService";
import type { ClaimRequest, RecommendationResponse } from "@/types/recommendation";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediMatch AI · Recomendación de proveedores médicos" },
      {
        name: "description",
        content:
          "Sistema inteligente que recomienda proveedores médicos para autorizaciones de siniestros de salud, con explicabilidad y auditoría.",
      },
      { property: "og:title", content: "MediMatch AI · Recomendación de proveedores médicos" },
      {
        property: "og:description",
        content:
          "Sistema inteligente que recomienda proveedores médicos para autorizaciones de siniestros de salud, con explicabilidad y auditoría.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<ClaimRequest | null>(null);
  const [response, setResponse] = useState<RecommendationResponse | null>(null);

  const handleSubmit = async (data: ClaimRequest) => {
    setLoading(true);
    try {
      const res = await RecommendationService.getRecommendations(data);
      setRequest(data);
      setResponse(res);
    } finally {
      setLoading(false);
    }
  };

  const showResults = !!response;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
        {/* Page header */}
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="rounded bg-brand-soft px-2 py-0.5 text-brand">Autorizaciones</span>
              <span>/</span>
              <span>Nueva recomendación</span>
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {showResults ? "Proveedores recomendados" : "Registrar siniestro"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {showResults
                ? "Ranking generado por el motor de recomendación. Cada resultado es explicable y auditable."
                : "Completa la información del caso para consultar el motor de recomendación."}
            </p>
          </div>
          {showResults && (
            <Button
              variant="outline"
              onClick={() => {
                setResponse(null);
              }}
              className="w-full gap-2 sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" /> Nueva búsqueda
            </Button>
          )}
        </div>

        {!showResults ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <ClaimForm onSubmit={handleSubmit} loading={loading} />
            <aside className="space-y-4">
              <SidePanel />
            </aside>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div>
              {response!.recommendations.length ? (
                <RecommendationList items={response!.recommendations} />
              ) : (
                <EmptyState />
              )}
            </div>
            <aside className="space-y-4">
              <RequestSummary request={request!} response={response!} />
            </aside>
          </div>
        )}
      </main>

      {loading && <LoadingOverlay />}
    </div>
  );
}

function SidePanel() {
  return (
    <>
      <div className="rounded-xl border border-border bg-surface p-5 shadow-[0_1px_2px_0_oklch(0.2_0.05_250/0.04)]">
        <div className="mb-3 flex items-center gap-2">
          <Stethoscope className="h-4 w-4 text-brand" />
          <h3 className="text-sm font-semibold text-foreground">¿Cómo funciona?</h3>
        </div>
        <ol className="space-y-3 text-sm text-muted-foreground">
          {[
            "Registra los datos del asegurado y del siniestro.",
            "El motor evalúa costo, distancia, capacidad, especialización, reviews e historial.",
            "Obtienes un ranking explicable de proveedores.",
          ].map((t, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-soft text-[11px] font-semibold text-brand">
                {i + 1}
              </span>
              <span>{t}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="rounded-xl border border-border bg-brand-soft/60 p-5">
        <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-brand">
          Modelo activo
        </div>
        <div className="text-sm font-semibold text-foreground">MediMatch v1.0 (mock)</div>
        <p className="mt-1 text-xs text-muted-foreground">
          Datos simulados. La arquitectura está lista para consumir{" "}
          <code className="rounded bg-surface px-1 py-0.5 text-[11px]">POST /api/recommendations</code>.
        </p>
      </div>
    </>
  );
}

function RequestSummary({
  request,
  response,
}: {
  request: ClaimRequest;
  response: RecommendationResponse;
}) {
  const rows: [string, string][] = [
    ["Póliza", request.poliza],
    ["Paciente", request.nombre],
    ["Documento", request.documento],
    ["Ciudad", request.ciudad],
    ["Tratamiento", request.tratamiento],
    ["Tipo", request.tipoServicio],
  ];
  return (
    <>
      <div className="rounded-xl border border-border bg-surface p-5 shadow-[0_1px_2px_0_oklch(0.2_0.05_250/0.04)]">
        <div className="mb-3 flex items-center gap-2">
          <ClipboardList className="h-4 w-4 text-brand" />
          <h3 className="text-sm font-semibold text-foreground">Resumen del caso</h3>
        </div>
        <dl className="space-y-2 text-sm">
          {rows.map(([k, v]) => (
            <div key={k} className="flex items-start justify-between gap-4">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="text-right font-medium text-foreground">
                {k === "Tipo" ? (
                  <Badge
                    variant="outline"
                    className={
                      v === "urgencia"
                        ? "border-destructive/40 text-destructive"
                        : "border-brand/40 text-brand"
                    }
                  >
                    {v}
                  </Badge>
                ) : (
                  v || "—"
                )}
              </dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="rounded-xl border border-border bg-surface p-5 text-xs text-muted-foreground">
        <div className="font-semibold text-foreground">Auditoría</div>
        <div className="mt-1">Request ID</div>
        <div className="break-all font-mono text-[11px] text-foreground/80">{response.requestId}</div>
        <div className="mt-2">Generado</div>
        <div className="text-foreground/80">{new Date(response.generatedAt).toLocaleString()}</div>
        <div className="mt-2">Resultados: {response.recommendations.length}</div>
      </div>
    </>
  );
}
