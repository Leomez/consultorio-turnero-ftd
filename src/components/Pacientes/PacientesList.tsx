'use client';
import { useState } from 'react';
import { PacienteRow } from './PacienteRow';
import { usePacientes } from '@/hooks/usePacientes';
import { PacientesListSkeleton } from '@/components/skeletons/PacientesListSkeleton';

export function PacientesList() {
  const { pacientes, loading, error, createPaciente } = usePacientes();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nombre: '',
    dni: '',
    telefono: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.nombre.trim() || !form.dni.trim() || !form.telefono.trim()) {
      setFormError('Todos los campos son obligatorios');
      return;
    }

    try {
      setSubmitting(true);
      await createPaciente(form);
      setForm({ nombre: '', dni: '', telefono: '' });
      setShowForm(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear paciente';
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <PacientesListSkeleton />;
  }

  if (error) {
    return (
      <div className="bg-white p-4 rounded-xl text-red-600">
        {error}
      </div>
    );
  }

  if (pacientes.length === 0) {
    return (
      <div className="bg-white p-4 rounded-xl text-gray-500">
        No hay pacientes registrados
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Listado de pacientes</h2>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancelar' : 'Nuevo Paciente'}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm p-4 space-y-3"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                value={form.nombre}
                onChange={(e) =>
                  setForm((f) => ({ ...f, nombre: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">DNI</label>
              <input
                type="text"
                value={form.dni}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dni: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Teléfono
              </label>
              <input
                type="text"
                value={form.telefono}
                onChange={(e) =>
                  setForm((f) => ({ ...f, telefono: e.target.value }))
                }
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              />
            </div>
          </div>

          {formError && (
            <p className="text-sm text-red-600">{formError}</p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed text-sm"
          >
            {submitting ? 'Guardando...' : 'Guardar paciente'}
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 py-2 border-b text-sm font-medium text-gray-500">
          <div>Nombre</div>
          <div>DNI</div>
          <div className="hidden md:block">Teléfono</div>
          <div className="hidden md:block">Alta</div>
        </div>

        {pacientes.length === 0 ? (
          <div className="p-4 text-gray-500">
            No hay pacientes registrados
          </div>
        ) : (
          pacientes.map((paciente) => (
            <PacienteRow key={paciente.id} paciente={paciente} />
          ))
        )}
      </div>
    </div>
  );
}
