import { Paciente } from '@/hooks/usePacientes';

export function PacienteRow({ paciente }: { paciente: Paciente }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 py-3 border-b text-sm">
      <div className="font-medium">{paciente.nombre}</div>
      <div className="text-gray-600 truncate">{paciente.dni}</div>
      <div className="hidden md:block">{paciente.telefono}</div>
      <div className="hidden md:block text-gray-500">
        {new Date(paciente.createdAt).toLocaleDateString()}
      </div>
    </div>
  );
}
