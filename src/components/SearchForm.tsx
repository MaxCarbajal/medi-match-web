import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FiltrosService } from "@/services/api";
import { cn } from "@/lib/utils";
import type { RecomendarRequest } from "@/types/provider";

interface Props {
  onSubmit: (data: RecomendarRequest) => void;
  loading?: boolean;
}

export function SearchForm({ onSubmit, loading }: Props) {
  const [ciudad, setCiudad] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [umbralValoracion, setUmbralValoracion] = useState(0);
  const [cityOpen, setCityOpen] = useState(false);
  const [treatmentOpen, setTreatmentOpen] = useState(false);

  const { data: ciudades = [], isLoading: loadingCiudades } = useQuery({
    queryKey: ["ciudades"],
    queryFn: FiltrosService.listarCiudades,
  });

  const { data: tratamientos = [], isLoading: loadingTratamientos } = useQuery({
    queryKey: ["tratamientos", ciudad],
    queryFn: () => FiltrosService.listarTratamientos(ciudad),
    enabled: !!ciudad,
  });

  const handleCiudadChange = (v: string) => {
    setCiudad(v);
    setTratamiento(""); // el tratamiento anterior puede no existir en la ciudad nueva
  };

  const canSubmit = !!ciudad && !!tratamiento;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit({ ciudad, tratamiento, umbral_valoracion: umbralValoracion });
      }}
      className="space-y-6"
    >
      <Card className="border-border shadow-[0_1px_2px_0_oklch(0.2_0.05_250/0.04)]">
        <CardHeader className="pb-4">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-soft text-brand">
              <Search className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base">Buscar proveedores</CardTitle>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Indica ciudad y tratamiento para consultar el motor de recomendación.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Ciudad" required>
              <SearchCombobox
                items={ciudades}
                placeholder={loadingCiudades ? "Cargando ciudades..." : "Selecciona ciudad"}
                searchPlaceholder="Buscar ciudad..."
                emptyText="No se encontró la ciudad."
                value={ciudad}
                onChange={handleCiudadChange}
                open={cityOpen}
                onOpenChange={setCityOpen}
                disabled={loadingCiudades}
                loading={loadingCiudades}
              />
            </Field>
            <Field label="Tratamiento" required>
              <SearchCombobox
                items={tratamientos}
                placeholder={
                  !ciudad
                    ? "Selecciona una ciudad primero"
                    : loadingTratamientos
                      ? "Cargando tratamientos..."
                      : "Selecciona tratamiento"
                }
                searchPlaceholder="Buscar tratamiento..."
                emptyText="Esta ciudad no ofrece tratamientos registrados."
                value={tratamiento}
                onChange={setTratamiento}
                open={treatmentOpen}
                onOpenChange={setTreatmentOpen}
                disabled={!ciudad || loadingTratamientos}
                loading={loadingTratamientos}
              />
            </Field>
          </div>

          <Field label={`Valoración mínima — ${umbralValoracion.toFixed(1)} ★`}>
            <Slider
              value={[umbralValoracion]}
              onValueChange={([v]) => setUmbralValoracion(v)}
              min={0}
              max={5}
              step={0.1}
              className="py-2"
            />
          </Field>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse items-stretch gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-end">
        <Button
          type="submit"
          size="lg"
          disabled={!canSubmit || loading}
          className="w-full gap-2 bg-brand text-brand-foreground shadow-sm hover:bg-brand/90 sm:w-auto"
        >
          <Search className="h-4 w-4" />
          Buscar proveedores recomendados
        </Button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function SearchCombobox({
  items,
  placeholder,
  searchPlaceholder,
  emptyText,
  value,
  onChange,
  open,
  onOpenChange,
  disabled,
  loading,
}: {
  items: readonly string[];
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  value: string;
  onChange: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <Popover open={open && !disabled} onOpenChange={(o) => onOpenChange(o && !disabled)}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className="w-full justify-between bg-surface text-left font-normal"
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {value || placeholder}
          </span>
          {loading ? (
            <Loader2 className="ml-2 h-4 w-4 shrink-0 animate-spin opacity-50" />
          ) : (
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(90vw,520px)] min-w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup className="max-h-[260px] overflow-y-auto">
              {items.map((item) => (
                <CommandItem
                  key={item}
                  value={item}
                  onSelect={() => {
                    onChange(item === value ? "" : item);
                    onOpenChange(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      value === item ? "opacity-100" : "opacity-0",
                    )}
                  />
                  <span className="text-xs leading-snug">{item}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
