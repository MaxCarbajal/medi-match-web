import { ProviderCard } from "./ProviderCard";
import type { Proveedor } from "@/types/provider";

interface Props {
  items: Proveedor[];
  onSeleccionar: (proveedor: Proveedor) => void;
  bookingId?: number | null;
  municipio?: string;
}

export function ProviderList({ items, onSeleccionar, bookingId, municipio }: Props) {
  return (
    <div className="space-y-4">
      {items.map((p, i) => (
        <ProviderCard
          key={p.id_proveedor}
          proveedor={p}
          onSeleccionar={onSeleccionar}
          loading={bookingId === p.id_proveedor}
          puesto={i + 1}
          municipio={municipio}
        />
      ))}
    </div>
  );
}
