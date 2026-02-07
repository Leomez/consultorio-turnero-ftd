'use client';

import { useCallback, useEffect, useState } from 'react';
import { pacientesApi, Paciente } from '@/lib/pacientesApi';



export function usePacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPacientes = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await pacientesApi.list();
      setPacientes(data);
    } catch (err) {
      setError('Error al cargar pacientes');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPacientes();
  }, [fetchPacientes]);

  // 🔜 Mutaciones
  const createPaciente = async (payload: Omit<Paciente, 'id' | 'createdAt'>) => {
    const nuevo = await pacientesApi.create(payload);
    setPacientes((prev) => [...prev, nuevo]);
    return nuevo;
  };

  const updatePaciente = async (id: number, payload: Partial<Paciente>) => {
    const actualizado = await pacientesApi.update(id, payload);
    setPacientes((prev) =>
      prev.map((p) => (p.id === id ? actualizado : p))
    );
    return actualizado;
  };

  const deletePaciente = async (id: number) => {
    await pacientesApi.remove(id);
    setPacientes((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    pacientes,
    loading,
    error,
    refetch: fetchPacientes,
    createPaciente,
    updatePaciente,
    deletePaciente,
  };
}
