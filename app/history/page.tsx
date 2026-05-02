'use client';

import { useEffect, useState } from 'react';
import {
  getSnapshots,
  upsertSnapshot,
  getIncomes,
  getExpenses,
  getSettings,
} from '@/lib/supabase';
import { buildForecast, fmt } from '@/lib/calculations';
import type { MonthlySnapshot, ForecastMonth } from '@/types';
import { format } from 'date-fns';

export default function HistoryPage() {
  const [snapshots, setSnapshots] = useState<MonthlySnapshot[]>([]);
  const [editing, setEditing] = useState<Partial<MonthlySnapshot> | null>(null);
  const [forecast, setForecast] = useState<Record<string, ForecastMonth>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    try {
      setLoading(true);
      setError(null);

      const [snaps, settings, incomes, expenses] = await Promise.all([
        getSnapshots(),
        getSettings(),
        getIncomes(),
        getExpenses(),
      ]);

      const forecastData = buildForecast(incomes, expenses, settings);
      const forecastMap: Record<string, ForecastMonth> = {};

      forecastData.forEach((item) => {
        forecastMap[item.month] = item;
      });

      setForecast(forecastMap);
      setSnapshots(snaps);
    } catch (err) {
      console.error('History load error:', err);
      setError('No se pudo cargar el histórico.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function safeNumber(value: string): number | null {
    if (value.trim() === '') return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  function openNew() {
    const month = format(new Date(), 'yyyy-MM-01');
    const monthForecast = forecast[month];

    setEditing({
      month,
      real_income: null,
      real_expenses: null,
      forecast_income: monthForecast?.total_income ?? null,
      forecast_expenses: monthForecast?.total_expenses ?? null,
      closed: false,
      notes: '',
    });
  }

  async function handleSave() {
    if (!editing?.month) {
      setError('Debes seleccionar un mes válido.');
      return;
    }

    try {
      await upsertSnapshot({
        ...editing,
        month: editing.month,
      });

      setEditing(null);
      await load();
    } catch (err) {
      console.error('History save error:', err);
      setError('No se pudo guardar el cierre mensual.');
    }
  }

  async function handleClose(snapshot: MonthlySnapshot) {
    try {
      await upsertSnapshot({
        id: snapshot.id,
        month: snapshot.month,
        closed: true,
        closed_at: new Date().toISOString(),
      });

      await load();
    } catch (err) {
      console.error('History close error:', err);
      setError('No se pudo cerrar el mes.');
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Cargando…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Histórico mensual</h1>

        <button
          onClick={openNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          + Registrar mes
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Mes</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Ingresos reales</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Gastos reales</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Balance real</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600 hidden md:table-cell">
                Desv. balance
              </th>
              <th className="px-4 py-3 hidden md:table-cell text-gray-600">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {snapshots.map((snapshot) => (
              <tr key={snapshot.id}>
                <td className="px-4 py-3 font-medium">{snapshot.month}</td>

                <td className="px-4 py-3 text-right font-mono text-emerald-600">
                  {snapshot.real_income != null ? fmt(snapshot.real_income) : '—'}
                </td>

                <td className="px-4 py-3 text-right font-mono text-orange-600">
                  {snapshot.real_expenses != null ? fmt(snapshot.real_expenses) : '—'}
                </td>

                <td
                  className={`px-4 py-3 text-right font-mono font-medium ${
                    (snapshot.real_balance ?? 0) >= 0
                      ? 'text-emerald-700'
                      : 'text-red-600'
                  }`}
                >
                  {snapshot.real_balance != null ? fmt(snapshot.real_balance) : '—'}
                </td>

                <td
                  className={`px-4 py-3 text-right font-mono hidden md:table-cell ${
                    (snapshot.balance_deviation ?? 0) >= 0
                      ? 'text-emerald-600'
                      : 'text-red-600'
                  }`}
                >
                  {snapshot.balance_deviation != null
                    ? fmt(snapshot.balance_deviation)
                    : '—'}
                </td>

                <td className="px-4 py-3 hidden md:table-cell">
                  {snapshot.closed ? (
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      Cerrado
                    </span>
                  ) : (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                      Abierto
                    </span>
                  )}
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-end">
                    {!snapshot.closed && (
                      <button
                        onClick={() => setEditing(snapshot)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                    )}

                    {!snapshot.closed && (
                      <button
                        onClick={() => handleClose(snapshot)}
                        className="text-xs text-gray-500 hover:underline"
                      >
                        Cerrar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {!snapshots.length && (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-400">
                  Sin registros históricos
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-end md:items-center justify-center z-50 p-4">
          <div className="bg-white rounded-t-2xl md:rounded-xl w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-semibold">Registrar mes real</h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  Mes
                </label>
                <input
                  type="month"
                  value={editing.month?.slice(0, 7) ?? ''}
                  onChange={(event) => {
                    const month = `${event.target.value}-01`;
                    const monthForecast = forecast[month];

                    setEditing((current) => ({
                      ...current,
                      month,
                      forecast_income:
                        current?.forecast_income ?? monthForecast?.total_income ?? null,
                      forecast_expenses:
                        current?.forecast_expenses ?? monthForecast?.total_expenses ?? null,
                    }));
                  }}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  Ingresos reales (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editing.real_income ?? ''}
                  onChange={(event) =>
                    setEditing((current) => ({
                      ...current,
                      real_income: safeNumber(event.target.value),
                    }))
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  Gastos reales (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={editing.real_expenses ?? ''}
                  onChange={(event) =>
                    setEditing((current) => ({
                      ...current,
                      real_expenses: safeNumber(event.target.value),
                    }))
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  Forecast ingreso (ref.)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={
                    editing.forecast_income ??
                    (editing.month ? forecast[editing.month]?.total_income : '') ??
                    ''
                  }
                  onChange={(event) =>
                    setEditing((current) => ({
                      ...current,
                      forecast_income: safeNumber(event.target.value),
                    }))
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 block mb-1">
                  Forecast gastos (ref.)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={
                    editing.forecast_expenses ??
                    (editing.month ? forecast[editing.month]?.total_expenses : '') ??
                    ''
                  }
                  onChange={(event) =>
                    setEditing((current) => ({
                      ...current,
                      forecast_expenses: safeNumber(event.target.value),
                    }))
                  }
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-600 block mb-1">Notas</label>
                <textarea
                  value={editing.notes ?? ''}
                  onChange={(event) =>
                    setEditing((current) => ({
                      ...current,
                      notes: event.target.value,
                    }))
                  }
                  rows={2}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded border border-gray-300 text-sm text-gray-600 hover:bg-gray-50"
              >
                Cancelar
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 rounded bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}