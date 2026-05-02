# Sistema Financiero PRO — PWA

## Requisitos
- Node.js 18+
- Cuenta Supabase
- Cuenta Vercel (para despliegue)

## 1. Clonar e instalar

git clone <tu-repo>
cd sistema-financiero
npm install

## 2. Configurar Supabase

1. Crear proyecto en supabase.com
2. Ir a SQL Editor y ejecutar `/db/schema.sql`
3. Ejecutar `/db/seed.sql` para datos iniciales de prueba
4. Copiar URL y anon key del proyecto

## 3. Variables de entorno

cp .env.local.example .env.local
# Editar .env.local con tus valores reales

## 4. Ejecutar en desarrollo

npm run dev
# Abre http://localhost:3000

## 5. Importar Excel (opcional)

# Asegúrate de tener SUPABASE_SERVICE_ROLE_KEY en .env.local
npm run import -- ./Sistema\ Financiero\ PRO.xlsx

# El script lee las hojas "Ingresos" y "Gastos"
# Las columnas esperadas: Descripción, Tipo, Categoría, Importe mensual, Inicio, Fin, Escenario, Estado, Notas

## 6. Desplegar en Vercel

npm install -g vercel
vercel

# En el dashboard de Vercel → Settings → Environment Variables
# Añadir: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY

## 7. Instalar como PWA

En Chrome/Safari mobile:
- Abrir la URL de la app
- Menú → "Añadir a pantalla de inicio" / "Instalar app"

## Estructura de escenarios

| Escenario    | Rank | Descripción                                    |
|--------------|------|------------------------------------------------|
| Conservador  | 1    | Solo ingresos/gastos con scenario = 1          |
| Realista     | 2    | scenario <= 2 (incluye Conservador + Realista) |
| Optimista    | 3    | Todos los items (scenario 1, 2 y 3)            |

## Lógica de forecast

Un ingreso o gasto aplica en un mes si:
- start_date <= último día del mes
- end_date IS NULL OR end_date >= primer día del mes
- scenario <= active_scenario (configuración)

## Regla histórico

Los meses marcados como "cerrado" no se recalculan.
El forecast puede cambiar; el histórico real es inmutable.

sistema-financiero/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    → redirect a /dashboard
│   ├── dashboard/page.tsx
│   ├── incomes/page.tsx
│   ├── expenses/page.tsx
│   ├── forecast/page.tsx
│   ├── scenarios/page.tsx
│   ├── history/page.tsx
│   └── settings/page.tsx
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── MobileNav.tsx
│   ├── ui/
│   │   ├── KPICard.tsx
│   │   ├── DataTable.tsx
│   │   ├── AlertBanner.tsx
│   │   └── Badge.tsx
│   ├── forms/
│   │   ├── IncomeForm.tsx
│   │   └── ExpenseForm.tsx
│   └── charts/
│       ├── IncomeExpenseChart.tsx
│       └── BalanceChart.tsx
├── lib/
│   ├── supabase.ts
│   ├── calculations.ts
│   ├── scenarios.ts
│   ├── dates.ts
│   └── alerts.ts
├── types/
│   └── index.ts
├── db/
│   ├── schema.sql
│   └── seed.sql
├── scripts/
│   └── import-excel.ts
├── public/
│   ├── manifest.json
│   └── icons/
├── next.config.js
├── tailwind.config.ts
└── .env.local.example