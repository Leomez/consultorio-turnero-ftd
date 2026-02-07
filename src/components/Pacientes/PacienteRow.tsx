import { Paciente } from '@/lib/pacientesApi';

interface PacienteRowProps {
  paciente: Paciente;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function PacienteRow({ paciente, onEdit, onDelete }: PacienteRowProps) {
  const fechaAlta = new Date(paciente.createdAt).toLocaleDateString();

  return (
    <div className="border-b px-4 py-3 text-sm">
      {/* Vista mobile (card) */}
      <div className="flex flex-col gap-2 md:hidden">
        <div>
          <div className="font-medium">{paciente.nombre}</div>
          <div className="text-gray-500 text-xs">{paciente.dni}</div>
        </div>

        <div className="flex justify-between text-xs text-gray-500">
          <span>{paciente.telefono || 'Sin teléfono'}</span>
          <span>{fechaAlta}</span>
        </div>

        <div className="flex justify-end gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="px-3 py-1 text-xs rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="px-3 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>

      {/* Vista desktop (tabla) */}
      <div className="hidden md:grid md:grid-cols-5 md:items-center md:gap-4">
        <div className="font-medium">{paciente.nombre}</div>
        <div className="text-gray-600 truncate">{paciente.dni}</div>
        <div>{paciente.telefono}</div>
        <div className="text-gray-500">{fechaAlta}</div>
        <div className="flex justify-end gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
            >
              Editar
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
            >
              Eliminar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
