'use client';

import { useEffect, useState } from 'react';
import { historiaApi, HistoriaClinica, HistoriaRegistro } from '@/lib/historiaApi';
import type { CreateRegistroPayload, UpdateRegistroPayload } from '@/lib/historiaApi';

export function useHistoriaClinica(pacienteId: number | null) {
    const [historia, setHistoria] = useState<HistoriaClinica | null>(null);
    const [registros, setRegistros] = useState<HistoriaRegistro[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!pacienteId) {
            setHistoria(null);
            setRegistros([]);
            setError(null);
            return;
        }

        setHistoria(null);
        setRegistros([]);
        setError(null);
        setLoading(true);

        (async () => {            
            try {
                const hc = await historiaApi.getByPaciente(pacienteId);
                if (hc) {
                    setHistoria(hc);

                    // 👇 en vez de usar hc.registros (sin odontólogo),
                    // pedimos los registros completos con include: { odontologo: true }
                    const regs = await historiaApi.getRegistros(hc.id);
                    setRegistros(regs);
                } else {
                    setHistoria(null);
                    setRegistros([]);
                }
            } catch (err) {
                const msg =
                    err instanceof Error ? err.message : 'Error al cargar historia clínica';
                setError(msg);
                setHistoria(null);
                setRegistros([]);
            } finally {
                setLoading(false);
            }
        })();
    }, [pacienteId]);


    const crearHistoria = async () => {
        if (!pacienteId) return null;
        const hc = await historiaApi.createHistoria(pacienteId);
        setHistoria(hc);
        setRegistros(hc.registros ?? []);
        return hc;
    };

    const crearRegistro = async (
        data: Omit<CreateRegistroPayload, 'historiaId'>,
    ) => {
        if (!historia) throw new Error('No hay historia clínica creada');
        const nuevo = await historiaApi.createRegistro({
            ...data,
            historiaId: historia.id,
        });
        setRegistros((prev) => [nuevo, ...prev]);
        return nuevo;
    };

    const actualizarRegistro = async (
        id: number,
        data: UpdateRegistroPayload,
    ) => {
        const actualizado = await historiaApi.updateRegistro(id, data);
        setRegistros((prev) =>
            prev.map((r) => (r.id === id ? actualizado : r)),
        );
        return actualizado;
    };

    return {
        historia,
        registros,
        loading,
        error,
        crearHistoria,
        crearRegistro,
        actualizarRegistro,
    };
}
