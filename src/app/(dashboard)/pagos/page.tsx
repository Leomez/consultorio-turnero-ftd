"use client";

import { useState, useMemo, FormEvent } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { usePacientes } from "@/hooks/usePacientes";
import { useTurnos } from "@/hooks/useTurnos";
import { usePagos } from "@/hooks/usePagos";
import { MetodoPago } from "@/lib/pagosApi";
import { PagoForm, PagoFormState } from "@/components/Pagos/PagoForm";
import { PagosList } from "@/components/Pagos/PagosList";

export default function PagosPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  const [selectedPacienteId, setSelectedPacienteId] = useState<number | null>(
    null
  );

  const { pacientes, loading: pacientesLoading } = usePacientes();
  const { turnos } = useTurnos();
  const {
    pagos,
    loading: pagosLoading,
    error: pagosError,
    createPago,
    deletePago,
  } = usePagos(selectedPacienteId ?? undefined);

  const [form, setForm] = useState<PagoFormState>({
    pacienteId: "",
    turnoId: "",
    monto: "",
    metodo: "EFECTIVO",
    observacion: "",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const turnosPaciente = useMemo(
    () =>
      selectedPacienteId
        ? turnos.filter((t) => t.pacienteId === selectedPacienteId)
        : [],
    [turnos, selectedPacienteId]
  );

  if (authLoading || pagosLoading) return <div>Cargando...</div>;
  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.pacienteId || !form.monto || !form.turnoId) {
      setFormError("Paciente, turno y monto son obligatorios.");
      return;
    }

    const montoNumber = Number(form.monto);
    if (Number.isNaN(montoNumber) || montoNumber <= 0) {
      setFormError("El monto debe ser un número mayor a 0.");
      return;
    }

    try {
      setSubmitting(true);
      await createPago({
        pacienteId: Number(form.pacienteId),
        turnoId: Number(form.turnoId),
        monto: montoNumber,
        metodo: form.metodo as MetodoPago,
        observacion: form.observacion || undefined,
      });

      setForm({
        pacienteId: "",
        turnoId: "",
        monto: "",
        metodo: "EFECTIVO",
        observacion: "",
      });
      setSelectedPacienteId(null);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Error al registrar el pago";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que deseas eliminar este pago?")) return;
    await deletePago(id);
  };

  const handlePacienteChange = (id: number | null, asString: string) => {
    setSelectedPacienteId(id);
    // si borramos paciente, limpiamos errores y turnos
    if (!asString) {
      setFormError(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">Pagos</h1>
        <p className="text-gray-600 text-sm">
          Registra y consulta los pagos de los pacientes.
        </p>
      </div>

      {/* Formulario */}
      <PagoForm
        form={form}
        onChange={setForm}
        onSubmit={handleSubmit}
        submitting={submitting}
        error={formError}
        pacientes={pacientes}
        pacientesLoading={pacientesLoading}
        turnosPaciente={turnosPaciente}
        selectedPacienteId={selectedPacienteId}
        onPacienteChange={handlePacienteChange}
      />

      {/* Errores de carga */}
      {pagosError && (
        <div className="bg-white rounded-xl shadow-sm p-3 text-sm text-red-600">
          {pagosError}
        </div>
      )}

      {/* Lista */}
      <PagosList pagos={pagos} onDelete={handleDelete} />
    </div>
  );
}
