'use client';

import { useCallback, useEffect, useState } from 'react';
import { odontologosApi, Odontologo } from '@/lib/odontologosApi';

export function useOdontologos() {
  const [odontologos, setOdontologos] = useState<Odontologo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOdontologos = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await odontologosApi.listOdontologos();
      setOdontologos(data);
    } catch (err) {
      setError('Error al cargar odontólogos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOdontologos();
  }, [fetchOdontologos]);

  return {
    odontologos,
    loading,
    error,
    refetch: fetchOdontologos,
  };
}
