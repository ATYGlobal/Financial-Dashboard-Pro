import { addMonths, endOfMonth, startOfMonth, format, parseISO, isAfter, isBefore, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import type { IncomeSources, ExpenseItem, Settings, ForecastMonth, AlertItem } from '@/types';

// ── Helpers de fecha ───────────────────────────────────────────

export function monthLabel(date: Date): string {
  return format(date, 'MMM yyyy', { locale: es });
}

export function firstOfMonth(date: Date): Date {
  return startOfMonth(date);
}

export function lastOfMonth(date: Date): Date {
  return endOfMonth(date);
}

// ── ¿Aplica un ingreso/gasto a un mes? ───────────────────────

function itemActiveInMonth(
  startDate: string,
  endDate: string | null,
  monthDate: Date
): boolean {
  const first = firstOfMonth(monthDate);
  const last  = lastOfMonth(monthDate);
  const start = parseISO(startDate);

  if (isAfter(start, last)) return false;
  if (endDate) {
    const end = parseISO(endDate);
    if (isBefore(end, first)) return false;
  }
  return true;
}

// ── Ingresos activos para un mes y escenario ─────────────────

export function incomesForMonth(
  incomes: IncomeSources[],
  monthDate: Date,
  activeScenario: number
): IncomeSources[] {
  return incomes.filter(i =>
    i.scenario <= activeScenario &&
    itemActiveInMonth(i.start_date, i.end_date, monthDate)
  );
}

// ── Gastos activos para un mes y escenario ───────────────────

export function expensesForMonth(
  expenses: ExpenseItem[],
  monthDate: Date,
  activeScenario: number
): ExpenseItem[] {
  return expenses.filter(e =>
    e.scenario <= activeScenario &&
    itemActiveInMonth(e.start_date, e.end_date, monthDate)
  );
}

// ── Suma de amounts ──────────────────────────────────────────

function sum(items: { monthly_amount: number }[]): number {
  return items.reduce((acc, i) => acc + i.monthly_amount, 0);
}

// ── Calcular un mes del forecast ────────────────────────────

export function calcForecastMonth(
  incomes: IncomeSources[],
  expenses: ExpenseItem[],
  monthDate: Date,
  activeScenario: number,
  prevCumulative: number,
  settings: Settings
): ForecastMonth {
  const monthIncomes  = incomesForMonth(incomes, monthDate, activeScenario);
  const monthExpenses = expensesForMonth(expenses, monthDate, activeScenario);

  const total_income    = sum(monthIncomes);
  const work_income     = sum(monthIncomes.filter(i => i.category === 'Trabajo'));
  const aid_income      = sum(monthIncomes.filter(i => i.category === 'Ayuda'));
  const extra_income    = sum(monthIncomes.filter(i => i.category === 'Extra'));

  const total_expenses    = sum(monthExpenses);
  const fixed_expenses    = sum(monthExpenses.filter(e => e.type === 'Fijo' || e.type === 'Deuda' || e.type === 'Suscripción'));
  const variable_expenses = sum(monthExpenses.filter(e => e.type === 'Variable' || e.type === 'Puntual'));

  const monthly_balance    = total_income - total_expenses;
  const cumulative_balance = prevCumulative + monthly_balance;
  const expense_income_ratio = total_income > 0 ? (total_expenses / total_income) * 100 : 0;
  const aid_income_ratio     = total_income > 0 ? (aid_income / total_income) * 100 : 0;

  const alerts = buildAlerts(
    monthIncomes, monthExpenses, monthly_balance,
    expense_income_ratio, aid_income_ratio, settings, monthDate
  );

  return {
    month: format(firstOfMonth(monthDate), 'yyyy-MM-dd'),
    label: monthLabel(monthDate),
    total_income,
    work_income,
    aid_income,
    extra_income,
    total_expenses,
    fixed_expenses,
    variable_expenses,
    monthly_balance,
    cumulative_balance,
    expense_income_ratio,
    aid_income_ratio,
    alerts,
  };
}

// ── Generar forecast completo ────────────────────────────────

export function buildForecast(
  incomes: IncomeSources[],
  expenses: ExpenseItem[],
  settings: Settings
): ForecastMonth[] {
  const result: ForecastMonth[] = [];
  const start = parseISO(settings.forecast_start_month);
  let cumulative = 0;

  for (let i = 0; i < settings.forecast_months; i++) {
    const monthDate = addMonths(start, i);
    const fm = calcForecastMonth(incomes, expenses, monthDate, settings.active_scenario, cumulative, settings);
    cumulative = fm.cumulative_balance;
    result.push(fm);
  }

  return result;
}

// ── Alertas ──────────────────────────────────────────────────

function buildAlerts(
  incomes: IncomeSources[],
  expenses: ExpenseItem[],
  monthly_balance: number,
  expense_income_ratio: number,
  aid_income_ratio: number,
  settings: Settings,
  monthDate: Date
): AlertItem[] {
  const alerts: AlertItem[] = [];
  const today = new Date();

  // Déficit mensual
  if (monthly_balance < 0) {
    alerts.push({
      type: 'deficit',
      message: `Déficit de ${fmt(Math.abs(monthly_balance))} en ${monthLabel(monthDate)}`,
      severity: 'error',
    });
  }

  // Gastos altos
  if (expense_income_ratio > settings.expense_ratio_alert_threshold) {
    alerts.push({
      type: 'high_expenses',
      message: `Gastos al ${expense_income_ratio.toFixed(0)}% de ingresos`,
      severity: expense_income_ratio > 100 ? 'error' : 'warning',
    });
  }

  // Dependencia de ayudas
  if (aid_income_ratio > settings.aid_dependency_alert_threshold) {
    alerts.push({
      type: 'aid_dependency',
      message: `Dependencia de ayudas: ${aid_income_ratio.toFixed(0)}%`,
      severity: 'warning',
    });
  }

  // Ingresos terminando pronto
  incomes.forEach(i => {
    if (i.end_date) {
      const daysLeft = differenceInDays(parseISO(i.end_date), today);
      if (daysLeft >= 0 && daysLeft <= settings.income_end_alert_days) {
        alerts.push({
          type: 'income_ending',
          message: `"${i.description}" termina en ${daysLeft} días`,
          severity: daysLeft < 30 ? 'error' : 'warning',
        });
      }
    }
  });

  // Nuevo gasto próximo
  expenses.forEach(e => {
    const daysUntilStart = differenceInDays(parseISO(e.start_date), today);
    if (daysUntilStart > 0 && daysUntilStart <= settings.new_expense_alert_days) {
      alerts.push({
        type: 'new_expense',
        message: `Nuevo gasto "${e.description}" en ${daysUntilStart} días`,
        severity: 'warning',
      });
    }
  });

  return alerts;
}

// ── Formatter euro ───────────────────────────────────────────

export function fmt(amount: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function pct(value: number): string {
  return `${value.toFixed(1)}%`;
}