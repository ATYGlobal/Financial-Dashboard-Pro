import type { IncomeSources, ExpenseItem, Settings, ForecastMonth } from '@/types';
import { SCENARIO_LABELS } from '@/types';
import { calcForecastMonth } from './calculations';

export interface ScenarioSummary {
  scenario: 1 | 2 | 3;
  label: string;
  total_income: number;
  work_income: number;
  aid_income: number;
  extra_income: number;
  total_expenses: number;
  fixed_expenses: number;
  variable_expenses: number;
  monthly_balance: number;
  expense_income_ratio: number;
  aid_income_ratio: number;
  alert_count: number;
}

/**
 * Calcula el resumen de los 3 escenarios para un mes concreto.
 * El mes por defecto es el actual.
 */
export function buildScenarioComparison(
  incomes: IncomeSources[],
  expenses: ExpenseItem[],
  settings: Settings,
  monthDate: Date = new Date()
): ScenarioSummary[] {
  return ([1, 2, 3] as const).map(scenario => {
    const fm: ForecastMonth = calcForecastMonth(
      incomes,
      expenses,
      monthDate,
      scenario,
      0,
      settings
    );

    return {
      scenario,
      label:                SCENARIO_LABELS[scenario],
      total_income:         fm.total_income,
      work_income:          fm.work_income,
      aid_income:           fm.aid_income,
      extra_income:         fm.extra_income,
      total_expenses:       fm.total_expenses,
      fixed_expenses:       fm.fixed_expenses,
      variable_expenses:    fm.variable_expenses,
      monthly_balance:      fm.monthly_balance,
      expense_income_ratio: fm.expense_income_ratio,
      aid_income_ratio:     fm.aid_income_ratio,
      alert_count:          fm.alerts.length,
    };
  });
}

/**
 * Devuelve la diferencia entre escenario Optimista y Conservador.
 * Útil para mostrar el "upside potencial".
 */
export function scenarioUpside(summaries: ScenarioSummary[]): {
  income_diff: number;
  expense_diff: number;
  balance_diff: number;
} {
  const conservador = summaries.find(s => s.scenario === 1)!;
  const optimista   = summaries.find(s => s.scenario === 3)!;
  return {
    income_diff:  optimista.total_income   - conservador.total_income,
    expense_diff: optimista.total_expenses - conservador.total_expenses,
    balance_diff: optimista.monthly_balance - conservador.monthly_balance,
  };
}

/**
 * Devuelve el escenario activo como label legible.
 */
export function activeScenarioLabel(activeScenario: number): string {
  return SCENARIO_LABELS[activeScenario as 1 | 2 | 3] ?? 'Desconocido';
}