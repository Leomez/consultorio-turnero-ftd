import { apiClient } from '@/lib/api';

export interface DashboardStats {
  totalPacientes: number;
  turnosHoy: number;
  turnosPendientesHoy: number;
  turnosFuturos: number;
}

export const dashboardApi = {
  getStats(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>('/stats/dashboard');
  },
};
