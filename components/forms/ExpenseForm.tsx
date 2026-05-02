'use client';
import { useState } from 'react';
import type { ExpenseItem, Scenario } from '@/types';
import {
  EXPENSE_TYPES,
  EXPENSE_PRIORITIES,
  EXPENSE_CATEGORIES,
  SCENARIO_LABELS,
} from '@/types';

interface Props {
  initial: Partial<ExpenseItem>;
  onSave: (data: Partial<ExpenseItem>) => void;
  onCancel: () => void;
}

export default function ExpenseForm({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Partial<ExpenseItem>>({
    category:       'Vivienda',
    subcategory:    '',
    description:    '',
    monthly_amount: 0,
    start_date:     new Date().toISOString().slice(0, 10),
    end_date:       null,
    type:           'Fijo',
    priority:       'Esencial',
    scenario:       1,
    status:         'active',
    notes:          '',
    ...initial,
  });

  function set(key: keyof ExpenseItem, val: unknown) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function handleSubmit() {
    if (!form.description?.trim()) {
      alert('La descripción es obligatoria.');
      return;
    }
    if (!form.start_date) {
      alert('La fecha de inicio es obligatoria.');
      return;
    }
    onSave(form);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-t-2xl md:rounded-xl w-full max-w-lg p-6 space-y-4 max-h-[92vh] overflow-y-auto">

        <h2 className="text-lg font-semibold text-gray-900">
          {initial.id ? 'Editar gasto' : 'Nuevo gasto'}
        </h2>

        <div className="grid grid-cols-2 gap-3">

          {/* Descripción */}
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Descripción <span className="text-red-500">*</span>
            </label>
            <input
              value={form.description ?? ''}
              onChange={e => set('description', e.target.value)}
              placeholder="Ej: Alquiler piso"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Categoría</label>
            <select
              value={form.category}
              onChange={e => set('category', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {EXPENSE_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Subcategoría */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Subcategoría</label>
            <input
              value={form.subcategory ?? ''}
              onChange={e => set('subcategory', e.target.value)}
              placeholder="Opcional"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Importe */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Importe mensual (€) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.monthly_amount ?? 0}
              onChange={e => set('monthly_amount', parseFloat(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Tipo</label>
            <select
              value={form.type}
              onChange={e => set('type', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {EXPENSE_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Prioridad */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Prioridad</label>
            <select
              value={form.priority}
              onChange={e => set('priority', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {EXPENSE_PRIORITIES.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* Escenario */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Escenario</label>
            <select
              value={form.scenario}
              onChange={e => set('scenario', Number(e.target.value) as Scenario)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {([1, 2, 3] as Scenario[]).map(s => (
                <option key={s} value={s}>{SCENARIO_LABELS[s]}</option>
              ))}
            </select>
          </div>

          {/* Fecha inicio */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Fecha inicio <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.start_date ?? ''}
              onChange={e => set('start_date', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Fecha fin */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">
              Fecha fin <span className="text-gray-400">(vacío = indefinido)</span>
            </label>
            <input
              type="date"
              value={form.end_date ?? ''}
              onChange={e => set('end_date', e.target.value || null)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Estado */}
          <div>
            <label className="text-xs font-medium text-gray-600 block mb-1">Estado</label>
            <select
              value={form.status}
              onChange={e => set('status', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Activo</option>
              <option value="planned">Previsto</option>
              <option value="finished">Finalizado</option>
            </select>
          </div>

          {/* Notas */}
          <div className="col-span-2">
            <label className="text-xs font-medium text-gray-600 block mb-1">Notas</label>
            <textarea
              value={form.notes ?? ''}
              onChange={e => set('notes', e.target.value)}
              rows={2}
              placeholder="Opcional"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Acciones */}
        <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            {initial.id ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}