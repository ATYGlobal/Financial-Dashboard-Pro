'use client';

import { useEffect, useState } from 'react';
import ExpenseForm from '@/components/forms/ExpenseForm';
import { getExpenses, deleteExpense, upsertExpense } from '@/lib/supabase';
import { fmt } from '@/lib/calculations';
import type { ExpenseItem, Scenario } from '@/types';
import {
  SCENARIO_LABELS,
  EXPENSE_TYPES,
  EXPENSE_PRIORITIES,
  EXPENSE_CATEGORIES,
} from '@/types';
import { format } from 'date-fns';

type Filter = {
  status: string;
  category: string;
  priority: string;
  type: string;
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [editing, setEditing] = useState<Partial<ExpenseItem> | null>(null);
  const [filter, setFilter] = useState<Filter>({
    status: 'active',
    category: '',
    priority: '',
    type: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      console.error('Error loading expenses:', err);
      setError('No se pudieron cargar los gastos.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave(expense: Partial<ExpenseItem>) {
    try {
      await upsertExpense(expense);
      setEditing(null);
      await load();
    } catch (err) {
      console.error('Error saving expense:', err);
      setError('No se pudo guardar el gasto.');
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('¿Eliminar este gasto?')) return;

    try {
      await deleteExpense(id);
      await load();
    } catch (err) {
      console.error('Error deleting expense:', err);
      setError('No se pudo eliminar el gasto.');
    }
  }

  async function handleClose(expense: ExpenseItem) {
    try {
      await upsertExpense({
        id: expense.id,
        end_date: format(new Date(), 'yyyy-MM-dd'),
        status: 'finished',
      });
      await load();
    } catch (err) {
      console.error('Error closing expense:', err);
      setError('No se pudo cerrar el gasto.');
    }
  }

  const filtered = expenses.filter((expense) => {
    if (filter.status && expense.status !== filter.status) return false;
    if (filter.category && expense.category !== filter.category) return false;
    if (filter.priority && expense.priority !== filter.priority) return false;
    if (filter.type && expense.type !== filter.type) return false;
    return true;
  });

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Cargando…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Gastos</h1>

        <button
          onClick={() => setEditing({})}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Añadir gasto
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
          {EXPENSE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={filter.priority}
          onChange={(event) =>
            setFilter((current) => ({ ...current, priority: event.target.value }))
          }
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="">Prioridad</option>
          {EXPENSE_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>

        <select
          value={filter.type}
          onChange={(event) =>
            setFilter((current) => ({ ...current, type: event.target.value }))
          }
          className="border border-gray-300 rounded px-2 py-1 text-sm"
        >
          <option value="">Tipo</option>
          {EXPENSE_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Descripción</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Categoría</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Tipo</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Prioridad</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Importe/mes</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Inicio</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Escenario</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filtered.map((expense) => (
              <tr key={expense.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{expense.description}</td>

                <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                  {expense.category}
                </td>

                <td className="px-4 py-3 hidden md:table-cell">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                    {expense.type}
                  </span>
                </td>

                <td className="px-4 py-3 hidden lg:table-cell">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      expense.priority === 'Esencial'
                        ? 'bg-red-100 text-red-700'
                        : expense.priority === 'Importante'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {expense.priority}
                  </span>
                </td>

                <td className="px-4 py-3 text-right font-mono font-medium text-orange-600">
                  {fmt(expense.monthly_amount)}
                </td>

                <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                  {expense.start_date}
                </td>

                <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                  {SCENARIO_LABELS[expense.scenario as Scenario]}
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-1 justify-end">
                    <button
                      onClick={() => setEditing(expense)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Editar
                    </button>

                    {expense.status === 'active' && (
                      <button
                        onClick={() => handleClose(expense)}
                        className="text-xs text-gray-500 hover:underline"
                      >
                        Cerrar
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(expense.id)}
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
        <ExpenseForm
          initial={editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
}