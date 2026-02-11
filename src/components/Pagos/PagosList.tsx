"use client";

import { Pago, MetodoPago } from "@/lib/pagosApi";

const metodoLabels: Record<MetodoPago, string> = {
  EFECTIVO: "Efectivo",
  TARJETA: "Tarjeta",
  TRANSFERENCIA: "Transferencia",
};

const estadoColors: Record<string, string> = {
  PENDIENTE: "bg-yellow-100 text-yellow-800",
  PAGADO: "bg-green-100 text-green-800",
  ANULADO: "bg-red-100 text-red-700",
};

interface PagosListProps {
  pagos: Pago[];
  onDelete: (id: number) => void;
}

export function PagosList({ pagos, onDelete }: PagosListProps) {
  if (pagos.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-4">
        <h2 className="text-sm font-semibold mb-3">Pagos registrados</h2>
        <p className="text-sm text-gray-500">No hay pagos registrados.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">
      <h2 className="text-sm font-semibold mb-3">Pagos registrados</h2>
      <div className="space-y-3">
        {pagos.map((pago) => {
          const fecha = new Date(pago.fecha);
          const fechaStr = fecha.toLocaleDateString("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          });
          const montoNumber = Number(pago.monto);
          const montoStr = isNaN(montoNumber)
            ? pago.monto
            : montoNumber.toLocaleString("es-AR", {
                style: "currency",
                currency: "ARS",
              });

          return (
            <div
              key={pago.id}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="font-medium">
                  {pago.paciente?.nombre ?? "Paciente"}
                </div>
                <div className="text-xs text-gray-500">
                  {pago.paciente?.dni
                    ? `DNI ${pago.paciente.dni}`
                    : "Sin DNI registrado"}
                </div>
                {pago.turno && (
                  <div className="text-xs text-gray-500">
                    Turno:{" "}
                    {new Date(pago.turno.fecha).toLocaleString("es-AR")}
                  </div>
                )}
                {pago.observacion && (
                  <div className="text-xs text-gray-600 mt-0.5">
                    {pago.observacion}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <span className="text-xs text-gray-500">{fechaStr}</span>
                <span className="text-sm font-semibold">{montoStr}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                  {metodoLabels[pago.metodo]}
                </span>
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                    estadoColors[pago.estado] ??
                    "bg-gray-100 text-gray-700"
                  }`}
                >
                  {pago.estado}
                </span>
                <button
                  type="button"
                  onClick={() => onDelete(pago.id)}
                  className="px-2 py-1 text-[11px] rounded bg-red-100 text-red-700 hover:bg-red-200"
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
