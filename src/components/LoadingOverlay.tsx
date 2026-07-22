import { Loader2, Sparkles } from "lucide-react";

export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 backdrop-blur-sm">
      <div className="mx-4 flex max-w-sm flex-col items-center gap-4 rounded-2xl border border-border bg-surface p-8 text-center shadow-[0_12px_32px_-8px_oklch(0.2_0.05_250/0.15)]">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft">
          <Loader2 className="h-7 w-7 animate-spin text-brand" />
          <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-brand" />
        </div>
        <div>
          <div className="text-base font-semibold text-foreground">
            Analizando disponibilidad de proveedores...
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Consultando el motor de recomendación y evaluando variables de negocio.
          </p>
        </div>
      </div>
    </div>
  );
}
