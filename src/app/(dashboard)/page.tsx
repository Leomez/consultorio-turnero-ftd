"use client";

import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!isAuthenticated) router.push("/login");

  return (
   
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Bienvenido al Dashboard</h1>
        <p className="text-gray-700">
          Aca podes gestionar tus pacientes, turnos, historias clínicas y pagos.
        </p>
      </div>
    
  );
}