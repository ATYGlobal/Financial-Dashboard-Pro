'use client';

import { useEffect, useState } from 'react';
import { getIncomes, getExpenses, getSettings } from '@/lib/supabase';
import { calcForecastMonth, fmt, pct } from '@/lib/calculations';
import type { ForecastMonth, Scenario } from '@/types';
import { SCENARIO_LABELS } from '@/types';

type ScenarioData = Record<Scenario, ForecastMonth>;

type NumericForecastKey =
  | 'total_income'
  | 'work_income'
  | 'aid_income'
  | 'extra_income'
  | 'total_expenses'
  | 'monthly_balance'
  | 'expense_income_ratio'
  | 'aid_income_ratio';

type Field = {
  key: NumericForecastKey;
  label: string;
  pct?: boolean;
};

const SCENARIOS: Scenario[] = [1, 2, 3];

const fields: Field[] = [
  { key: 'total_income', label: 'Ingresos totales' },
  { key: 'work_income', label: 'Ingresos trabajo' },
  { key: 'aid_income', label: 'Ayudas' },
  { key: 'extra_income', label: 'Extra' },
  { key: 'total_expenses', label: 'Gastos totales' },
  { key: 'monthly_balance', label: 'Balance mensual' },
  { key: 'expense_income_ratio', label: 'Ratio gastos/ingresos', pct: true },
  { key: 'aid_income_ratio', label: 'Dependencia ayudas', pct: true },
];

export default function ScenariosPage() {
  const [data, setData] = useState<ScenarioData | null>(null);
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

        const currentDate = new Date();

        const result = SCENARIOS.reduce((acc, scenario) => {
          acc[scenario] = calcForecastMonth(
            incomes,
            expenses,
            currentDate,
            scenario,
            0,
            settings,
          );

          return acc;
        }, {} as ScenarioData);

        setData(result);
      } catch (err) {
        console.error('Scenarios load error:', err);
        setError('No se pudieron cargar los escenarios.');
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

  if (!data) {
    return (
      <div className="text-center py-20 text-gray-400">
        No hay datos suficientes para comparar escenarios.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Escenarios — Mes actual</h1>

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                Métrica
              </th>

              {SCENARIOS.map((scenario) => (
                <th
                  key={scenario}
                  className="text-right px-4 py-3 font-medium text-gray-600"
                >
                  {SCENARIO_LABELS[scenario]}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {fields.map((field) => (
              <tr key={field.key} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-600">{field.label}</td>

                {SCENARIOS.map((scenario) => {
                  const value = data[scenario][field.key];
                  const isBalance = field.key === 'monthly_balance';

                  return (
                    <td
                      key={scenario}
                      className={`px-4 py-3 text-right font-mono ${
                        isBalance
                          ? value >= 0
                            ? 'text-emerald-600 font-medium'
                            : 'text-red-600 font-medium'
                          : 'text-gray-700'
                      }`}
                    >
                      {field.pct ? pct(value) : fmt(value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}