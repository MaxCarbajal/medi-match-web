import { Header } from "@/components/Header";
import { LoginForm } from "@/components/LoginForm";
import { useGestor } from "@/hooks/useGestor";
import type { Gestor } from "@/types/provider";

interface Props {
  children: (gestor: Gestor) => React.ReactNode;
}

export function AppShell({ children }: Props) {
  const { gestor, setGestor, listo } = useGestor();

  if (!listo) return null;
  if (!gestor) return <LoginForm onLogin={setGestor} />;

  return (
    <div className="min-h-screen bg-background">
      <Header gestor={gestor} onLogout={() => setGestor(null)} />
      {children(gestor)}
    </div>
  );
}
