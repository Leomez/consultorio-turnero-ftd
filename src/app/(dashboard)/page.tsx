"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { Suspense } from "react";
import { DashboardStatsSkeleton } from "@/components/skeletons/DashboardStatsSkeleton";

export default function DashboardPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  const stats = [
    { label: 'Pacientes', value: 124 },
    { label: 'Turnos hoy', value: 18 },
    { label: 'Ingresos mes', value: '$ 1.250.000' },
    { label: 'Pagos pendientes', value: 6 },
  ];

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) router.push("/login");

  return (

    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Suspense fallback={<DashboardStatsSkeleton />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
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