import { apiClient } from '@/lib/api';

export type EstadoTurno = 'PENDIENTE' | 'CONFIRMADO' | 'CANCELADO';

export interface TurnoPaciente {
  id: number;
  nombre: string;
  dni: string;
  telefono?: string | null;
  createdAt: string;
}

export interface TurnoOdontologo {
  id: number;
  nombre: string;
  email: string;
  role: 'ADMIN' | 'ODONTOLOGO' | 'SECRETARIA';
  createdAt: string;
}

export interface Turno {
  id: number;
  fecha: string;         // ISO string
  motivo?: string | null;
  estado: EstadoTurno;

  pacienteId: number;
  odontologoId: number;

  createdAt: string;

  paciente: TurnoPaciente;
  odontologo: TurnoOdontologo;
}

export interface CreateTurnoPayload {
  fecha: string;                 // ej: '2025-09-20T10:30:00.000Z'
  motivo?: string;
  estado?: EstadoTurno;         // si no se envía, backend usa PENDIENTE
  pacienteId: number;
  odontologoId: number;
}

export type UpdateTurnoPayload = Partial<CreateTurnoPayload>;

export const turnosApi = {
  // Turnos futuros (backend ya filtra por fecha >= hoy)
  list(): Promise<Turno[]> {
    return apiClient.get<Turno[]>('/turnos');
  },

  // Turnos por fecha (yyyy-mm-dd) y opcionalmente por odontólogo
  listByDate(date: string, odontologoId?: number): Promise<Turno[]> {
    let endpoint = `/turnos/fecha/${date}`;
    if (odontologoId) {
      endpoint += `?odontologo=${odontologoId}`;
    }
    return apiClient.get<Turno[]>(endpoint);
  },

  create(data: CreateTurnoPayload): Promise<Turno> {
    return apiClient.post<Turno>('/turnos', data);
  },

  update(id: number, data: UpdateTurnoPayload): Promise<Turno> {
    return apiClient.patch<Turno>(`/turnos/${id}`, data);
  },

  remove(id: number): Promise<void> {
    return apiClient.delete<void>(`/turnos/${id}`);
  },
};
