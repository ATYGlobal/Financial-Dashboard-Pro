// @ts-ignore: resolve supabase client import in environments without local type declarations
import { createClient } from '@supabase/supabase-js';
import type { Settings, IncomeSources, ExpenseItem, MonthlySnapshot } from '../types';

declare const process: {
  env: {
    NEXT_PUBLIC_SUPABASE_URL?: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  };
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// ── Typed helpers ──────────────────────────────────────────────

export async function getSettings(): Promise<Settings> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('id', 1)
    .single();
  if (error) throw error;
  return data as Settings;
}

export async function updateSettings(patch: Partial<Omit<Settings, 'id' | 'updated_at'>>) {
  const { error } = await supabase
    .from('settings')
    .update(patch)
    .eq('id', 1);
  if (error) throw error;
}

export async function getIncomes(): Promise<IncomeSources[]> {
  const { data, error } = await supabase
    .from('income_sources')
    .select('*')
    .order('start_date', { ascending: false });
  if (error) throw error;
  return data as IncomeSources[];
}

export async function upsertIncome(income: Partial<IncomeSources>) {
  const { error } = await supabase
    .from('income_sources')
    .upsert(income);
  if (error) throw error;
}

export async function deleteIncome(id: string) {
  const { error } = await supabase
    .from('income_sources')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function getExpenses(): Promise<ExpenseItem[]> {
  const { data, error } = await supabase
    .from('expense_items')
    .select('*')
    .order('category', { ascending: true });
  if (error) throw error;
  return data as ExpenseItem[];
}

export async function upsertExpense(expense: Partial<ExpenseItem>) {
  const { error } = await supabase
    .from('expense_items')
    .upsert(expense);
  if (error) throw error;
}

export async function deleteExpense(id: string) {
  const { error } = await supabase
    .from('expense_items')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function getSnapshots(): Promise<MonthlySnapshot[]> {
  const { data, error } = await supabase
    .from('monthly_snapshots')
    .select('*')
    .order('month', { ascending: false });
  if (error) throw error;
  return data as MonthlySnapshot[];
}

export async function upsertSnapshot(snapshot: Partial<MonthlySnapshot>) {
  const { error } = await supabase
    .from('monthly_snapshots')
    .upsert(snapshot, { onConflict: 'month' });
  if (error) throw error;
}