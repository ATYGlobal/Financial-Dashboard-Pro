export type Scenario = 1 | 2 | 3; // 1=Conservador, 2=Realista, 3=Optimista

export const SCENARIO_LABELS: Record<Scenario, string> = {
  1: 'Conservador',
  2: 'Realista',
  3: 'Optimista',
};

export const INCOME_TYPES = [
  'Nómina',
  'Ingresos adicionales',
  'Kindergeld',
  'Wohngeld Plus',
  'Kinderzuschlag',
  'Bildung & Teilhabe',
  'Ingreso extra',
] as const;

export const INCOME_CATEGORIES = ['Trabajo', 'Ayuda', 'Extra', 'Otro'] as const;

export const EXPENSE_TYPES = [
  'Fijo',
  'Variable',
  'Puntual',
  'Deuda',
  'Suscripción',
] as const;

export const EXPENSE_PRIORITIES = ['Esencial', 'Importante', 'Prescindible'] as const;

export const EXPENSE_CATEGORIES = [
  'Vivienda',
  'Alimentación',
  'Transporte',
  'Salud',
  'Educación',
  'Suscripciones',
  'Ahorro',
  'Ocio',
  'Ropa',
  'Otros',
] as const;

export type IncomeStatus = 'active' | 'planned' | 'finished';
export type ExpenseStatus = 'active' | 'planned' | 'finished';

export interface IncomeSources {
  id: string;
  type: string;
  category: string;
  description: string;
  monthly_amount: number;
  start_date: string;
  end_date: string | null;
  status: IncomeStatus;
  scenario: Scenario;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExpenseItem {
  id: string;
  category: string;
  subcategory: string | null;
  description: string;
  monthly_amount: number;
  start_date: string;
  end_date: string | null;
  type: string;
  priority: string;
  scenario: Scenario;
  status: ExpenseStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface MonthlySnapshot {
  id: string;
  month: string;
  real_income: number | null;
  real_expenses: number | null;
  real_balance: number | null;
  forecast_income: number | null;
  forecast_expenses: number | null;
  forecast_balance: number | null;
  income_deviation: number | null;
  expense_deviation: number | null;
  balance_deviation: number | null;
  closed: boolean;
  closed_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: 1;
  active_scenario: Scenario;
  forecast_start_month: string;
  forecast_months: number;
  expense_ratio_alert_threshold: number;
  aid_dependency_alert_threshold: number;
  income_end_alert_days: number;
  new_expense_alert_days: number;
  updated_at: string;
}

export interface ForecastMonth {
  month: string;         // 'YYYY-MM-01'
  label: string;         // 'Ene 2025'
  total_income: number;
  work_income: number;
  aid_income: number;
  extra_income: number;
  total_expenses: number;
  fixed_expenses: number;
  variable_expenses: number;
  monthly_balance: number;
  cumulative_balance: number;
  expense_income_ratio: number;   // %
  aid_income_ratio: number;       // %
  alerts: AlertItem[];
}

export interface AlertItem {
  type: 'deficit' | 'high_expenses' | 'aid_dependency' | 'income_ending' | 'new_expense';
  message: string;
  severity: 'warning' | 'error';
}