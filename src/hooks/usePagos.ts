'use client';

import { useCallback, useEffect, useState } from 'react';
import { pagosApi, Pago, CreatePagoPayload, UpdatePagoPayload } from '@/lib/pagosApi';

export function usePagos(pacienteId?: number) {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPagos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = pacienteId
        ? await pagosApi.listByPaciente(pacienteId)
        : await pagosApi.list();
      setPagos(data);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al cargar pagos';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [pacienteId]);

  useEffect(() => {
    fetchPagos();
  }, [fetchPagos]);

  const createPago = async (payload: CreatePagoPayload) => {
    const nuevo = await pagosApi.create(payload);
    setPagos((prev) => [nuevo, ...prev]);
    return nuevo;
  };

  const updatePago = async (id: number, payload: UpdatePagoPayload) => {
    const actualizado = await pagosApi.update(id, payload);
    setPagos((prev) => prev.map((p) => (p.id === id ? actualizado : p)));
    return actualizado;
  };

  const deletePago = async (id: number) => {
    await pagosApi.remove(id);
    setPagos((prev) => prev.filter((p) => p.id !== id));
  };

  return {
    pagos,
    loading,
    error,
    refetch: fetchPagos,
    createPago,
    updatePago,
    deletePago,
  };
}
