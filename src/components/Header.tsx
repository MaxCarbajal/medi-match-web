import { Activity, Bell, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-[1400px] grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-brand-foreground shadow-sm">
            <Activity className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold leading-tight text-foreground">MediMatch AI</div>
            <div className="truncate text-xs text-muted-foreground leading-tight">
              Sistema de recomendación de proveedores
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" className="hidden text-muted-foreground sm:inline-flex">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground">
            <Bell className="h-5 w-5" />
          </Button>
          <div className="ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand sm:ml-2">
            OA
          </div>
        </div>
      </div>
    </header>
  );
}
