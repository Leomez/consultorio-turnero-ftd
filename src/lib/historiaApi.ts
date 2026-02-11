import { apiClient } from '@/lib/api';
import type { Paciente } from '@/lib/pacientesApi';
import type { Odontologo } from '@/lib/odontologosApi';

export interface HistoriaClinica {
  id: number;
  pacienteId: number;
  paciente: Paciente;
  createdAt: string;
  registros: HistoriaRegistro[];
}

export interface HistoriaRegistro {
  id: number;
  fecha: string;
  diagnostico: string;
  tratamiento: string;
  observaciones?: string | null;
  historiaId: number;
  odontologoId: number;
  odontologo: Odontologo;
  createdAt: string;
  updatedAt: string;
}

export interface CreateHistoriaPayload {
  pacienteId: number;
}

export interface CreateRegistroPayload {
  historiaId: number;
  diagnostico: string;
  tratamiento: string;
  observaciones?: string;
  odontologoId: number;
}

export interface UpdateRegistroPayload {
  diagnostico?: string;
  tratamiento?: string;
  observaciones?: string;
}

export const historiaApi = {
  // /historias-clinicas
  getByPaciente(pacienteId: number): Promise<HistoriaClinica | null> {
    return apiClient
      .get<HistoriaClinica>(`/historias-clinicas/${pacienteId}`)
      .catch((err) => {
        // si el backend devuelve 404, lo propagará como error; podrías manejarlo mejor aquí
        throw err;
      });
  },

  createHistoria(pacienteId: number): Promise<HistoriaClinica> {
    const payload: CreateHistoriaPayload = { pacienteId };
    return apiClient.post<HistoriaClinica>('/historias-clinicas', payload);
  },

  // /historias-registros
  getRegistros(historiaId: number): Promise<HistoriaRegistro[]> {
    return apiClient.get<HistoriaRegistro[]>(
      `/historias-registros/historia/${historiaId}`,
    );
  },

  createRegistro(data: CreateRegistroPayload): Promise<HistoriaRegistro> {
    return apiClient.post<HistoriaRegistro>('/historias-registros', data);
  },

  updateRegistro(
    id: number,
    data: UpdateRegistroPayload,
  ): Promise<HistoriaRegistro> {
    return apiClient.patch<HistoriaRegistro>(`/historias-registros/${id}`, data);
  },
};
