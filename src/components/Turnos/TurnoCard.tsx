'use client';

import { Turno, EstadoTurno } from '@/lib/turnosApi';

const estadoStyles: Record<EstadoTurno, string> = {
  PENDIENTE: 'bg-yellow-100 text-yellow-800',
  CONFIRMADO: 'bg-green-100 text-green-800',
  CANCELADO: 'bg-red-100 text-red-700',
};

interface TurnoCardProps {
  turno: Turno;
  onEdit: () => void;
  onCancelar: () => void;
  onEliminar: () => void;
}

export function TurnoCard({ turno, onEdit, onCancelar, onEliminar }: TurnoCardProps) {
  const fecha = new Date(turno.fecha);
  const fechaStr = fecha.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
  const horaStr = fecha.toLocaleTimeString('es-AR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="font-medium">{turno.paciente.nombre}</div>
        <div className="text-xs text-gray-500">
          DNI {turno.paciente.dni} · Odontólogo: {turno.odontologo.nombre}
        </div>
        {turno.motivo && (
          <div className="text-xs text-gray-500 mt-0.5">
            {turno.motivo}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:justify-end">
        <span className="text-xs text-gray-500">
          {fechaStr} · {horaStr}
        </span>
        <span
          className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${estadoStyles[turno.estado]}`}
        >
          {turno.estado}
        </span>
        <button
          type="button"
          onClick={onEdit}
          className="px-2 py-1 text-[11px] rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={onCancelar}
          className="px-2 py-1 text-[11px] rounded bg-orange-100 text-orange-800 hover:bg-orange-200"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onEliminar}
          className="px-2 py-1 text-[11px] rounded bg-red-100 text-red-700 hover:bg-red-200"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
