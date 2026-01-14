"use client";

import { Suspense } from "react";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import Loading from "./loading";
import PacientesContent from "./pacientes-content";

export default function PacientesPage() {

  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
    
  if (loading) return <div>Cargando...</div>;   
  if (!isAuthenticated) router.push("/login");
  
  return (
    <Suspense fallback={<Loading />}>
      <PacientesContent />
    </Suspense>
    // <div className="p-4 bg-white rounded-lg shadow-md">
    //   <h1 className="text-2xl font-bold mb-4">Gestión de Pacientes</h1>
      
    //     <PacientesContent />
    // </div>
  );
}