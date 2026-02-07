import { apiClient } from '@/lib/api';

export interface Paciente {
  id: number;
  nombre: string;
  dni: string;
  telefono: string;
  createdAt: string;
}

export const pacientesApi = {
  list(): Promise<Paciente[]> {
    return apiClient.get<Paciente[]>('/pacientes');
  },

  create(data: Omit<Paciente, 'id' | 'createdAt'>): Promise<Paciente> {
    return apiClient.post<Paciente>('/pacientes', data);
  },

  update(id: number, data: Partial<Paciente>): Promise<Paciente> {
    return apiClient.put<Paciente>(`/pacientes/${id}`, data);
  },

  remove(id: number): Promise<void> {
    return apiClient.delete<void>(`/pacientes/${id}`);
  },
};

