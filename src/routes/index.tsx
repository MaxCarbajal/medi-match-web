import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ListChecks, Pencil, Stethoscope, Target } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { SearchForm } from "@/components/SearchForm";
import { ProviderList } from "@/components/ProviderList";
import { LoadingOverlay } from "@/components/LoadingOverlay";
import { EmptyState } from "@/components/EmptyState";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProviderService, AsignacionesService } from "@/services/api";
import type { BusquedaFormData, Cliente, Gestor, Proveedor } from "@/types/provider";

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>): { editar?: string } => ({
    editar: typeof search.editar === "string" ? search.editar : undefined,
  }),
  head: () => ({
    meta: [
      { title: "MediMatch AI · Recomendación de proveedores médicos" },
      {
        name: "description",
        content:
          "Busca proveedores médicos por municipio y tratamiento, ve resultados ordenados por afinidad y reserva un cupo en tiempo real.",
      },
      { property: "og:title", content: "MediMatch AI · Recomendación de proveedores médicos" },
      {
        property: "og:description",
        content:
          "Busca proveedores médicos por municipio y tratamiento, ve resultados ordenados por afinidad y reserva un cupo en tiempo real.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <AppShell>{(gestor) => <Index gestor={gestor} />}</AppShell>,
});

function Index({ gestor }: { gestor: Gestor }) {
  const navigate = useNavigate();
  const { editar: idEditando } = Route.useSearch();

  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState<BusquedaFormData | null>(null);
  const [providers, setProviders] = useState<Proveedor[] | null>(null);
  const [bookingId, setBookingId] = useState<number | null>(null);

  const { data: asignacionEditando } = useQuery({
    queryKey: ["asignaciones", "todas"],
    queryFn: () => AsignacionesService.listar(),
    enabled: !!idEditando,
    select: (data) => data.find((a) => a.id_reserva === idEditando),
  });

  const clienteEditando: Cliente | null = asignacionEditando
    ? {
        id_cliente: asignacionEditando.id_cliente,
        poliza: asignacionEditando.poliza,
        documento: asignacionEditando.documento,
        nombre_completo: asignacionEditando.nombre_cliente,
        tipo_usuario: asignacionEditando.tipo_usuario,
      }
    : null;

  const handleSearch = async (data: BusquedaFormData) => {
    setLoading(true);
    try {
      const results = await ProviderService.recomendar({
        id_municipio: data.id_municipio,
        tratamiento: data.tratamiento,
        umbral_valoracion: data.umbral_valoracion,
      });
      setBusqueda(data);
      setProviders(results);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("[Index] recomendar error:", err);
      toast.error("No se pudo consultar el motor de recomendación.");
    } finally {
      setLoading(false);
    }
  };

  const handleSeleccionar = async (proveedor: Proveedor) => {
    if (!busqueda) return;
    setBookingId(proveedor.id_proveedor);
    try {
      const res = await ProviderService.reservar({
        id_proveedor: proveedor.id_proveedor,
        municipio: busqueda.municipio,
        tratamiento: busqueda.tratamiento,
        id_cliente: busqueda.cliente.id_cliente,
        id_gestor: gestor.id_gestor,
        fecha_servicio: busqueda.fechaServicio,
        tipo_servicio: busqueda.tipoServicio,
        observaciones: busqueda.observaciones,
        id_reserva: idEditando,
      });
      if (res.status === "success") {
        if (idEditando) {
          toast.success(res.mensaje || "Asignación actualizada");
          navigate({ to: "/asignaciones" });
        } else {
          toast.success(res.mensaje || "Fue asignado");
          // Solo se puede asignar un proveedor por búsqueda: se vuelve al
          // formulario en blanco en vez de dejar los resultados abiertos.
          setProviders(null);
          setBusqueda(null);
        }
      } else {
        toast.error(res.mensaje || "No se pudo confirmar la reserva.");
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
    <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      {idEditando && !showResults && (
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-brand/40 bg-brand-soft px-4 py-2.5 text-sm text-brand">
          <Pencil className="h-4 w-4" />
          Editando la asignación de <strong>{clienteEditando?.nombre_completo ?? "..."}</strong> —
          al reservar un nuevo proveedor se reemplaza la anterior.
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-end justify-between gap-4 sm:mb-8">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="rounded bg-brand-soft px-2 py-0.5 text-brand">Búsqueda</span>
            <span>/</span>
            <span>Proveedores médicos</span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {showResults ? "Proveedores recomendados" : "Registrar siniestro"}
            </h1>
            {showResults && providers![0]?.modelo_aplicado && (
              <Badge
                className="gap-1 bg-brand text-brand-foreground hover:bg-brand"
                title="Esta búsqueda tuvo suficientes proveedores alternativos para que el modelo de optimización calculara el ranking (coste, valoración y capacidad disponible)."
              >
                <Target className="h-3 w-3" /> Ranking optimizado
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {showResults
              ? "Ordenados por afinidad (precio + valoración + capacidad). Selecciona uno para reservar un cupo."
              : "Completa los datos del asegurado y el servicio para consultar el motor de recomendación."}
          </p>
        </div>
        {showResults && (
          <Button
            variant="outline"
            onClick={() => {
              setProviders(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="w-full gap-2 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" /> Nueva búsqueda
          </Button>
        )}
      </div>

      {!showResults ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <SearchForm onSubmit={handleSearch} loading={loading} initialCliente={clienteEditando} />
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
            <RequestSummary busqueda={busqueda!} count={providers!.length} />
          </aside>
        </div>
      )}

      {loading && <LoadingOverlay />}
    </main>
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
          "Busca al asegurado por póliza, documento o nombre.",
          "Indica municipio, tratamiento y valoración mínima.",
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

function RequestSummary({ busqueda, count }: { busqueda: BusquedaFormData; count: number }) {
  const rows: [string, string][] = [
    ["Paciente", busqueda.cliente.nombre_completo],
    ["Póliza", busqueda.cliente.poliza],
    ["Municipio", busqueda.municipio],
    ["Tratamiento", busqueda.tratamiento],
    ["Fecha", busqueda.fechaServicio],
    ["Resultados", String(count)],
  ];
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-[0_1px_2px_0_oklch(0.2_0.05_250/0.04)]">
      <div className="mb-3 flex items-center gap-2">
        <ListChecks className="h-4 w-4 text-brand" />
        <h3 className="text-sm font-semibold text-foreground">Resumen del caso</h3>
      </div>
      <dl className="space-y-2 text-sm">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-start justify-between gap-4">
            <dt className="text-muted-foreground">{k}</dt>
            <dd className="text-right font-medium text-foreground">{v || "—"}</dd>
          </div>
        ))}
        <div className="flex items-start justify-between gap-4">
          <dt className="text-muted-foreground">Tipo</dt>
          <dd className="text-right">
            <Badge
              variant="outline"
              className={
                busqueda.tipoServicio === "urgencia"
                  ? "border-destructive/40 text-destructive"
                  : "border-brand/40 text-brand"
              }
            >
              {busqueda.tipoServicio}
            </Badge>
          </dd>
        </div>
      </dl>
    </div>
  );
}
