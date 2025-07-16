"use client";
import { Sidebar } from "@/components/layout/sidebar";
import { useRouter } from "next/navigation";

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen">
      <Sidebar
        activeSection="history"
        onSectionChange={(section) => {
          // Redireciona para a rota correspondente
          if (section === "history") router.push("/history");
          else if (section === "dashboard") router.push("/");
          else if (section === "settings") router.push("/configuracoes");
          // Adicione outros casos conforme necessário
        }}
      />
      <main className="flex-1">{children}</main>
    </div>
  );
} 