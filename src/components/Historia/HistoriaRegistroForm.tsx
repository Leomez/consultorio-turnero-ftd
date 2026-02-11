"use client";

import { Odontologo } from "@/lib/odontologosApi";

export interface HistoriaRegistroFormState {
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
  odontologoId: string;
}

interface HistoriaRegistroFormProps {
  form: HistoriaRegistroFormState;
  onChange: (value: HistoriaRegistroFormState) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  error?: string | null;
  odontologos: Odontologo[];
  odontologosLoading: boolean;
}

export function HistoriaRegistroForm({
  form,
  onChange,
  onSubmit,
  submitting,
  error,
  odontologos,
  odontologosLoading,
}: HistoriaRegistroFormProps) {
  const updateField = (
    field: keyof HistoriaRegistroFormState,
    value: string,
  ) => onChange({ ...form, [field]: value });

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
      <h2 className="text-sm font-semibold">Nuevo registro</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">
              Diagnóstico
            </label>
            <input
              type="text"
              value={form.diagnostico}
              onChange={(e) => updateField("diagnostico", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">
              Tratamiento
            </label>
            <input
              type="text"
              value={form.tratamiento}
              onChange={(e) => updateField("tratamiento", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">
              Odontólogo
            </label>
            <select
              value={form.odontologoId}
              onChange={(e) => updateField("odontologoId", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
              disabled={odontologosLoading}
            >
              <option value="">
                {odontologosLoading
                  ? "Cargando odontólogos..."
                  : "Seleccionar odontólogo"}
              </option>
              {odontologos.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.nombre} · {o.email}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">
              Observaciones
            </label>
            <input
              type="text"
              value={form.observaciones}
              onChange={(e) => updateField("observaciones", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              placeholder="Opcional"
            />
          </div>
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 text-xs rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {submitting ? "Guardando..." : "Agregar registro"}
          </button>
        </div>
      </form>
    </div>
  );
}
