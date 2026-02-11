'use client';

import { useEffect, useState } from 'react';
import { dashboardApi, DashboardStats } from '@/lib/dashboardApi';

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await dashboardApi.getStats();
        setStats(data);
      } catch (err) {
        setError('Error al cargar estadísticas');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return { stats, loading, error };
}
