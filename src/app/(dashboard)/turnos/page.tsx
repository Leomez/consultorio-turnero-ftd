"use client";

import { useMemo, useState, FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useTurnos } from "@/hooks/useTurnos";
import { useOdontologos } from "@/hooks/useOdontologos";
import { usePacientes } from "@/hooks/usePacientes";
import { TurnoCard } from "@/components/Turnos/TurnoCard";
import { TurnoForm, TurnoFormState } from "@/components/Turnos/TurnoForm";


import type { EstadoTurno } from "@/lib/turnosApi";

const estadoStyles: Record<EstadoTurno, string> = {
    PENDIENTE: "bg-yellow-100 text-yellow-800",
    CONFIRMADO: "bg-green-100 text-green-800",
    CANCELADO: "bg-red-100 text-red-700",
};

const emptyForm: TurnoFormState = {
    fecha: "",
    hora: "",
    motivo: "",
    pacienteId: "",
    odontologoId: "",
    estado: "PENDIENTE",
};

export default function TurnosPage() {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const { odontologos, loading: odontologosLoading } = useOdontologos();
    const router = useRouter();

    const {
        turnos,
        loading: turnosLoading,
        error,
        createTurno,
        updateTurno,
        deleteTurno,
    } = useTurnos();

    const { pacientes } = usePacientes();

    const [selectedDate, setSelectedDate] = useState<string>("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const filteredTurnos = useMemo(() => {
        if (!selectedDate) return turnos;
        return turnos.filter((t) => t.fecha.slice(0, 10) === selectedDate);
    }, [turnos, selectedDate]);

    if (authLoading || turnosLoading) return <div>Cargando...</div>;

    if (!isAuthenticated) {
        router.push("/login");
        return null;
    }

    const handleOpenNew = () => {
        setEditingId(null);
        setForm(emptyForm);
        setFormError(null);
        setShowForm(true);
    };

    const handleEdit = (id: number) => {
        const turno = turnos.find((t) => t.id === id);
        if (!turno) return;

        const fechaObj = new Date(turno.fecha);
        const fecha = turno.fecha.slice(0, 10);
        const hora = fechaObj.toTimeString().slice(0, 5); // HH:MM

        setEditingId(id);
        setForm({
            fecha,
            hora,
            motivo: turno.motivo || "",
            pacienteId: String(turno.pacienteId),
            odontologoId: String(turno.odontologoId),
            estado: turno.estado,
        });
        setFormError(null);
        setShowForm(true);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!form.fecha || !form.hora || !form.pacienteId || !form.odontologoId) {
            setFormError("Fecha, hora, paciente y odontólogo son obligatorios.");
            return;
        }

        const fechaIso = new Date(`${form.fecha}T${form.hora}:00`).toISOString();

        const payloadBase = {
            fecha: fechaIso,
            motivo: form.motivo || undefined,
            estado: form.estado,
            pacienteId: Number(form.pacienteId),
            odontologoId: Number(form.odontologoId),
        };

        try {
            setSubmitting(true);

            if (editingId === null) {
                await createTurno(payloadBase);
            } else {
                await updateTurno(editingId, payloadBase);
            }

            setForm(emptyForm);
            setEditingId(null);
            setShowForm(false);
        } catch (err) {
            const msg =
                err instanceof Error ? err.message : "Error al guardar el turno";
            setFormError(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCancelarTurno = async (id: number) => {
        if (!confirm("¿Seguro que deseas cancelar este turno?")) return;
        await updateTurno(id, { estado: "CANCELADO" });
    };

    const handleEliminarTurno = async (id: number) => {
        if (!confirm("¿Seguro que deseas eliminar este turno?")) return;
        await deleteTurno(id);
    };

    return (
        <div className="space-y-4">
            {/* Header + filtros + acción */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Turnos</h1>
                    <p className="text-gray-600 text-sm">
                        Consulta y gestiona los turnos futuros del consultorio.
                    </p>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <label className="text-sm text-gray-600">
                        Fecha
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="mt-1 w-full sm:w-auto border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                        />
                    </label>
                    {selectedDate && (
                        <button
                            type="button"
                            onClick={() => setSelectedDate("")}
                            className="text-xs text-blue-600 hover:underline self-end sm:self-auto"
                        >
                            Limpiar filtro
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={handleOpenNew}
                        className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition"
                    >
                        {editingId === null ? "Nuevo turno" : "Nuevo turno"}
                    </button>
                </div>
            </div>

            {/* Formulario alta / edición */}
            {showForm && (
                <TurnoForm
                    mode={editingId === null ? "create" : "edit"}
                    form={form}
                    onChange={setForm}
                    onSubmit={handleSubmit}
                    onCancel={() => {
                        setShowForm(false);
                        setEditingId(null);
                        setForm(emptyForm);
                        setFormError(null);
                    }}
                    submitting={submitting}
                    error={formError}
                    pacientes={pacientes}
                    odontologos={odontologos}
                    odontologosLoading={odontologosLoading}
                />
            )}


            {error && (
                <div className="bg-white p-3 rounded-lg text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Lista de turnos */}
            <div className="bg-white rounded-xl shadow-sm p-4">
                {filteredTurnos.length === 0 ? (
                    <p className="text-gray-500 text-sm">
                        {selectedDate
                            ? "No hay turnos para la fecha seleccionada."
                            : "No hay turnos futuros registrados."}
                    </p>
                ) : (
                    <div className="space-y-3">
                        {filteredTurnos.map((turno) => (
                            <TurnoCard
                                key={turno.id}
                                turno={turno}
                                onEdit={() => handleEdit(turno.id)}
                                onCancelar={() => handleCancelarTurno(turno.id)}
                                onEliminar={() => handleEliminarTurno(turno.id)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
