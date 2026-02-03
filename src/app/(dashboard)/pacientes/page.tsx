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
      <h1 className="text-2xl font-bold mb-4">Pacientes</h1>
      <Suspense fallback={<PacientesListSkeleton />}>
        <PacientesList />
      </Suspense>
    </div>

  );
}