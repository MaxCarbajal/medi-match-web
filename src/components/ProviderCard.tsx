import { Loader2, MapPin, Medal, Phone, TrendingDown, TrendingUp, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Proveedor } from "@/types/provider";

interface Props {
  proveedor: Proveedor;
  onSeleccionar: (proveedor: Proveedor) => void;
  loading?: boolean;
  /** Posición 1-based dentro de los resultados ya ordenados por el motor. */
  puesto: number;
  /** Nombre del municipio buscado, para armar el link de Google Maps. */
  municipio?: string;
}

const ESTILOS_PUESTO: Record<
  number,
  { borde: string; badge: string; icono: React.ReactNode; etiqueta: string }
> = {
  1: {
    borde: "border-l-4 border-l-amber-400",
    badge: "border-amber-400/50 bg-amber-400/10 text-amber-600",
    icono: <Trophy className="h-3.5 w-3.5" />,
    etiqueta: "1er lugar",
  },
  2: {
    borde: "border-l-4 border-l-slate-400",
    badge: "border-slate-400/50 bg-slate-400/10 text-slate-600",
    icono: <Medal className="h-3.5 w-3.5" />,
    etiqueta: "2do lugar",
  },
  3: {
    borde: "border-l-4 border-l-orange-400",
    badge: "border-orange-400/50 bg-orange-400/10 text-orange-600",
    icono: <Medal className="h-3.5 w-3.5" />,
    etiqueta: "3er lugar",
  },
};

function estiloPuesto(puesto: number) {
  return (
    ESTILOS_PUESTO[puesto] ?? {
      borde: "border-l-4 border-l-border",
      badge: "border-border text-muted-foreground",
      icono: null,
      etiqueta: `${puesto}to lugar`,
    }
  );
}

export function ProviderCard({ proveedor, onSeleccionar, loading, puesto, municipio }: Props) {
  const sinCupos = proveedor.capacidad_restante <= 0;
  const cuposBajos = proveedor.capacidad_restante < 3;
  const estilo = estiloPuesto(puesto);

  // ahorro_pct compara contra el promedio de ESTA búsqueda -- con pocos
  // candidatos (típico cuando no pasa por el modelo) suele dar ~0% porque no
  // hay con qué comparar. ahorro_referencia_municipio_pct es un cálculo
  // aparte del backend (no toca el ranking) contra el promedio de TODOS los
  // proveedores del municipio para ese tratamiento -- se usa solo como
  // respaldo, etiquetado distinto para no confundirlo con el de arriba.
  const ahorroGrupoVisible = Math.abs(proveedor.ahorro_pct) >= 0.5;
  const ahorroReferenciaVisible =
    !ahorroGrupoVisible &&
    proveedor.ahorro_referencia_municipio_pct !== null &&
    Math.abs(proveedor.ahorro_referencia_municipio_pct) >= 0.5;

  // google_maps_url ya es un link directo al lugar (place_id verificado por
  // Google Places) para ~2/3 de los proveedores — para el resto no hay match
  // real, así que se cae a una búsqueda por nombre (varios resultados). Se
  // probó un preview embebido del mapa (iframe) y se sacó -- se veía mal y
  // Google no muestra la ficha del lugar de forma confiable sin API key (ver
  // docs/DECISIONES.md, 2026-09-13). La dirección/teléfono como texto (abajo)
  // sí son confiables porque vienen directo de la DB, no del iframe.
  const linkDirecto = !!proveedor.google_maps_url;
  const consultaMaps = [proveedor.nombre_proveedor, municipio, "Venezuela"]
    .filter(Boolean)
    .join(", ");
  const linkMaps =
    proveedor.google_maps_url ??
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consultaMaps)}`;

  return (
    <Card
      className={cn(
        "overflow-hidden border-border shadow-[0_1px_2px_0_oklch(0.2_0.05_250/0.04),0_4px_12px_-2px_oklch(0.2_0.05_250/0.06)] transition hover:shadow-[0_2px_4px_0_oklch(0.2_0.05_250/0.05),0_12px_32px_-8px_oklch(0.2_0.05_250/0.12)]",
        estilo.borde,
      )}
    >
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={cn("gap-1 font-semibold", estilo.badge)}>
              {estilo.icono}
              {estilo.etiqueta}
            </Badge>
          </div>
          <h3 className="text-base font-semibold text-foreground sm:text-lg">
            {proveedor.nombre_proveedor}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-foreground">
              ${proveedor.coste_estimado.toFixed(2)}
            </span>
            {ahorroGrupoVisible && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 font-medium",
                  proveedor.ahorro_pct > 0 ? "text-success" : "text-destructive",
                )}
                title={
                  proveedor.ahorro_pct > 0
                    ? "Más barato que el promedio de esta búsqueda"
                    : "Más caro que el promedio de esta búsqueda"
                }
              >
                {proveedor.ahorro_pct > 0 ? (
                  <TrendingUp className="h-3.5 w-3.5" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                {Math.abs(proveedor.ahorro_pct).toFixed(0)}%
              </span>
            )}
            {ahorroReferenciaVisible && (
              <span
                className={cn(
                  "inline-flex items-center gap-1 text-xs font-medium italic",
                  proveedor.ahorro_referencia_municipio_pct! > 0
                    ? "text-success/80"
                    : "text-destructive/80",
                )}
                title="Estimado aparte del ranking: comparado con el promedio de todos los proveedores de este tratamiento en el municipio, no solo los que aparecen en esta búsqueda."
              >
                {proveedor.ahorro_referencia_municipio_pct! > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                ~{Math.abs(proveedor.ahorro_referencia_municipio_pct!).toFixed(0)}% vs. municipio
              </span>
            )}
            <span className="text-muted-foreground">·</span>
            <span className="text-foreground">{proveedor.valoracion.toFixed(1)} ⭐</span>
            <Badge
              variant="outline"
              className={cn(
                cuposBajos
                  ? "border-destructive/40 text-destructive"
                  : "border-success/40 text-success",
              )}
            >
              Cupos: {proveedor.capacidad_restante}
            </Badge>
          </div>

          {(proveedor.direccion || proveedor.telefono) && (
            <div className="mt-2 space-y-0.5 text-xs text-muted-foreground">
              {proveedor.direccion && (
                <p className="flex items-start gap-1.5">
                  <MapPin className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                  <span>{proveedor.direccion}</span>
                </p>
              )}
              {proveedor.telefono && (
                <p className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{proveedor.telefono}</span>
                </p>
              )}
            </div>
          )}

          <a
            href={linkMaps}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-brand hover:underline"
            title={
              linkDirecto
                ? undefined
                : "No hay una ficha exacta de Google Maps para este proveedor — esto abre una búsqueda por nombre"
            }
          >
            <MapPin className="h-4 w-4" />
            {linkDirecto ? "Ver ubicación en Google Maps" : "Buscar ubicación en Google Maps"}
          </a>
        </div>

        <Button
          onClick={() => onSeleccionar(proveedor)}
          disabled={sinCupos || loading}
          className="w-full gap-2 bg-brand text-brand-foreground hover:bg-brand/90 sm:w-auto"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Seleccionar
        </Button>
      </CardContent>
    </Card>
  );
}
