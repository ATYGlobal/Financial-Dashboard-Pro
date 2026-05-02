'use client';
import { useState } from 'react';
import type { IncomeSources, Scenario } from '@/types';
import { INCOME_TYPES, INCOME_CATEGORIES, SCENARIO_LABELS } from '@/types';

interface Props {
  initial: Partial<IncomeSources>;
  onSave: (data: Partial<IncomeSources>) => void;
  onCancel: () => void;
}

export default function IncomeForm({ initial, onSave, onCancel }: Props) {
  const [form, setForm] = useState<Partial<IncomeSources>>({
    type: INCOME_TYPES[0],
    category: 'Trabajo',
    description: '',
    monthly_amount: 0,
    start_date: new Date().toISOString().slice(0, 10),
    end_date: null,
    status: 'active',
    scenario: 2,
    notes: '',
    ...initial,
  });

  function set(key: keyof IncomeSources, val: unknown) {
    setForm(f => ({ ...f, [key]: val }));
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-t-2xl md:rounded-xl w-full max-w-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">{initial.id ? 'Editar ingreso' : 'Nuevo ingreso'}</h2>

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-xs text-gray-600 block mb-1">Descripción *</label>
            <input value={form.description ?? ''} onChange={e => set('description', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm" placeholder="Ej: Salario empresa X" />
          </div>

          <div>
            <label className="text-xs text-gray-600 block mb-1">Tipo</label>
            <select value={form.type} onChange={e => set('type', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
              {INCOME_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-600 block mb-1">Categoría</label>
            <select value={form.category} onChange={e => set('category', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
              {INCOME_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-600 block mb-1">Importe mensual (€) *</label>
            <input type="number" step="0.01" value={form.monthly_amount ?? 0}
              onChange={e => set('monthly_amount', parseFloat(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="text-xs text-gray-600 block mb-1">Escenario</label>
            <select value={form.scenario} onChange={e => set('scenario', Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
              {([1,2,3] as Scenario[]).map(s => <option key={s} value={s}>{SCENARIO_LABELS[s]}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-600 block mb-1">Fecha inicio *</label>
            <input type="date" value={form.start_date ?? ''}
              onChange={e => set('start_date', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="text-xs text-gray-600 block mb-1">Fecha fin (vacío = indefinido)</label>
            <input type="date" value={form.end_date ?? ''}
              onChange={e => set('end_date', e.target.value || null)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm" />
          </div>

          <div>
            <label className="text-xs text-gray-600 block mb-1">Estado</label>
            <select value={form.status} onChange={e => set('status', e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm">
              <option value="active">Activo</option>
              <option value="planned">Previsto</option>
              <option value="finished">Finalizado</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="text-xs text-gray-600 block mb-1">Notas</label>
            <textarea value={form.notes ?? ''} onChange={e => set('notes', e.target.value)}
              rows={2} className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none" />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onCancel}
            className="px-4 py-2 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={() => onSave(form)}
            className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}