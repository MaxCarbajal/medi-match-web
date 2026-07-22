import { Sparkles } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/50 px-8 py-16 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-soft text-brand">
        <Sparkles className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-foreground">Aún no hay recomendaciones</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
        Completa el formulario con los datos del siniestro y pulsa
        <span className="font-medium text-foreground"> Buscar proveedores recomendados </span>
        para obtener un ranking auditable.
      </p>
    </div>
  );
}
