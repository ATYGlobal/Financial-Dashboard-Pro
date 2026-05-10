"use client";

import { useState } from "react";
import type { ExpenseItem, Scenario } from "@/types";
import { EXPENSE_TYPES, EXPENSE_PRIORITIES, EXPENSE_CATEGORIES, SCENARIO_LABELS } from "@/types";
import Modal from "@/components/ui/Modal";
import ActionButton from "@/components/ui/ActionButton";
import { FormField, TextInput, SelectInput, TextareaInput } from "@/components/ui/FormField";

interface Props {
  initial: Partial<ExpenseItem>;
  onSave: (data: Partial<ExpenseItem>) => void;
  onCancel: () => void;
}

export default function ExpenseForm({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Partial<ExpenseItem>>({
    category: "Vivienda", subcategory: "", description: "",
    monthly_amount: 0, start_date: new Date().toISOString().slice(0, 10),
    end_date: null, type: "Fijo", priority: "Esencial",
    scenario: 1, status: "active", notes: "",
    ...initial,
  });

  function set(key: keyof ExpenseItem, val: unknown) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleSubmit() {
    if (!form.description?.trim()) { alert("La descripcion es obligatoria."); return; }
    if (!form.start_date) { alert("La fecha de inicio es obligatoria."); return; }
    onSave(form);
  }

  return (
    <Modal
      title={initial.id ? "Editar gasto" : "Nuevo gasto"}
      subtitle="Rellena los datos del gasto"
      onClose={onCancel}
      footer={
        <>
          <ActionButton variant="secondary" onClick={onCancel}>Cancelar</ActionButton>
          <ActionButton variant="primary" onClick={handleSubmit}>
            {initial.id ? "Actualizar" : "Guardar"}
          </ActionButton>
        </>
      }
    >
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Descripcion" required fullWidth>
          <TextInput value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} placeholder="Ej: Kaltmiete" />
        </FormField>
        <FormField label="Categoria">
          <SelectInput value={form.category} onChange={(e) => set("category", e.target.value)}>
            {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </SelectInput>
        </FormField>
        <FormField label="Subcategoria">
          <TextInput value={form.subcategory ?? ""} onChange={(e) => set("subcategory", e.target.value)} placeholder="Opcional" />
        </FormField>
        <FormField label="Importe mensual (EUR)" required>
          <TextInput type="number" step="0.01" min="0" value={form.monthly_amount ?? 0} onChange={(e) => set("monthly_amount", parseFloat(e.target.value) || 0)} />
        </FormField>
        <FormField label="Tipo">
          <SelectInput value={form.type} onChange={(e) => set("type", e.target.value)}>
            {EXPENSE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </SelectInput>
        </FormField>
        <FormField label="Prioridad">
          <SelectInput value={form.priority} onChange={(e) => set("priority", e.target.value)}>
            {EXPENSE_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </SelectInput>
        </FormField>
        <FormField label="Escenario">
          <SelectInput value={form.scenario} onChange={(e) => set("scenario", Number(e.target.value) as Scenario)}>
            {([1, 2, 3] as Scenario[]).map((s) => <option key={s} value={s}>{SCENARIO_LABELS[s]}</option>)}
          </SelectInput>
        </FormField>
        <FormField label="Estado">
          <SelectInput value={form.status} onChange={(e) => set("status", e.target.value)}>
            <option value="active">Activo</option>
            <option value="planned">Previsto</option>
            <option value="finished">Finalizado</option>
          </SelectInput>
        </FormField>
        <FormField label="Fecha inicio" required>
          <TextInput type="date" value={form.start_date ?? ""} onChange={(e) => set("start_date", e.target.value)} />
        </FormField>
        <FormField label="Fecha fin" hint="Vacio = indefinido">
          <TextInput type="date" value={form.end_date ?? ""} onChange={(e) => set("end_date", e.target.value || null)} />
        </FormField>
        <FormField label="Notas" fullWidth>
          <TextareaInput rows={2} value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} placeholder="Opcional" />
        </FormField>
      </div>
    </Modal>
  );
}