import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Proveedor } from "@/types/provider";

interface Props {
  proveedor: Proveedor;
  onSeleccionar: (proveedor: Proveedor) => void;
  loading?: boolean;
}

export function ProviderCard({ proveedor, onSeleccionar, loading }: Props) {
  const sinCupos = proveedor.capacidad_restante <= 0;
  const cuposBajos = proveedor.capacidad_restante < 3;

  return (
    <Card className="overflow-hidden border-border shadow-[0_1px_2px_0_oklch(0.2_0.05_250/0.04),0_4px_12px_-2px_oklch(0.2_0.05_250/0.06)] transition hover:shadow-[0_2px_4px_0_oklch(0.2_0.05_250/0.05),0_12px_32px_-8px_oklch(0.2_0.05_250/0.12)]">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-foreground sm:text-lg">
            {proveedor.nombre_proveedor}
          </h3>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            <span className="font-medium text-foreground">
              ${proveedor.coste_estimado.toFixed(2)}
            </span>
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
