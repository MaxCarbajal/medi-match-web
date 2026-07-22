import { RecommendationCard } from "./RecommendationCard";
import type { Recommendation } from "@/types/recommendation";

interface Props {
  items: Recommendation[];
  onDetail?: (r: Recommendation) => void;
}

export function RecommendationList({ items, onDetail }: Props) {
  return (
    <div className="space-y-4">
      {items.map((r, i) => (
        <RecommendationCard key={r.id} rec={r} rank={i + 1} onDetail={onDetail} />
      ))}
    </div>
  );
}
