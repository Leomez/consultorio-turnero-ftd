
"use client";

import { useEffect, useState } from "react";
import { apiClient } from "@/lib/api";
import Loading from "./loading";

interface Paciente {
    id: number;
    nombre: string;
    dni: string;
    telefono: string;
    // ... otros campos
}

export default function PacientesContent() {
    const [pacientes, setPacientes] = useState<Paciente[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPacientes = async () => {
            try {
                // Aquí llamas a tu backend de NestJS
                const response = await apiClient.get<any>('/pacientes');
                const pacientesData = Array.isArray(response) ? response : response?.data ?? [];
                setPacientes(pacientesData);                
                
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPacientes();
    }, []);

    if (loading) {
        return <Loading />; // O simplemente el contenido vacío
    }
    console.log(pacientes);
    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h1 className="text-2xl font-bold mb-4">Gestión de Pacientes</h1>
            {/* Renderiza tus pacientes aquí */}
            {pacientes.map((p) => (
                <div key={p.id}>
                    <p>Número de Paciente: {p.id}</p>
                    <p>Nombre: {p.nombre}</p>
                    <p>Dni: {p.dni}</p>
                    <p>Teléfono: {p.telefono}</p>
                    <hr className="my-2" />
                </div>

            ))}
        </div>
    );
}