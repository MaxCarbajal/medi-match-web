import { useState } from "react";
import { Search, User, FileText, Stethoscope, Check, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { CITIES } from "@/lib/cities";
import { TREATMENTS } from "@/lib/treatments";
import { cn } from "@/lib/utils";
import type { ClaimRequest } from "@/types/recommendation";

interface Props {
  onSubmit: (data: ClaimRequest) => void;
  loading?: boolean;
}

const initial: ClaimRequest = {
  poliza: "",
  documento: "",
  nombre: "",
  parentesco: "titular",
  ciudad: "",
  fecha: new Date().toISOString().slice(0, 10),
  producto: "",
  observaciones: "",
  tratamiento: "",
  tipoServicio: "programado",
};

export function ClaimForm({ onSubmit, loading }: Props) {
  const [data, setData] = useState<ClaimRequest>(initial);
  const [cityOpen, setCityOpen] = useState(false);
  const [treatmentOpen, setTreatmentOpen] = useState(false);

  const set = <K extends keyof ClaimRequest>(k: K, v: ClaimRequest[K]) =>
    setData((d) => ({ ...d, [k]: v }));

  const canSubmit =
    data.poliza && data.documento && data.nombre && data.ciudad && data.tratamiento;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit(data);
      }}
      className="space-y-6"
    >
      <FormSection
        icon={<User className="h-4 w-4" />}
        title="Datos del asegurado"
        description="Información de identificación del paciente"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Número de póliza" required>
            <Input value={data.poliza} onChange={(e) => set("poliza", e.target.value)} placeholder="POL-000123" />
          </Field>
          <Field label="Documento" required>
            <Input value={data.documento} onChange={(e) => set("documento", e.target.value)} placeholder="V-12.345.678" />
          </Field>
          <Field label="Nombre completo" required>
            <Input value={data.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="María González" />
          </Field>
          <Field label="Parentesco">
            <Select value={data.parentesco} onValueChange={(v) => set("parentesco", v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="titular">Titular</SelectItem>
                <SelectItem value="conyuge">Cónyuge</SelectItem>
                <SelectItem value="hijo">Hijo/a</SelectItem>
                <SelectItem value="padre">Padre / Madre</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </FormSection>

      <FormSection
        icon={<FileText className="h-4 w-4" />}
        title="Datos del siniestro"
        description="Contexto clínico y administrativo del caso"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Ciudad" required>
            <SearchCombobox
              items={CITIES}
              placeholder="Selecciona ciudad"
              searchPlaceholder="Buscar ciudad..."
              emptyText="No se encontró la ciudad."
              value={data.ciudad}
              onChange={(v) => set("ciudad", v)}
              open={cityOpen}
              onOpenChange={setCityOpen}
            />
          </Field>
          <Field label="Fecha">
            <Input type="date" value={data.fecha} onChange={(e) => set("fecha", e.target.value)} />
          </Field>
          <Field label="Producto">
            <Select value={data.producto} onValueChange={(v) => set("producto", v)}>
              <SelectTrigger><SelectValue placeholder="Selecciona producto" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="salud-individual">Salud Individual</SelectItem>
                <SelectItem value="salud-colectiva">Salud Colectiva</SelectItem>
                <SelectItem value="salud-premium">Salud Premium</SelectItem>
                <SelectItem value="salud-corporativa">Salud Corporativa</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="md:col-span-2">
            <Field label="Observaciones">
              <Textarea
                rows={3}
                value={data.observaciones}
                onChange={(e) => set("observaciones", e.target.value)}
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
              items={TREATMENTS}
              placeholder="Selecciona tratamiento"
              searchPlaceholder="Buscar tratamiento..."
              emptyText="No se encontró el tratamiento."
              value={data.tratamiento}
              onChange={(v) => set("tratamiento", v)}
              open={treatmentOpen}
              onOpenChange={setTreatmentOpen}
            />
          </Field>
          <Field label="Tipo de servicio">
            <RadioGroup
              value={data.tipoServicio}
              onValueChange={(v) => set("tipoServicio", v as ClaimRequest["tipoServicio"])}
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
      </FormSection>

      <div className="flex flex-col-reverse items-stretch gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-end">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setData(initial)}
          disabled={loading}
        >
          Limpiar
        </Button>
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
      <CardContent>{children}</CardContent>
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

function SearchCombobox({
  items,
  placeholder,
  searchPlaceholder,
  emptyText,
  value,
  onChange,
  open,
  onOpenChange,
}: {
  items: readonly string[];
  placeholder: string;
  searchPlaceholder: string;
  emptyText: string;
  value: string;
  onChange: (value: string) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-surface text-left font-normal"
        >
          <span className={cn("truncate", !value && "text-muted-foreground")}>
            {value || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[min(90vw,520px)] min-w-[var(--radix-popover-trigger-width)] p-0" align="start">
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
                    className={cn("mr-2 h-4 w-4 shrink-0", value === item ? "opacity-100" : "opacity-0")}
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
