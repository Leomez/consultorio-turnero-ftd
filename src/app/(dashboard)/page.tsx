"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { DashboardStatsSkeleton } from "@/components/skeletons/DashboardStatsSkeleton";
import { useDashboardStats } from "@/hooks/useDashboardStats";

export default function DashboardPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const { stats, loading: statsLoading, error } = useDashboardStats();

  if (loading || statsLoading) {
    return <DashboardStatsSkeleton />;
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  const ingresosFormatted =
    stats && !isNaN(stats.ingresosMes)
      ? stats.ingresosMes.toLocaleString("es-AR", {
          style: "currency",
          currency: "ARS",
        })
      : "$ 0";

  const cards =
    stats && !error
      ? [
          { label: "Pacientes", value: stats.totalPacientes },
          { label: "Turnos hoy", value: stats.turnosHoy },
          { label: "Pendientes hoy", value: stats.turnosPendientesHoy },
          { label: "Próximos turnos", value: stats.turnosFuturos },
          { label: "Ingresos mes", value: ingresosFormatted },
          { label: "Pagos pendientes", value: stats.pagosPendientes },
        ]
      : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {error && (
        <div className="bg-white p-3 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <Suspense fallback={<DashboardStatsSkeleton />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cards.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-sm p-4"
            >
              <div className="text-sm text-gray-500">{stat.label}</div>
              <div className="text-2xl font-bold mt-2">{stat.value}</div>
            </div>
          ))}
        </div>
      </Suspense>
    </div>
  );
}
