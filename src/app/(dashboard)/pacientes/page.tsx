"use client";

import { Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { PacientesList } from "@/components/Pacientes/PacientesList";
import { PacientesListSkeleton } from "@/components/skeletons/PacientesListSkeleton";


export default function PacientesPage() {

  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  if (loading) return <div>Cargando...</div>;
  if (!isAuthenticated) router.push("/login");

  return (

    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold mb-4">Pacientes</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          Nuevo Paciente
        </button>
        <Suspense fallback={<PacientesListSkeleton />}>
          <PacientesList />
        </Suspense>
      </div>
    </div>

  );
}