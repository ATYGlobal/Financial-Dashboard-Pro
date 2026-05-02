import { format, parseISO, startOfMonth, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';

export function toMonthDate(dateStr: string): Date {
  return startOfMonth(parseISO(dateStr));
}

export function formatMonth(dateStr: string): string {
  return format(parseISO(dateStr), 'MMMM yyyy', { locale: es });
}

export function formatDate(dateStr: string): string {
  return format(parseISO(dateStr), 'dd/MM/yyyy');
}

export function currentMonthISO(): string {
  return format(startOfMonth(new Date()), 'yyyy-MM-dd');
}

export function monthsRange(startISO: string, count: number): string[] {
  const start = parseISO(startISO);
  return Array.from({ length: count }, (_, i) =>
    format(addMonths(start, i), 'yyyy-MM-dd')
  );
}

export function toInputDate(dateStr: string | null): string {
  if (!dateStr) return '';
  return format(parseISO(dateStr), 'yyyy-MM-dd');
}