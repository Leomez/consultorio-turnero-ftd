'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  turnosApi,
  Turno,
  CreateTurnoPayload,
  UpdateTurnoPayload,
} from '@/lib/turnosApi';

export function useTurnos() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTurnos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await turnosApi.list();
      setTurnos(data);
    } catch (err) {
      setError('Error al cargar turnos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTurnos();
  }, [fetchTurnos]);

  const createTurno = async (payload: CreateTurnoPayload) => {
    const nuevo = await turnosApi.create(payload);
    setTurnos((prev) => [...prev, nuevo].sort((a, b) => a.fecha.localeCompare(b.fecha)));
    return nuevo;
  };

  const updateTurno = async (id: number, payload: UpdateTurnoPayload) => {
    const actualizado = await turnosApi.update(id, payload);
    setTurnos((prev) =>
      prev
        .map((t) => (t.id === id ? actualizado : t))
        .sort((a, b) => a.fecha.localeCompare(b.fecha)),
    );
    return actualizado;
  };

  const deleteTurno = async (id: number) => {
    await turnosApi.remove(id);
    setTurnos((prev) => prev.filter((t) => t.id !== id));
  };

  return {
    turnos,
    loading,
    error,
    refetch: fetchTurnos,
    createTurno,
    updateTurno,
    deleteTurno,
  };
}
