#!/usr/bin/env tsx
/**
 * Import initial data from Excel to Supabase
 * Usage: npx tsx scripts/import-excel.ts ./data.xlsx
 *
 * Install deps: npm install xlsx @supabase/supabase-js dotenv
 */
import * as XLSX from 'xlsx';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!  // use service role for import
);

const filePath = process.argv[2] ?? './Sistema Financiero PRO.xlsx';

async function main() {
  console.log(`📂 Leyendo ${filePath}…`);
  const wb = XLSX.readFile(filePath);

  // ── INGRESOS ────────────────────────────────────────────────
  const incSheet = wb.Sheets['INGRESOS'] ?? wb.Sheets[wb.SheetNames[0]];
  if (incSheet) {
    const rows: any[] = XLSX.utils.sheet_to_json(incSheet, { defval: null });
    const incomes = rows
      .filter(r => r['DESCRIPCIÓN'] || r['description'])
      .map(r => ({
        type:           r['TIPO']           ?? r['type']           ?? 'Nómina',
        category:       r['CATEGORÍA']      ?? r['category']       ?? 'Trabajo',
        description:    r['DESCRIPCIÓN']    ?? r['description']    ?? '',
        monthly_amount: parseFloat(r['IMPORTE MENSUAL'] ?? r['monthly_amount'] ?? 0),
        start_date:     excelDate(r['INICIO'] ?? r['start_date'])   ?? '2024-01-01',
        end_date:       excelDate(r['FIN']    ?? r['end_date'])     ?? null,
        status:         r['ESTADO']         ?? r['status']         ?? 'active',
        scenario:       Number(r['ESCENARIO'] ?? r['scenario']     ?? 1),
        notes:          r['NOTAS']          ?? r['notes']          ?? null,
      }));

    console.log(`  💰 ${incomes.length} ingresos encontrados`);
    if (incomes.length) {
      const { error } = await supabase.from('income_sources').insert(incomes);
      if (error) console.error('  ❌ Error ingresos:', error.message);
      else console.log('  ✅ Ingresos importados');
    }
  }

  // ── GASTOS ──────────────────────────────────────────────────
  const expSheet = wb.Sheets['GASTOS'] ?? wb.Sheets[wb.SheetNames[1]];
  if (expSheet) {
    const rows: any[] = XLSX.utils.sheet_to_json(expSheet, { defval: null });
    const expenses = rows
      .filter(r => r['DESCRIPCIÓN'] || r['description'])
      .map(r => ({
        category:       r['CATEGORÍA']      ?? r['category']       ?? 'Otros',
        subcategory:    r['Subcategoría']   ?? r['subcategory']    ?? null,
        description:    r['DESCRIPCIÓN']    ?? r['description']    ?? '',
        monthly_amount: parseFloat(r['IMPORTE MENSUAL'] ?? r['monthly_amount'] ?? 0),
        start_date:     excelDate(r['INICIO'] ?? r['start_date'])  ?? '2024-01-01',
        end_date:       excelDate(r['FIN']    ?? r['end_date'])    ?? null,
        type:           r['TIPO']           ?? r['type']           ?? 'Fijo',
        priority:       r['PRIORIDAD']      ?? r['priority']       ?? 'Esencial',
        scenario:       Number(r['ESCENARIO'] ?? r['scenario']    ?? 1),
        status:         r['ESTADO']         ?? r['status']        ?? 'active',
        notes:          r['NOTAS']          ?? r['notes']         ?? null,
      }));

    console.log(`  💸 ${expenses.length} gastos encontrados`);
    if (expenses.length) {
      const { error } = await supabase.from('expense_items').insert(expenses);
      if (error) console.error('  ❌ Error gastos:', error.message);
      else console.log('  ✅ Gastos importados');
    }
  }

  console.log('\n✅ Importación completada.');
}

/**
 * Convierte fechas de Excel (número serial o string) a 'YYYY-MM-DD'
 */
function excelDate(val: unknown): string | null {
  if (!val) return null;
  if (typeof val === 'number') {
    const date = XLSX.SSF.parse_date_code(val);
    if (!date) return null;
    return `${date.y}-${String(date.m).padStart(2,'0')}-${String(date.d).padStart(2,'0')}`;
  }
  if (typeof val === 'string') {
    const d = new Date(val);
    if (isNaN(d.getTime())) return null;
    return d.toISOString().slice(0,10);
  }
  return null;
}
// Añadir al script import-excel.ts:
function mapScenario(s: string): number {
  const map: Record<string, number> = {
    'Conservador': 1, 'conservador': 1,
    'Realista': 2,    'realista': 2,
    'Optimista': 3,   'optimista': 3,
  };
  return map[s] ?? 2;
}

function mapStatus(s: string): string {
  const map: Record<string, string> = {
    'Activo': 'active',    'activo': 'active',
    'Finalizado': 'finished', 'finalizado': 'finished',
    'Previsto': 'planned', 'previsto': 'planned',
  };
  return map[s] ?? 'active';
}
main().catch(console.error);