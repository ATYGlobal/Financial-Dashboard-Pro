'use client';

import { useEffect, useState } from 'react';
import { getSettings, getIncomes, getExpenses } from '@/lib/supabase';
import { buildForecast, fmt, pct } from '@/lib/calculations';
import type { ForecastMonth } from '@/types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts';

export default function ForecastPage() {
  const [forecast, setForecast] = useState<ForecastMonth[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [settings, incomes, expenses] = await Promise.all([
          getSettings(),
          getIncomes(),
          getExpenses(),
        ]);

        setForecast(buildForecast(incomes, expenses, settings));
      } catch (err) {
        console.error('Forecast load error:', err);
        setError('No se pudo cargar el forecast. Revisa Supabase o las variables de entorno.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Cargando…</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
        {error}
      </div>
    );
  }

  if (!forecast.length) {
    return (
      <div className="text-center py-20 text-gray-400">
        No hay datos suficientes para generar el forecast.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Forecast</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-sm font-medium text-gray-700 mb-4">
          Balance mensual y acumulado
        </h2>

        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={forecast} margin={{ left: -10 }}>
            <XAxis dataKey="label" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip formatter={(value) => fmt(Number(value))} />
            <Legend />
            <ReferenceLine y={0} stroke="#e5e7eb" />
            <Line
              type="monotone"
              dataKey="monthly_balance"
              name="Balance mensual"
              stroke="#3b82f6"
              dot={false}
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="cumulative_balance"
              name="Balance acumulado"
              stroke="#10b981"
              dot={false}
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-3 py-3 font-medium text-gray-600">Mes</th>
              <th className="text-right px-3 py-3 font-medium text-gray-600">Ingresos</th>
              <th className="text-right px-3 py-3 font-medium text-gray-600">Gastos</th>
              <th className="text-right px-3 py-3 font-medium text-gray-600">Balance</th>
              <th className="text-right px-3 py-3 font-medium text-gray-600 hidden md:table-cell">
                Acumulado
              </th>
              <th className="text-right px-3 py-3 font-medium text-gray-600 hidden md:table-cell">
                G/I %
              </th>
              <th className="text-right px-3 py-3 font-medium text-gray-600 hidden lg:table-cell">
                Ayudas %
              </th>
              <th className="px-3 py-3 hidden lg:table-cell">Alerta</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {forecast.map((item) => (
              <tr
                key={item.month}
                className={item.monthly_balance < 0 ? 'bg-red-50/40' : ''}
              >
                <td className="px-3 py-2.5 font-medium">{item.label}</td>

                <td className="px-3 py-2.5 text-right font-mono text-emerald-600">
                  {fmt(item.total_income)}
                </td>

                <td className="px-3 py-2.5 text-right font-mono text-orange-600">
                  {fmt(item.total_expenses)}
                </td>

                <td
                  className={`px-3 py-2.5 text-right font-mono font-medium ${
                    item.monthly_balance >= 0 ? 'text-emerald-700' : 'text-red-600'
                  }`}
                >
                  {fmt(item.monthly_balance)}
                </td>

                <td
                  className={`px-3 py-2.5 text-right font-mono hidden md:table-cell ${
                    item.cumulative_balance >= 0 ? 'text-gray-700' : 'text-red-600'
                  }`}
                >
                  {fmt(item.cumulative_balance)}
                </td>

                <td
                  className={`px-3 py-2.5 text-right hidden md:table-cell ${
                    item.expense_income_ratio > 90
                      ? 'text-red-600 font-medium'
                      : 'text-gray-600'
                  }`}
                >
                  {pct(item.expense_income_ratio)}
                </td>

                <td className="px-3 py-2.5 text-right hidden lg:table-cell text-gray-600">
                  {pct(item.aid_income_ratio)}
                </td>

                <td className="px-3 py-2.5 hidden lg:table-cell">
                  {item.alerts.length > 0 && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        item.alerts.some((alert) => alert.severity === 'error')
                          ? 'bg-red-100 text-red-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {item.alerts.length} alerta{item.alerts.length > 1 ? 's' : ''}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}