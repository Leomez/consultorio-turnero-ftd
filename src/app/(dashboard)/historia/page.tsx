"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { usePacientes } from "@/hooks/usePacientes";
import { useOdontologos } from "@/hooks/useOdontologos";
import { useHistoriaClinica } from "@/hooks/useHistoriaClinica";
import { HistoriaRegistroForm, HistoriaRegistroFormState } from "@/components/Historia/HistoriaRegistroForm";
import { HistoriaRegistrosList } from "@/components/Historia/HistoriaRegistrosList";


export default function HistoriaPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const { pacientes, loading: pacientesLoading } = usePacientes();
    const { odontologos, loading: odontologosLoading } = useOdontologos();

    const [pacienteId, setPacienteId] = useState<number | null>(null);
    const [historiaActionError, setHistoriaActionError] = useState<string | null>(null);



    const {
        historia,
        registros,
        loading: historiaLoading,
        error,
        crearHistoria,
        crearRegistro,
    } = useHistoriaClinica(pacienteId);

    const [form, setForm] = useState<HistoriaRegistroFormState>({
        diagnostico: "",
        tratamiento: "",
        observaciones: "",
        odontologoId: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        // Limpiar errores al cambiar de paciente o historia
        setForm({
            diagnostico: "",
            tratamiento: "",
            observaciones: "",
            odontologoId: "",
        });
        setFormError(null);
        setHistoriaActionError(null);
    }, [pacienteId]);

    if (authLoading) return <div>Cargando...</div>;
    if (!isAuthenticated) {
        router.push("/login");
        return null;
    }

    const handleCreateHistoria = async () => {
        if (!pacienteId) return;
        setHistoriaActionError(null);
        try {
            await crearHistoria();
        } catch (e) {
            const msg =
                e instanceof Error ? e.message : "Error al crear historia clínica";
            setHistoriaActionError(msg);
        }
    };

    const handleSubmitRegistro = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!historia) {
            setFormError("Primero crea la historia clínica del paciente.");
            return;
        }
        if (!form.diagnostico.trim() || !form.tratamiento.trim() || !form.odontologoId) {
            setFormError("Diagnóstico, tratamiento y odontólogo son obligatorios.");
            return;
        }

        try {
            setSubmitting(true);
            await crearRegistro({
                diagnostico: form.diagnostico,
                tratamiento: form.tratamiento,
                observaciones: form.observaciones || undefined,
                odontologoId: Number(form.odontologoId),
            });
            setForm({
                diagnostico: "",
                tratamiento: "",
                observaciones: "",
                odontologoId: "",
            });
        } catch (e) {
            const msg =
                e instanceof Error ? e.message : "Error al crear registro";
            setFormError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Historia Clínica</h1>

            {/* Selección de paciente */}
            <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
                <h2 className="text-sm font-semibold">Seleccionar paciente</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <select
                        value={pacienteId ?? ""}
                        onChange={(e) =>
                            setPacienteId(e.target.value ? Number(e.target.value) : null)
                        }
                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                        disabled={pacientesLoading}
                    >
                        <option value="">
                            {pacientesLoading ? "Cargando pacientes..." : "Seleccionar paciente"}
                        </option>
                        {pacientes.map((p) => (
                            <option key={p.id} value={p.id}>
                                {p.nombre} · {p.dni}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {pacienteId && (
                <>
                    {/* Estado de la historia */}
                    <div className="bg-white rounded-xl shadow-sm p-4 space-y-2">
                        {historiaLoading ? (
                            <p className="text-sm text-gray-500">Cargando historia clínica...</p>
                        ) : historia ? (
                            <>
                                <p className="text-sm text-gray-700">
                                    Historia clínica creada el{" "}
                                    {new Date(historia.createdAt).toLocaleDateString("es-AR")}
                                    {" para "}
                                    <span className="font-medium">
                                        {historia.paciente.nombre} (DNI {historia.paciente.dni})
                                    </span>
                                    .
                                </p>
                            </>
                        ) : (
                            <>
                                <p className="text-sm text-gray-700">
                                    El paciente seleccionado no tiene una historia clínica creada aún.
                                </p>
                                <button
                                    type="button"
                                    onClick={handleCreateHistoria}
                                    className="mt-2 px-4 py-2 text-xs rounded bg-blue-600 text-white hover:bg-blue-700"
                                >
                                    Crear historia clínica
                                </button>
                            </>
                        )}

                        {historia && (error || historiaActionError) && (
                            <p className="text-xs text-red-600 mt-2">
                                {historiaActionError ?? error}
                            </p>
                        )}


                    </div>

                    {/* Formulario nuevo registro */}
                    {historia && (
                        <HistoriaRegistroForm
                            form={form}
                            onChange={setForm}
                            onSubmit={handleSubmitRegistro}
                            submitting={submitting}
                            error={formError}
                            odontologos={odontologos}
                            odontologosLoading={odontologosLoading}
                        />
                    )}

                    {/* Listado de registros */}
                    {historia && (
                        <HistoriaRegistrosList registros={registros} />
                    )}
                </>
            )}
        </div>
    );
}
