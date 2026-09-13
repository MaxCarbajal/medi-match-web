import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ClipboardList, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AsignacionesService } from "@/services/api";
import type { AsignacionDetalle } from "@/types/provider";

export const Route = createFileRoute("/asignaciones")({
  head: () => ({
    meta: [{ title: "Asignaciones · MediMatch" }],
  }),
  component: () => <AppShell>{() => <AsignacionesPage />}</AppShell>,
});

function AsignacionesPage() {
  const [filtroGestor, setFiltroGestor] = useState<string>("todos");
  const { data: asignaciones = [], isLoading } = useQuery({
    queryKey: ["asignaciones", "todas"],
    queryFn: () => AsignacionesService.listar(),
  });

  const gestores = Array.from(new Set(asignaciones.map((a) => a.nombre_gestor))).sort();
  const filas =
    filtroGestor === "todos"
      ? asignaciones
      : asignaciones.filter((a) => a.nombre_gestor === filtroGestor);

  return (
    <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="rounded bg-brand-soft px-2 py-0.5 text-brand">Gestión</span>
            <span>/</span>
            <span>Asignaciones</span>
          </div>
          <h1 className="flex items-center gap-2 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            <ClipboardList className="h-5 w-5 text-brand" /> Asignaciones
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Todas las reservas hechas por los gestores. Puedes editarlas o eliminarlas.
          </p>
        </div>
        <Select value={filtroGestor} onValueChange={setFiltroGestor}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Filtrar por gestor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los gestores</SelectItem>
            {gestores.map((g) => (
              <SelectItem key={g} value={g}>
                {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-xl border border-border bg-surface">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Paciente</TableHead>
              <TableHead>Proveedor</TableHead>
              <TableHead>Municipio</TableHead>
              <TableHead>Tratamiento</TableHead>
              <TableHead>Fecha servicio</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Gestor</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                  Cargando...
                </TableCell>
              </TableRow>
            ) : filas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="py-8 text-center text-sm text-muted-foreground">
                  No hay asignaciones todavía.
                </TableCell>
              </TableRow>
            ) : (
              filas.map((a) => <FilaAsignacion key={a.id_reserva} asignacion={a} />)
            )}
          </TableBody>
        </Table>
      </div>
    </main>
  );
}

function FilaAsignacion({ asignacion: a }: { asignacion: AsignacionDetalle }) {
  const queryClient = useQueryClient();
  const [eliminando, setEliminando] = useState(false);

  const handleEliminar = async () => {
    setEliminando(true);
    try {
      await AsignacionesService.eliminar(a.id_reserva);
      toast.success("Asignación eliminada");
      queryClient.invalidateQueries({ queryKey: ["asignaciones"] });
    } catch (err) {
      console.error("[Asignaciones] eliminar error:", err);
      toast.error("No se pudo eliminar la asignación.");
    } finally {
      setEliminando(false);
    }
  };

  return (
    <TableRow>
      <TableCell>
        <div className="font-medium text-foreground">{a.nombre_cliente}</div>
        <div className="text-xs text-muted-foreground">Póliza {a.poliza}</div>
      </TableCell>
      <TableCell>{a.nombre_proveedor}</TableCell>
      <TableCell>{a.municipio}</TableCell>
      <TableCell className="max-w-[240px] truncate" title={a.tratamiento}>
        {a.tratamiento}
      </TableCell>
      <TableCell>{a.fecha_servicio}</TableCell>
      <TableCell>
        <Badge
          variant="outline"
          className={
            a.tipo_servicio === "urgencia"
              ? "border-destructive/40 text-destructive"
              : "border-brand/40 text-brand"
          }
        >
          {a.tipo_servicio}
        </Badge>
      </TableCell>
      <TableCell>{a.nombre_gestor}</TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/" search={{ editar: a.id_reserva }} title="Editar">
              <Pencil className="h-4 w-4" />
            </Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" disabled={eliminando} title="Eliminar">
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar esta asignación?</AlertDialogTitle>
                <AlertDialogDescription>
                  Se liberará el cupo de {a.nombre_proveedor} para {a.nombre_cliente} y dejará de
                  aparecer en esta lista.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleEliminar}>Eliminar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  );
}
