'use client';

import { useEffect, useState } from 'react';
import { getSettings, updateSettings } from '@/lib/supabase';
import type { Settings, Scenario } from '@/types';
import { SCENARIO_LABELS } from '@/types';

export default function SettingsPage() {
  const [form, setForm] = useState<Partial<Settings> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError(null);

        const settings = await getSettings();
        setForm(settings);
      } catch (err) {
        console.error('Settings load error:', err);
        setError('No se pudo cargar la configuración.');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  function updateField<K extends keyof Settings>(key: K, value: Settings[K]) {
    setForm((current) => (current ? { ...current, [key]: value } : current));
  }

  function safeNumber(value: string, fallback: number, min: number, max: number): number {
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) return fallback;

    return Math.min(Math.max(parsed, min), max);
  }

  async function handleSave() {
    if (!form) return;

    try {
      setSaving(true);
      setError(null);

      await updateSettings({
        active_scenario: form.active_scenario,
        forecast_start_month: form.forecast_start_month,
        forecast_months: form.forecast_months,
        expense_ratio_alert_threshold: form.expense_ratio_alert_threshold,
        aid_dependency_alert_threshold: form.aid_dependency_alert_threshold,
        income_end_alert_days: form.income_end_alert_days,
        new_expense_alert_days: form.new_expense_alert_days,
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Settings save error:', err);
      setError('No se pudo guardar la configuración.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Cargando…</div>;
  }

  if (!form) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
        No se encontró configuración.
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-xl">
      <h1 className="text-2xl font-bold">Configuración</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-5">
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Escenario activo
          </label>
          <select
            value={form.active_scenario ?? 2}
            onChange={(event) =>
              updateField('active_scenario', Number(event.target.value) as Scenario)
            }
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          >
            {([1, 2, 3] as Scenario[]).map((scenario) => (
              <option key={scenario} value={scenario}>
                {SCENARIO_LABELS[scenario]}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-1">
            Define qué ingresos y gastos se incluyen en el forecast.
          </p>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Mes inicio forecast
          </label>
          <input
            type="month"
            value={form.forecast_start_month?.slice(0, 7) ?? ''}
            onChange={(event) =>
              updateField('forecast_start_month', `${event.target.value}-01`)
            }
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Meses de forecast
          </label>
          <input
            type="number"
            min={1}
            max={60}
            value={form.forecast_months ?? 12}
            onChange={(event) =>
              updateField(
                'forecast_months',
                safeNumber(event.target.value, 12, 1, 60),
              )
            }
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>

        <hr className="border-gray-100" />

        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Umbrales de alertas
        </p>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Umbral ratio gastos/ingresos (%)
          </label>
          <input
            type="number"
            min={0}
            max={200}
            value={form.expense_ratio_alert_threshold ?? 80}
            onChange={(event) =>
              updateField(
                'expense_ratio_alert_threshold',
                safeNumber(event.target.value, 80, 0, 200),
              )
            }
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Umbral dependencia de ayudas (%)
          </label>
          <input
            type="number"
            min={0}
            max={100}
            value={form.aid_dependency_alert_threshold ?? 50}
            onChange={(event) =>
              updateField(
                'aid_dependency_alert_threshold',
                safeNumber(event.target.value, 50, 0, 100),
              )
            }
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Días de alerta — ingreso terminando pronto
          </label>
          <input
            type="number"
            min={0}
            max={365}
            value={form.income_end_alert_days ?? 60}
            onChange={(event) =>
              updateField(
                'income_end_alert_days',
                safeNumber(event.target.value, 60, 0, 365),
              )
            }
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">
            Días de alerta — nuevo gasto próximo
          </label>
          <input
            type="number"
            min={0}
            max={365}
            value={form.new_expense_alert_days ?? 30}
            onChange={(event) =>
              updateField(
                'new_expense_alert_days',
                safeNumber(event.target.value, 30, 0, 365),
              )
            }
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 disabled:bg-blue-300 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          {saving ? 'Guardando…' : 'Guardar cambios'}
        </button>

        {saved && <span className="text-sm text-emerald-600">✓ Guardado</span>}
      </div>
    </div>
  );
}