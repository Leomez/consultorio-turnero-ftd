"use client";

import { MetodoPago } from "@/lib/pagosApi";
import { Paciente } from "@/lib/pacientesApi";
import { Turno } from "@/lib/turnosApi";

export interface PagoFormState {
  pacienteId: string;
  turnoId: string;
  monto: string;
  metodo: MetodoPago;
  observacion: string;
}

interface PagoFormProps {
  form: PagoFormState;
  onChange: (value: PagoFormState) => void;
  onSubmit: (e: React.FormEvent) => void;
  submitting: boolean;
  error?: string | null;

  pacientes: Paciente[];
  pacientesLoading: boolean;
  turnosPaciente: Turno[];

  selectedPacienteId: number | null;
  onPacienteChange: (id: number | null, asString: string) => void;
}

export function PagoForm({
  form,
  onChange,
  onSubmit,
  submitting,
  error,
  pacientes,
  pacientesLoading,
  turnosPaciente,
  selectedPacienteId,
  onPacienteChange,
}: PagoFormProps) {
  const updateField = (field: keyof PagoFormState, value: string | MetodoPago) =>
    onChange({ ...form, [field]: value as any });

  const handlePacienteSelect = (value: string) => {
    const id = value ? Number(value) : null;
    onPacienteChange(id, value);
    // reset turno cuando cambia paciente
    onChange({ ...form, pacienteId: value, turnoId: "" });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
      <h2 className="text-sm font-semibold">Registrar pago</h2>

      <form onSubmit={onSubmit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">Paciente</label>
            <select
              value={form.pacienteId}
              onChange={(e) => handlePacienteSelect(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
            >
              <option value="">
                {pacientesLoading
                  ? "Cargando pacientes..."
                  : "Seleccionar paciente"}
              </option>
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nombre} · {p.dni}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Monto</label>
            <input
              type="number"
              min={0}
              step="0.01"
              value={form.monto}
              onChange={(e) => updateField("monto", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Método</label>
            <select
              value={form.metodo}
              onChange={(e) =>
                updateField("metodo", e.target.value as MetodoPago)
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
            >
              <option value="EFECTIVO">Efectivo</option>
              <option value="TARJETA">Tarjeta</option>
              <option value="TRANSFERENCIA">Transferencia</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium mb-1">
              Turno (obligatorio)
            </label>
            <select
              value={form.turnoId}
              onChange={(e) => updateField("turnoId", e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              required
              disabled={!selectedPacienteId || turnosPaciente.length === 0}
            >
              <option value="">
                {selectedPacienteId
                  ? turnosPaciente.length === 0
                    ? "Sin turnos disponibles para este paciente"
                    : "Seleccionar turno"
                  : "Selecciona primero un paciente"}
              </option>
              {turnosPaciente.map((t) => {
                const fecha = new Date(t.fecha);
                const fechaStr = fecha.toLocaleDateString("es-AR", {
                  day: "2-digit",
                  month: "2-digit",
                });
                const horaStr = fecha.toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <option key={t.id} value={t.id}>
                    {fechaStr} · {horaStr} · {t.motivo || "Turno"}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Observación</label>
            <input
              type="text"
              value={form.observacion}
              onChange={(e) => updateField("observacion", e.target.value)}
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
            {submitting ? "Guardando..." : "Registrar pago"}
          </button>
        </div>
      </form>
    </div>
  );
}
