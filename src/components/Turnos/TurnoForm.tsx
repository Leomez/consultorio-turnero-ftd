'use client';

import { FormEvent } from 'react';
import { EstadoTurno } from '@/lib/turnosApi';
import { Paciente } from '@/lib/pacientesApi';
import { Odontologo } from '@/lib/odontologosApi';

export interface TurnoFormState {
  fecha: string;
  hora: string;
  motivo: string;
  pacienteId: string;
  odontologoId: string;
  estado: EstadoTurno;
}

interface TurnoFormProps {
  mode: 'create' | 'edit';
  form: TurnoFormState;
  onChange: (value: TurnoFormState) => void;
  onSubmit: (e: FormEvent) => void;
  onCancel: () => void;
  submitting: boolean;
  error?: string | null;
  pacientes: Paciente[];
  odontologos: Odontologo[];
  odontologosLoading: boolean;
}

export function TurnoForm({
  mode,
  form,
  onChange,
  onSubmit,
  onCancel,
  submitting,
  error,
  pacientes,
  odontologos,
  odontologosLoading,
}: TurnoFormProps) {
  const updateField = (field: keyof TurnoFormState, value: string | EstadoTurno) =>
    onChange({ ...form, [field]: value as any });

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
      <h2 className="text-sm font-semibold mb-1">
        {mode === 'create' ? 'Crear nuevo turno' : 'Editar turno'}
      </h2>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">Fecha</label>
            <input
              type="date"
              value={form.fecha}
              onChange={(e) => updateField('fecha', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Hora</label>
            <input
              type="time"
              value={form.hora}
              onChange={(e) => updateField('hora', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Estado</label>
            <select
              value={form.estado}
              onChange={(e) => updateField('estado', e.target.value as EstadoTurno)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="PENDIENTE">Pendiente</option>
              <option value="CONFIRMADO">Confirmado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">Paciente</label>
            <select
              value={form.pacienteId}
              onChange={(e) => updateField('pacienteId', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
            >
              <option value="">Seleccionar paciente</option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} · {p.dni}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Odontólogo</label>
            <select
              value={form.odontologoId}
              onChange={(e) => updateField('odontologoId', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
              disabled={odontologosLoading}
            >
              <option value="">
                {odontologosLoading
                  ? 'Cargando odontólogos...'
                  : 'Seleccionar odontólogo'}
              </option>
              {odontologos.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.nombre} · {o.email}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1">Motivo</label>
          <input
            type="text"
            value={form.motivo}
            onChange={(e) => updateField('motivo', e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
            placeholder="Motivo del turno (opcional)"
          />
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 text-xs rounded border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {submitting
              ? 'Guardando...'
              : mode === 'create'
              ? 'Crear turno'
              : 'Actualizar turno'}
          </button>
        </div>
      </form>
    </div>
  );
}
