"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";


export default function TurnosPage() {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    if (loading) return <div>Cargando...</div>;
    if (!isAuthenticated) router.push("/login");

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Turnos</h1>
            <p className="text-gray-700">
                Aquí puedes ver y gestionar los turnos de los pacientes.
            </p>
        </div>
    );
}