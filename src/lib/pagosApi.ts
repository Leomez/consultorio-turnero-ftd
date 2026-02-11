import { apiClient } from '@/lib/api';
import type { Paciente } from '@/lib/pacientesApi';
import type { Turno } from '@/lib/turnosApi';

export type MetodoPago = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA';
export type EstadoPago = 'PENDIENTE' | 'PAGADO' | 'ANULADO';

export interface Pago {
  id: number;
  pacienteId: number;
  turnoId?: number | null;

  // Ojo: Prisma suele serializar Decimal como string
  monto: string; // p.ej. "1500.00"
  fecha: string;
  metodo: MetodoPago;
  estado: EstadoPago;
  observacion?: string | null;

  paciente: Paciente;
  turno?: Turno | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePagoPayload {
  pacienteId: number;
  turnoId: number;
  monto: number;         // en el front trabajamos con number
  metodo: MetodoPago;
  observacion?: string;
  estado?: EstadoPago;
}

export type UpdatePagoPayload = Partial<CreatePagoPayload>;

export const pagosApi = {
  list(): Promise<Pago[]> {
    return apiClient.get<Pago[]>('/pagos');
  },

  listByPaciente(pacienteId: number): Promise<Pago[]> {
    return apiClient.get<Pago[]>(`/pagos/paciente/${pacienteId}`);
  },

  create(data: CreatePagoPayload): Promise<Pago> {
    return apiClient.post<Pago>('/pagos', data);
  },

  update(id: number, data: UpdatePagoPayload): Promise<Pago> {
    return apiClient.patch<Pago>(`/pagos/${id}`, data);
  },

  remove(id: number): Promise<void> {
    return apiClient.delete<void>(`/pagos/${id}`);
  },
};
