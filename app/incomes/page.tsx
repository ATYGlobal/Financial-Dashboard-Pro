'use client';

import { useEffect, useState } from 'react';
import { getIncomes, deleteIncome, upsertIncome } from '@/lib/supabase';
import { fmt } from '@/lib/calculations';
import type { IncomeSources, Scenario } from '@/types';
import { SCENARIO_LABELS, INCOME_CATEGORIES } from '@/types';
import IncomeForm from '@/components/forms/IncomeForm';
import { format } from 'date-fns';

type Filter = {
  status: string;
  category: string;
  scenario: string;
};

export default function IncomesPage() {
  const [incomes, setIncomes] = useState<IncomeSources[]>([]);
  const [editing, setEditing] = useState<Partial<IncomeSources> | null>(null);
  const [filter, setFilter] = useState<Filter>({
    status: 'active',
    category: '',
    scenario: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const data = await getIncomes();
      setIncomes(data);
    } catch (err) {
      console.error('Error loading incomes:', err);
      setError('No se pudieron cargar los ingresos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave(income: Partial<IncomeSources>) {
    try {
      await upsertIncome(income);
      setEditing(null);
      await load();
    } catch (err) {
      console.error('Error saving income:', err);
      setError('No se pudo guardar el ingreso.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este ingreso?')) return;

    try {
      await deleteIncome(id);
      await load();
    } catch (err) {
      console.error('Error deleting income:', err);
      setError('No se pudo eliminar el ingreso.');
    }
  }

  async function handleClose(income: IncomeSources) {
    try {
      await upsertIncome({
        id: income.id,
        end_date: format(new Date(), 'yyyy-MM-dd'),
        status: 'finished',
      });

      await load();
    } catch (err) {
      console.error('Error closing income:', err);
      setError('No se pudo cerrar el ingreso.');
    }
  }

  const filtered = incomes.filter((income) => {
    if (filter.status && income.status !== filter.status) return false;
    if (filter.category && income.category !== filter.category) return false;
    if (filter.scenario && income.scenario !== Number(filter.scenario)) return false;
    return true;
  });

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Cargando…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ingresos</h1>

        <button
          onClick={() => setEditing({})}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Añadir ingreso
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {(['active', 'planned', 'finished', ''] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter((current) => ({ ...current, status }))}
            className={`px-3 py-1 rounded-full text-sm border ${
              filter.status === status
                ? 'bg-blue-600 text-white border-blue-600'
                : 'border-gray-300 text-gray-600'
            }`}
          >
            {status === ''
              ? 'Todos'
              : status === 'active'
                ? 'Activos'
                : status === 'planned'
                  ? 'Previstos'
                  : 'Finalizados'}
          </button>
        ))}

        <select
          value={filter.category}
          onChange={(event) =>
            setFilter((current) => ({ ...current, category: event.target.value }))
          }
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="">Categoría</option>
          {INCOME_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={filter.scenario}
          onChange={(event) =>
            setFilter((current) => ({ ...current, scenario: event.target.value }))
          }
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="">Escenario</option>
          {([1, 2, 3] as Scenario[]).map((scenario) => (
            <option key={scenario} value={scenario}>
              {SCENARIO_LABELS[scenario]}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Descripción
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">
                Tipo
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">
                Categoría
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">
                Importe/mes
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">
                Inicio
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">
                Fin
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">
                Escenario
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filtered.map((income) => (
              <tr key={income.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{income.description}</td>

                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                  {income.type}
                </td>

                <td className="px-4 py-3 hidden md:table-cell">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs ${
                      income.category === 'Trabajo'
                        ? 'bg-blue-100 text-blue-700'
                        : income.category === 'Ayuda'
                          ? 'bg-purple-100 text-purple-700'
                          : income.category === 'Extra'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {income.category}
                  </span>
                </td>

                <td className="px-4 py-3 text-right font-mono font-medium text-emerald-600">
                  {fmt(income.monthly_amount)}
                </td>

                <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                  {income.start_date}
                </td>

                <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                  {income.end_date ?? '—'}
                </td>

                <td className="px-4 py-3 hidden md:table-cell text-gray-500">
                  {SCENARIO_LABELS[income.scenario as Scenario]}
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-1 justify-end">
                    <button
                      onClick={() => setEditing(income)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Editar
                    </button>

                    {income.status === 'active' && (
                      <button
                        onClick={() => handleClose(income)}
                        className="text-xs text-gray-500 hover:underline"
                      >
                        Cerrar
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(income.id)}
                      className="text-xs text-red-500 hover:underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {!filtered.length && (
              <tr>
                <td colSpan={8} className="text-center py-8 text-gray-400">
                  Sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing !== null && (
        <IncomeForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}