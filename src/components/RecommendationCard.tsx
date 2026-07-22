import {
  MapPin, Star, Clock, Activity, DollarSign, Trophy, Check, ChevronRight, Handshake,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import type { Recommendation } from "@/types/recommendation";

interface Props {
  rec: Recommendation;
  rank: number;
  onDetail?: (r: Recommendation) => void;
}

export function RecommendationCard({ rec, rank, onDetail }: Props) {
  const isTop = rank === 1;
  return (
    <Card
      className={
        "overflow-hidden border-border shadow-[0_1px_2px_0_oklch(0.2_0.05_250/0.04),0_4px_12px_-2px_oklch(0.2_0.05_250/0.06)] transition hover:shadow-[0_2px_4px_0_oklch(0.2_0.05_250/0.05),0_12px_32px_-8px_oklch(0.2_0.05_250/0.12)] " +
        (isTop ? "ring-2 ring-brand/40" : "")
      }
    >
      <div className={"h-1 w-full " + (isTop ? "bg-brand" : "bg-border")} />
      <CardContent className="p-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_auto]">
          {/* LEFT */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  {isTop ? (
                    <Badge className="gap-1 bg-brand text-brand-foreground hover:bg-brand">
                      <Trophy className="h-3 w-3" /> Mejor opción
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="font-mono">#{rank}</Badge>
                  )}
                  {rec.convenio && (
                    <Badge variant="outline" className="gap-1 border-success/40 text-success">
                      <Handshake className="h-3 w-3" /> Convenio
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-muted-foreground">{rec.especialidad}</Badge>
                </div>
                <h3 className="text-lg font-semibold text-foreground">{rec.hospital}</h3>
                <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" /> {rec.ciudad} · {rec.distancia} km
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric icon={<DollarSign className="h-3.5 w-3.5" />} label="Costo estimado" value={rec.costoEstimado} sub={rec.costoNivel} />
              <Metric icon={<Clock className="h-3.5 w-3.5" />} label="Tiempo respuesta" value={rec.tiempoRespuesta} />
              <Metric icon={<Activity className="h-3.5 w-3.5" />} label="Capacidad" value={rec.capacidad} />
              <Metric icon={<Star className="h-3.5 w-3.5" />} label="Google" value={`${rec.google}/5`} />
            </div>

            <div className="rounded-lg border border-border bg-surface-muted/60 p-4">
              <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                ¿Por qué recomendamos esta clínica?
              </div>
              <ul className="grid gap-2 sm:grid-cols-2">
                {rec.reasons.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                    <div className="mt-0.5 flex h-4 w-4 flex-none items-center justify-center rounded-full bg-success/15 text-success">
                      <Check className="h-3 w-3" strokeWidth={3} />
                    </div>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT — score panel */}
          <div className="lg:w-72">
            <div className="rounded-xl border border-border bg-surface-muted/60 p-5">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Score total
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight text-brand">{rec.score}</span>
                <span className="text-sm text-muted-foreground">/100</span>
              </div>
              <Progress value={rec.score} className="mt-2 h-2" />

              <div className="mt-5 space-y-2.5">
                <BreakdownRow label="Costo" pct={25} val={rec.breakdown.costo} />
                <BreakdownRow label="Distancia" pct={20} val={rec.breakdown.distancia} />
                <BreakdownRow label="Capacidad" pct={15} val={rec.breakdown.capacidad} />
                <BreakdownRow label="Especialización" pct={20} val={rec.breakdown.especializacion} />
                <BreakdownRow label="Google Reviews" pct={10} val={rec.breakdown.google} />
                <BreakdownRow label="Historial" pct={10} val={rec.breakdown.historial} />
              </div>

              <Button
                variant="outline"
                className="mt-5 w-full justify-between"
                onClick={() => onDetail?.(rec)}
              >
                Ver detalle <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Metric({
  icon, label, value, sub,
}: { icon: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2.5">
      <div className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {icon} {label}
      </div>
      <div className="mt-0.5 flex items-baseline gap-1">
        <span className="text-sm font-semibold text-foreground">{value}</span>
        {sub && <span className="text-xs text-muted-foreground">{sub}</span>}
      </div>
    </div>
  );
}

function BreakdownRow({ label, pct, val }: { label: string; pct: number; val: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label} <span className="text-foreground/60">· {pct}%</span></span>
        <span className="font-medium text-foreground">{val}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div className="h-full rounded-full bg-brand" style={{ width: `${(val / pct) * 100}%` }} />
      </div>
    </div>
  );
}
