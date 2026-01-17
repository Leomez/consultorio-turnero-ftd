'use client';

import { PacienteRow } from './PacienteRow';
import { usePacientes } from '@/hooks/usePacientes';
import { PacientesListSkeleton } from '@/components/skeletons/PacientesListSkeleton';

export function PacientesList() {
  const { pacientes, loading, error } = usePacientes();

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
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 py-2 border-b text-sm font-medium text-gray-500">
        <div>Nombre</div>
        <div>Email</div>
        <div className="hidden md:block">Teléfono</div>
        <div className="hidden md:block">Alta</div>
      </div>

      {pacientes.map((paciente) => (
        <PacienteRow key={paciente.id} paciente={paciente} />
      ))}
    </div>
  );
}
