'use client';

import { useEffect, useMemo, useState } from 'react';
import { getSettings, getIncomes, getExpenses } from '@/lib/supabase';
import { buildForecast, fmt } from '@/lib/calculations';
import KPICard from '@/components/ui/KPICard';
import AlertBanner from '@/components/ui/AlertBanner';
import type { ForecastMonth, Settings } from '@/types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export default function Dashboard() {
  const [forecast, setForecast] = useState<ForecastMonth[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const [s, inc, exp] = await Promise.all([
          getSettings(),
          getIncomes(),
          getExpenses(),
        ]);

        setSettings(s);
        setForecast(buildForecast(inc, exp, s));
      } catch (err) {
        console.error('Dashboard load error:', err);
        setError('No se pudo cargar el dashboard. Revisa Supabase o las variables de entorno.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const currentMonth = useMemo(() => {
    if (!forecast.length) return null;

    const today = new Date();
    const currentMonthISO = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-01`;

    return forecast.find((f) => f.month === currentMonthISO) ?? forecast[0];
  }, [forecast]);

  const allAlerts = useMemo(() => {
    return forecast.flatMap((f) => f.alerts);
  }, [forecast]);

  const visibleAlerts = useMemo(() => {
    return [...new Map(allAlerts.map((a) => [a.message, a])).values()].slice(0, 5);
  }, [allAlerts]);

  const chart6 = forecast.slice(0, 6);

  const forecast3Balance = forecast
    .slice(0, 3)
    .reduce((sum, item) => sum + item.monthly_balance, 0);

  const forecast6Balance = forecast
    .slice(0, 6)
    .reduce((sum, item) => sum + item.monthly_balance, 0);

  const forecast12Balance = forecast
    .slice(0, 12)
    .reduce((sum, item) => sum + item.monthly_balance, 0);

  const balanceColor = (value: number) => (value >= 0 ? 'green' : 'red');

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

  if (!currentMonth || !settings) {
    return (
      <div className="text-center py-20 text-gray-400">
        No hay datos suficientes para mostrar el dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {visibleAlerts.length > 0 && <AlertBanner alerts={visibleAlerts} />}

      <section>
        <h2 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
          {currentMonth.label} — Mes de referencia
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPICard label="Ingresos" value={currentMonth.total_income} currency color="blue" />
          <KPICard label="Gastos" value={currentMonth.total_expenses} currency color="orange" />
          <KPICard
            label="Balance mensual"
            value={currentMonth.monthly_balance}
            currency
            color={balanceColor(currentMonth.monthly_balance)}
          />
          <KPICard
            label="Balance acumulado"
            value={currentMonth.cumulative_balance}
            currency
            color={balanceColor(currentMonth.cumulative_balance)}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
          <KPICard
            label="Ratio gastos/ingresos"
            value={currentMonth.expense_income_ratio}
            pct
            color={
              currentMonth.expense_income_ratio > 90
                ? 'red'
                : currentMonth.expense_income_ratio > 75
                  ? 'orange'
                  : 'green'
            }
          />
          <KPICard
            label="% ayudas/ingresos"
            value={currentMonth.aid_income_ratio}
            pct
            color={
              currentMonth.aid_income_ratio > settings.aid_dependency_alert_threshold
                ? 'orange'
                : 'default'
            }
          />
          <KPICard
            label="Ingresos por trabajo"
            value={currentMonth.work_income}
            currency
          />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide">
          Forecast
        </h2>

        <div className="grid grid-cols-3 gap-3">
          <KPICard
            label="3 meses"
            value={forecast3Balance}
            currency
            color={balanceColor(forecast3Balance)}
          />
          <KPICard
            label="6 meses"
            value={forecast6Balance}
            currency
            color={balanceColor(forecast6Balance)}
          />
          <KPICard
            label="12 meses"
            value={forecast12Balance}
            currency
            color={balanceColor(forecast12Balance)}
          />
        </div>
      </section>

      <section className="bg-white rounded-lg border border-gray-200 p-4">
        <h2 className="text-sm font-medium text-gray-700 mb-4">
          Ingresos vs Gastos — próximos 6 meses
        </h2>

        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chart6} margin={{ left: -10 }}>
            <XAxis dataKey="label" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(value) => fmt(Number(value))} />
            <Legend />
            <Bar dataKey="total_income" name="Ingresos" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            <Bar dataKey="total_expenses" name="Gastos" fill="#f97316" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}