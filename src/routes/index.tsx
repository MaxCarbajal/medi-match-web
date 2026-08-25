import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, ListChecks, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import { SearchForm } from "@/components/SearchForm";
import { ProviderList } from "@/components/ProviderList";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { ProviderService } from "@/services/api";
import type { Proveedor, RecomendarRequest } from "@/types/provider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediMatch AI · Recomendación de proveedores médicos" },
      {
        name: "description",
        content:
          "Busca proveedores médicos por ciudad y tratamiento, ve resultados ordenados por afinidad y reserva un cupo en tiempo real.",
      },
      { property: "og:title", content: "MediMatch AI · Recomendación de proveedores médicos" },
      {
        property: "og:description",
        content:
          "Busca proveedores médicos por ciudad y tratamiento, ve resultados ordenados por afinidad y reserva un cupo en tiempo real.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<RecomendarRequest | null>(null);
  const [providers, setProviders] = useState<Proveedor[] | null>(null);
  const [bookingId, setBookingId] = useState<number | null>(null);
  const idClienteRef = useRef(`CLI-${crypto.randomUUID().slice(0, 8).toUpperCase()}`);

  const handleSearch = async (data: RecomendarRequest) => {
    setLoading(true);
    try {
      const results = await ProviderService.recomendar(data);
      setRequest(data);
      setProviders(results);
    } catch (err) {
      console.error("[Index] recomendar error:", err);
      toast.error("No se pudo consultar el motor de recomendación.");
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionar = async (proveedor: Proveedor) => {
    if (!request) return;
    setBookingId(proveedor.id_proveedor);
    try {
      const res = await ProviderService.reservar({
        id_proveedor: proveedor.id_proveedor,
        ciudad: request.ciudad,
        tratamiento: request.tratamiento,
        id_cliente: idClienteRef.current,
      });
      if (res.status === "success") {
        toast.success(res.mensaje || "Reserva confirmada");
        setProviders(
          (prev) =>
            prev?.map((p) =>
              p.id_proveedor === proveedor.id_proveedor
                ? { ...p, capacidad_restante: Math.max(0, p.capacidad_restante - 1) }
                : p,
            ) ?? prev,
        );
      } else {
        toast.error("No se pudo confirmar la reserva.");
      }
    } catch (err) {
      console.error("[Index] reservar error:", err);
      toast.error("No se pudo confirmar la reserva.");
    } finally {
      setBookingId(null);
    }
  };

  const showResults = !!providers;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
              <span className="rounded bg-brand-soft px-2 py-0.5 text-brand">Búsqueda</span>
              <span>/</span>
              <span>Proveedores médicos</span>
            </div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {showResults ? "Proveedores recomendados" : "Buscar proveedor médico"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {showResults
                ? "Ordenados por afinidad (precio + valoración). Selecciona uno para reservar un cupo."
                : "Indica ciudad y tratamiento para consultar el motor de recomendación."}
            </p>
          </div>
          {showResults && (
            <Button
              variant="outline"
              onClick={() => setProviders(null)}
              className="w-full gap-2 sm:w-auto"
            >
              <ArrowLeft className="h-4 w-4" /> Nueva búsqueda
            </Button>
          )}
        </div>

        {!showResults ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <SearchForm onSubmit={handleSearch} loading={loading} />
            <aside className="space-y-4">
              <SidePanel />
            </aside>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div>
              {providers!.length ? (
                <ProviderList
                  items={providers!}
                  onSeleccionar={handleSeleccionar}
                  bookingId={bookingId}
                />
              ) : (
                <EmptyState />
              )}
            </div>
            <aside className="space-y-4">
              <RequestSummary request={request!} count={providers!.length} />
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
    <div className="rounded-xl border border-border bg-surface p-5 shadow-[0_1px_2px_0_oklch(0.2_0.05_250/0.04)]">
      <div className="mb-3 flex items-center gap-2">
        <Stethoscope className="h-4 w-4 text-brand" />
        <h3 className="text-sm font-semibold text-foreground">¿Cómo funciona?</h3>
      </div>
      <ol className="space-y-3 text-sm text-muted-foreground">
        {[
          "Indica ciudad, tratamiento y valoración mínima.",
          "El motor evalúa precio y valoración para rankear proveedores.",
          "Selecciona un proveedor para reservar un cupo — la capacidad se descuenta al instante.",
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
  );
}

function RequestSummary({ request, count }: { request: RecomendarRequest; count: number }) {
  const rows: [string, string][] = [
    ["Ciudad", request.ciudad],
    ["Tratamiento", request.tratamiento],
    ["Valoración mínima", request.umbral_valoracion.toFixed(1)],
    ["Resultados", String(count)],
  ];
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-[0_1px_2px_0_oklch(0.2_0.05_250/0.04)]">
      <div className="mb-3 flex items-center gap-2">
        <ListChecks className="h-4 w-4 text-brand" />
        <h3 className="text-sm font-semibold text-foreground">Resumen de la búsqueda</h3>
      </div>
      <dl className="space-y-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-start justify-between gap-4">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-right font-medium text-foreground">{v || "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
