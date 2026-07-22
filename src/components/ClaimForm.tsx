import { useState } from "react";
import { Search, User, FileText, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  diagnostico: "",
  observaciones: "",
  tratamiento: "",
  tipoServicio: "programado",
};

export function ClaimForm({ onSubmit, loading }: Props) {
  const [data, setData] = useState<ClaimRequest>(initial);

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
            <Input value={data.ciudad} onChange={(e) => set("ciudad", e.target.value)} placeholder="Caracas" />
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
          <Field label="Diagnóstico">
            <Input value={data.diagnostico} onChange={(e) => set("diagnostico", e.target.value)} placeholder="Ej. Apendicitis aguda" />
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
            <Input value={data.tratamiento} onChange={(e) => set("tratamiento", e.target.value)} placeholder="Ej. Cirugía general" />
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

      <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
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
          className="gap-2 bg-brand text-brand-foreground shadow-sm hover:bg-brand/90"
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
