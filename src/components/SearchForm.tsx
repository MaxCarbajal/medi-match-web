import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Search,
  Check,
  ChevronsUpDown,
  Loader2,
  User,
  FileText,
  Stethoscope,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FiltrosService, ClienteService } from "@/services/api";
import { cn } from "@/lib/utils";
import type { BusquedaFormData, Cliente, Municipio, TipoServicio } from "@/types/provider";

interface Props {
  onSubmit: (data: BusquedaFormData) => void;
  loading?: boolean;
  initialCliente?: Cliente | null;
}

const hoy = new Date().toISOString().slice(0, 10);

export function SearchForm({ onSubmit, loading, initialCliente }: Props) {
  const [cliente, setCliente] = useState<Cliente | null>(initialCliente ?? null);
  const [municipioEtiqueta, setMunicipioEtiqueta] = useState("");
  const [fechaServicio, setFechaServicio] = useState(hoy);
  const [observaciones, setObservaciones] = useState("");
  const [tratamiento, setTratamiento] = useState("");
  const [tipoServicio, setTipoServicio] = useState<TipoServicio>("programado");
  const [umbralValoracion, setUmbralValoracion] = useState(0);
  const [municipioOpen, setMunicipioOpen] = useState(false);
  const [treatmentOpen, setTreatmentOpen] = useState(false);

  const { data: municipios = [], isLoading: loadingMunicipios } = useQuery({
    queryKey: ["municipios"],
    queryFn: FiltrosService.listarMunicipios,
  });

  // Algunos nombres de municipio corresponden a más de un id_municipio (dos
  // códigos distintos que el dataset llama igual, p.ej. "CHACAO") — se
  // distinguen agregando el código a la etiqueta solo cuando hay ambigüedad,
  // para no filtrar por texto y volver a mezclar proveedores de ambos.
  const municipioPorEtiqueta = useMemo(() => {
    const conteoPorNombre = new Map<string, number>();
    for (const m of municipios) {
      conteoPorNombre.set(m.municipio, (conteoPorNombre.get(m.municipio) ?? 0) + 1);
    }
    const mapa = new Map<string, Municipio>();
    for (const m of municipios) {
      const etiqueta =
        (conteoPorNombre.get(m.municipio) ?? 0) > 1 ? `${m.municipio} (${m.id_municipio})` : m.municipio;
      mapa.set(etiqueta, m);
    }
    return mapa;
  }, [municipios]);

  const etiquetasMunicipio = useMemo(
    () => Array.from(municipioPorEtiqueta.keys()).sort(),
    [municipioPorEtiqueta],
  );

  const municipioSeleccionado = municipioPorEtiqueta.get(municipioEtiqueta) ?? null;

  const { data: tratamientos = [], isLoading: loadingTratamientos } = useQuery({
    queryKey: ["tratamientos", municipioSeleccionado?.id_municipio],
    queryFn: () => FiltrosService.listarTratamientos(municipioSeleccionado!.id_municipio),
    enabled: !!municipioSeleccionado,
  });

  const handleMunicipioChange = (etiqueta: string) => {
    setMunicipioEtiqueta(etiqueta);
    setTratamiento(""); // el tratamiento anterior puede no existir en el municipio nuevo
  };

  const canSubmit = !!cliente && !!municipioSeleccionado && !!tratamiento;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!cliente || !municipioSeleccionado || !canSubmit) return;
        onSubmit({
          id_municipio: municipioSeleccionado.id_municipio,
          municipio: municipioSeleccionado.municipio,
          tratamiento,
          umbral_valoracion: umbralValoracion,
          cliente,
          fechaServicio,
          tipoServicio,
          observaciones: observaciones || undefined,
        });
      }}
      className="space-y-6"
    >
      <FormSection
        icon={<User className="h-4 w-4" />}
        title="Datos del asegurado"
        description="Busca al paciente por póliza, documento o nombre"
      >
        <ClienteCombobox value={cliente} onChange={setCliente} />
      </FormSection>

      <FormSection
        icon={<FileText className="h-4 w-4" />}
        title="Datos del siniestro"
        description="Contexto de la búsqueda"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Municipio" required>
            <SearchCombobox
              items={etiquetasMunicipio}
              placeholder={loadingMunicipios ? "Cargando municipios..." : "Selecciona municipio"}
              searchPlaceholder="Buscar municipio..."
              emptyText="No se encontró el municipio."
              value={municipioEtiqueta}
              onChange={handleMunicipioChange}
              open={municipioOpen}
              onOpenChange={setMunicipioOpen}
              disabled={loadingMunicipios}
              loading={loadingMunicipios}
            />
          </Field>
          <Field label="Fecha">
            <Input
              type="date"
              value={fechaServicio}
              onChange={(e) => setFechaServicio(e.target.value)}
            />
          </Field>
          <div className="md:col-span-2">
            <Field label="Observaciones">
              <Textarea
                rows={3}
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Notas adicionales del operador..."
              />
            </Field>
          </div>
        </div>
      </FormSection>

      <FormSection
        icon={<Stethoscope className="h-4 w-4" />}
        title="Servicio solicitado"
        description="Tipo de atención requerida"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Tratamiento" required>
            <SearchCombobox
              items={tratamientos}
              placeholder={
                !municipioSeleccionado
                  ? "Selecciona un municipio primero"
                  : loadingTratamientos
                    ? "Cargando tratamientos..."
                    : "Selecciona tratamiento"
              }
              searchPlaceholder="Buscar tratamiento..."
              emptyText="Este municipio no ofrece tratamientos registrados."
              value={tratamiento}
              onChange={setTratamiento}
              open={treatmentOpen}
              onOpenChange={setTreatmentOpen}
              disabled={!municipioSeleccionado || loadingTratamientos}
              loading={loadingTratamientos}
            />
          </Field>
          <Field label="Tipo de servicio">
            <RadioGroup
              value={tipoServicio}
              onValueChange={(v) => setTipoServicio(v as TipoServicio)}
              className="flex gap-3 pt-1"
            >
              <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 transition hover:border-brand/50 has-[:checked]:border-brand has-[:checked]:bg-brand-soft">
                <RadioGroupItem value="programado" />
                <span className="text-sm font-medium">Programado</span>
              </label>
              <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 transition hover:border-destructive/50 has-[:checked]:border-destructive has-[:checked]:bg-destructive/5">
                <RadioGroupItem value="urgencia" />
                <span className="text-sm font-medium">Urgencia</span>
              </label>
            </RadioGroup>
          </Field>
        </div>

        <Field label={`Valoración mínima del proveedor — ${umbralValoracion.toFixed(1)} ★`}>
          <Slider
            value={[umbralValoracion]}
            onValueChange={([v]) => setUmbralValoracion(v)}
            min={0}
            max={5}
            step={0.1}
            className="py-2"
          />
        </Field>
      </FormSection>

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

function FormSection({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border shadow-[0_1px_2px_0_oklch(0.2_0.05_250/0.04)]">
      <CardHeader className="pb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-soft text-brand">
            {icon}
          </div>
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">{children}</CardContent>
    </Card>
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

function ClienteCombobox({
  value,
  onChange,
}: {
  value: Cliente | null;
  onChange: (cliente: Cliente | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const { data: resultados = [], isFetching } = useQuery({
    queryKey: ["clientes", query],
    queryFn: () => ClienteService.buscar(query),
    enabled: query.length >= 2,
  });

  if (value) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-surface-muted/60 p-3">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="text-sm font-semibold text-foreground">{value.nombre_completo}</div>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <Badge variant="outline">Póliza {value.poliza}</Badge>
            <Badge variant="outline">{value.documento}</Badge>
            <Badge variant="outline">{value.tipo_usuario}</Badge>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => {
            onChange(null);
            setQuery("");
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-surface text-left font-normal"
        >
          <span className="truncate text-muted-foreground">
            Buscar por póliza, documento o nombre...
          </span>
          <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[min(90vw,520px)] min-w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            value={query}
            onValueChange={setQuery}
            placeholder="POL-000123, V-12.345.678 o nombre..."
          />
          <CommandList>
            {query.length < 2 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Escribe al menos 2 caracteres.
              </div>
            ) : isFetching ? (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Buscando...
              </div>
            ) : (
              <CommandEmpty>No se encontró ningún cliente.</CommandEmpty>
            )}
            <CommandGroup className="max-h-[260px] overflow-y-auto">
              {resultados.map((c) => (
                <CommandItem
                  key={c.id_cliente}
                  value={c.id_cliente}
                  onSelect={() => {
                    onChange(c);
                    setOpen(false);
                  }}
                >
                  <div className="flex min-w-0 flex-col">
                    <span className="text-sm font-medium">{c.nombre_completo}</span>
                    <span className="text-xs text-muted-foreground">
                      Póliza {c.poliza} · {c.documento} · {c.tipo_usuario}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
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
        <Command
          filter={(value, search) => (value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0)}
        >
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
