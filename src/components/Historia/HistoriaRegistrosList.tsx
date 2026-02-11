"use client";

import { HistoriaRegistro } from "@/lib/historiaApi";

interface HistoriaRegistrosListProps {
    registros: HistoriaRegistro[];
}

export function HistoriaRegistrosList({ registros }: HistoriaRegistrosListProps) {

    console.log(registros);

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
            <h2 className="text-sm font-semibold">Registros</h2>
            {registros.length === 0 ? (
                <p className="text-sm text-gray-500">
                    No hay registros cargados aún.
                </p>
            ) : (
                <div className="space-y-3">
                    {registros.map((r) => (

                        <div
                            key={r.id}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-medium">
                                    {new Date(r.fecha).toLocaleDateString("es-AR")}
                                </span>
                                
                
                                <span className="text-xs text-gray-500">
                                    Odontólogo: {r.odontologo?.nombre ?? 'Desconocido'}
                                </span>
                            </div>
                            <div className="mt-1 text-xs text-gray-800">
                                <strong>Diagnóstico:</strong> {r.diagnostico}
                            </div>
                            <div className="mt-0.5 text-xs text-gray-800">
                                <strong>Tratamiento:</strong> {r.tratamiento}
                            </div>
                            {r.observaciones && (
                                <div className="mt-0.5 text-xs text-gray-600">
                                    <strong>Observaciones:</strong> {r.observaciones}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
