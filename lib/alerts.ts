import { differenceInDays, parseISO, addDays } from 'date-fns';
import type { IncomeSources, ExpenseItem, ForecastMonth, AlertItem, Settings } from '@/types';

// ── Tipos extendidos para alertas globales ───────────────────

export interface GlobalAlert extends AlertItem {
  month?: string;   // en qué mes del forecast aparece (si aplica)
  source?: string;  // descripción del ingreso/gasto que la genera
}

// ── Alertas sobre el estado actual de ingresos/gastos ────────

/**
 * Alertas que NO dependen del forecast sino del estado actual
 * de los registros: caducidades próximas, nuevos gastos inminentes.
 */
export function buildCurrentAlerts(
  incomes: IncomeSources[],
  expenses: ExpenseItem[],
  settings: Settings,
  today: Date = new Date()
): GlobalAlert[] {
  const alerts: GlobalAlert[] = [];

  // Ingresos terminando pronto
  incomes
    .filter(i => i.status === 'active' && i.end_date)
    .forEach(i => {
      const daysLeft = differenceInDays(parseISO(i.end_date!), today);
      if (daysLeft >= 0 && daysLeft <= settings.income_end_alert_days) {
        alerts.push({
          type:     'income_ending',
          message:  `El ingreso "${i.description}" termina en ${daysLeft} día${daysLeft !== 1 ? 's' : ''}`,
          severity: daysLeft <= 30 ? 'error' : 'warning',
          source:   i.description,
        });
      }
    });

  // Nuevos gastos próximos (start_date en el futuro próximo)
  expenses
    .filter(e => e.status === 'planned')
    .forEach(e => {
      const daysUntil = differenceInDays(parseISO(e.start_date), today);
      if (daysUntil >= 0 && daysUntil <= settings.new_expense_alert_days) {
        alerts.push({
          type:     'new_expense',
          message:  `Nuevo gasto "${e.description}" comienza en ${daysUntil} día${daysUntil !== 1 ? 's' : ''}`,
          severity: 'warning',
          source:   e.description,
        });
      }
    });

  return alerts;
}

// ── Alertas sobre el forecast ────────────────────────────────

/**
 * Extrae y deduplica las alertas más relevantes del forecast.
 * Útil para el dashboard: no queremos 12 alertas de "déficit".
 */
export function buildForecastAlerts(
  forecastMonths: ForecastMonth[],
  maxPerType = 3
): GlobalAlert[] {
  const countByType: Record<string, number> = {};
  const result: GlobalAlert[] = [];

  for (const fm of forecastMonths) {
    for (const alert of fm.alerts) {
      const count = countByType[alert.type] ?? 0;
      if (count >= maxPerType) continue;

      result.push({
        ...alert,
        month: fm.month,
      });

      countByType[alert.type] = count + 1;
    }
  }

  // Ordena: errores primero
  result.sort((a, b) => {
    if (a.severity === b.severity) return 0;
    return a.severity === 'error' ? -1 : 1;
  });

  return result;
}

// ── Resumen de alertas para badges ───────────────────────────

export interface AlertSummary {
  total: number;
  errors: number;
  warnings: number;
  hasDeficit: boolean;
  hasHighExpenses: boolean;
  hasAidDependency: boolean;
}

export function summarizeAlerts(alerts: GlobalAlert[]): AlertSummary {
  return {
    total:            alerts.length,
    errors:           alerts.filter(a => a.severity === 'error').length,
    warnings:         alerts.filter(a => a.severity === 'warning').length,
    hasDeficit:       alerts.some(a => a.type === 'deficit'),
    hasHighExpenses:  alerts.some(a => a.type === 'high_expenses'),
    hasAidDependency: alerts.some(a => a.type === 'aid_dependency'),
  };
}

// ── Helper: texto de severidad ────────────────────────────────

export function alertIcon(severity: 'warning' | 'error'): string {
  return severity === 'error' ? '🔴' : '🟡';
}

export function alertColorClass(severity: 'warning' | 'error'): string {
  return severity === 'error'
    ? 'bg-red-50 text-red-800 border-red-200'
    : 'bg-amber-50 text-amber-800 border-amber-200';
}