import { useCallback, useEffect, useState } from "react";
import type { Gestor } from "@/types/provider";

const STORAGE_KEY = "medimatch_gestor";

function leerGestorGuardado(): Gestor | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Gestor) : null;
  } catch {
    return null;
  }
}

export function useGestor() {
  const [gestor, setGestorState] = useState<Gestor | null>(null);
  const [listo, setListo] = useState(false);

  // La lectura de localStorage se hace después de montar (nunca durante SSR).
  useEffect(() => {
    setGestorState(leerGestorGuardado());
    setListo(true);
  }, []);

  const setGestor = useCallback((g: Gestor | null) => {
    setGestorState(g);
    try {
      if (g) localStorage.setItem(STORAGE_KEY, JSON.stringify(g));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      // localStorage puede no estar disponible (modo privado, etc.) — la sesión
      // sigue funcionando en memoria para esta pestaña.
    }
  }, []);

  return { gestor, setGestor, listo };
}
