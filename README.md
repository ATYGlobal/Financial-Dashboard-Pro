<div align="center">

<img src="public/icons/icon-512.png" alt="Financial Dashboard Pro" width="100" height="100" />

# Financial Dashboard Pro

**Control financiero personal basado en escenarios.**
Anticipa. Decide. Controla.

[![Next.js](https://img.shields.io/badge/Next.js_14-000000?style=flat-square&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-3ecf8e?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![PWA](https://img.shields.io/badge/PWA-5a0fc8?style=flat-square&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)](https://vercel.com)

</div>

---

## Filosofia del sistema

> **No gestionas dinero. Gestionas escenarios.**

La mayoria de herramientas financieras registran el pasado.
Esta app **anticipa el futuro** con tres niveles de certeza:

| Escenario | Nivel | Estrategia |
|-----------|-------|------------|
| 🔴 **Conservador** | 1 | Solo ingresos seguros — modo supervivencia |
| 🔵 **Realista** | 2 | Base + crecimiento probable — modo estabilidad |
| 🟡 **Optimista** | 3 | Todo activado — modo crecimiento |

Cada ingreso y gasto pertenece a un escenario. Al cambiar el escenario activo, **el forecast completo se recalcula al instante.**

---

## Arquitectura

```
┌─────────────────┐     ┌──────────────────┐     ┌────────────────┐
│   PWA CLIENT    │────▶│  BUSINESS LOGIC  │────▶│   SUPABASE     │
│                 │     │                  │     │                │
│  Next.js 14     │     │  calculations.ts │     │  PostgreSQL    │
│  React 18       │     │  scenarios.ts    │     │  Auth + RLS    │
│  Tailwind CSS   │     │  alerts.ts       │     │  Realtime      │
└─────────────────┘     └──────────────────┘     └────────────────┘
        │                                                  │
        └──────────────── Vercel Edge Deploy ──────────────┘
```

- **100% client-side** — los calculos del forecast no requieren servidor
- **RLS en Supabase** — los datos estan aislados por usuario
- **Instalable como PWA** — funciona en Android e iOS desde el navegador

---

## Stack tecnologico

| Capa | Tecnologia | Proposito |
|------|-----------|-----------|
| Framework | Next.js 14 App Router | Routing, SSR, build |
| Lenguaje | TypeScript 5 | Tipado estricto |
| Base de datos | Supabase + PostgreSQL | Persistencia + Auth + RLS |
| Estilos | Tailwind CSS 3 | Utility-first responsive |
| Graficos | Recharts 2 | Forecast y balance |
| PWA | next-pwa | Instalacion + offline |
| Deploy | Vercel | Edge, CI/CD automatico |
| Fechas | date-fns 3 | Calculos de forecast |

---

## Requisitos previos

- **Node.js** >= 18
- Cuenta en [Supabase](https://supabase.com) (gratuita)
- Cuenta en [Vercel](https://vercel.com) (gratuita)

---

## Instalacion

### 1 — Clonar el repositorio

```bash
git clone https://github.com/ATYGlobal/Financial-Dashboard-Pro.git
cd "Financial Dashboard Pro"
npm install
```

### 2 — Configurar Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Abrir **SQL Editor**
3. Ejecutar en orden:

```sql
-- Paso 1: crear schema
-- (contenido de /db/schema.sql)

-- Paso 2: insertar datos iniciales
-- (contenido de /db/seed.sql)
```

4. Ir a **Settings → API** y copiar las keys

### 3 — Variables de entorno

```bash
cp .env.local.example .env.local
```

Editar `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Solo necesario para importar el Excel
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4 — Arrancar en local

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)
La app redirige automaticamente a `/dashboard`.

---

## Importacion desde Excel (opcional)

Si tienes datos en Excel, puedes importarlos directamente:

```bash
npm run import -- "./Sistema Financiero PRO.xlsx"
```

### Estructura esperada del Excel

El archivo debe tener dos hojas con estas columnas **exactas en mayusculas**:

**Hoja `INGRESOS`**

| DESCRIPCION | TIPO | CATEGORIA | IMPORTE MES (EUR) | FECHA INICIO | FECHA FIN | ESCENARIO | ESTADO |
|-------------|------|-----------|-------------------|--------------|-----------|-----------|--------|
| Salario XYZ | Nomina | Trabajo | 2100 | 2026-02-01 | | Realista | Activo |

**Hoja `GASTOS`**

| DESCRIPCION | CATEGORIA | SUBCATEGORIA | IMPORTE MES (EUR) | TIPO | PRIORIDAD | ESCENARIO | ESTADO |
|-------------|-----------|--------------|-------------------|------|-----------|-----------|--------|
| Kaltmiete | Vivienda | Alquiler | 850 | Fijo | Esencial | Conservador | Activo |

> **Nota:** El script convierte automaticamente `Realista` → `2`, `Activo` → `active`, etc.

---

## Logica del sistema

### Regla de inclusion en el forecast

Un ingreso o gasto **aplica en un mes** si se cumplen las tres condiciones:

```
start_date  <=  ultimo dia del mes
end_date    IS NULL  OR  end_date >= primer dia del mes
scenario    <=  active_scenario
```

### Calculo mensual

```
total_income    = SUM(ingresos activos del mes)
total_expenses  = SUM(gastos activos del mes)
monthly_balance = total_income - total_expenses
cumulative      = cumulative_anterior + monthly_balance
ratio_gastos    = (total_expenses / total_income) * 100
ratio_ayudas    = (aid_income / total_income) * 100
```

### Alertas automaticas

| Tipo | Condicion | Severidad |
|------|-----------|-----------|
| `deficit` | `monthly_balance < 0` | Error |
| `high_expenses` | `ratio_gastos > umbral` | Warning / Error |
| `aid_dependency` | `ratio_ayudas > umbral` | Warning |
| `income_ending` | `end_date` proxima | Warning / Error |
| `new_expense` | `start_date` proxima | Warning |

Los umbrales se configuran en `/settings` sin tocar codigo.

---

## Historico mensual

> **Los datos reales no se recalculan. Nunca.**

Cada mes cerrado es un **snapshot inmutable**:

```
┌──────────┬──────────────┬───────────────┬──────────────┐
│   Mes    │  Real        │  Forecast     │  Desviacion  │
├──────────┼──────────────┼───────────────┼──────────────┤
│ Mar 2026 │ 3.050 EUR   │ 3.007 EUR    │ +43 EUR     │
│ Feb 2026 │ 3.007 EUR   │ 3.007 EUR    │ 0 EUR       │
│ Ene 2026 │ 907 EUR     │ 907 EUR      │ 0 EUR       │
└──────────┴──────────────┴───────────────┴──────────────┘
```

El forecast puede cambiar si editas ingresos o gastos.
El historico **permanece fijo** — ese es el valor real de la herramienta.

---

## Estructura del proyecto

```
Financial-Dashboard-Pro/
│
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout + Sidebar + MobileNav
│   ├── page.tsx                  # Redirect → /dashboard
│   ├── globals.css               # Tailwind base
│   ├── dashboard/
│   │   └── page.tsx              # KPIs + alertas + grafico 6m
│   ├── incomes/
│   │   └── page.tsx              # CRUD ingresos + filtros
│   ├── expenses/
│   │   └── page.tsx              # CRUD gastos + filtros
│   ├── forecast/
│   │   └── page.tsx              # Tabla forecast + graficos
│   ├── scenarios/
│   │   └── page.tsx              # Comparativa 3 escenarios
│   ├── history/
│   │   └── page.tsx              # Historico mensual + cierres
│   └── settings/
│       └── page.tsx              # Configuracion global
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx           # Navegacion desktop
│   │   └── MobileNav.tsx         # Bottom nav movil
│   ├── ui/
│   │   ├── KPICard.tsx           # Tarjeta de metrica
│   │   ├── AlertBanner.tsx       # Alertas inline
│   │   ├── Badge.tsx             # Etiquetas de estado
│   │   └── DataTable.tsx         # Tabla generica tipada
│   ├── forms/
│   │   ├── IncomeForm.tsx        # Modal ingreso
│   │   └── ExpenseForm.tsx       # Modal gasto
│   └── charts/
│       ├── IncomeExpenseChart.tsx # Barras ingresos vs gastos
│       └── BalanceChart.tsx       # Linea balance + acumulado
│
├── lib/
│   ├── supabase.ts               # Cliente + helpers tipados
│   ├── calculations.ts           # Motor de forecast
│   ├── scenarios.ts              # Comparativa de escenarios
│   ├── alerts.ts                 # Generador de alertas
│   └── dates.ts                  # Utilidades de fecha
│
├── types/
│   └── index.ts                  # Todos los tipos e interfaces
│
├── db/
│   ├── schema.sql                # Tablas, RLS, triggers, indexes
│   └── seed.sql                  # Datos iniciales de ejemplo
│
├── scripts/
│   └── import-excel.ts           # Importador desde .xlsx
│
├── public/
│   ├── manifest.json             # PWA manifest
│   └── icons/
│       ├── icon-192.png          # Icono PWA 192x192
│       └── icon-512.png          # Icono PWA 512x512
│
├── .env.local.example            # Template de variables
├── next.config.js                # Config Next.js + PWA
├── tailwind.config.ts            # Config Tailwind
├── tsconfig.json                 # TypeScript paths + strict
└── package.json                  # Scripts + dependencias
```

---

## Scripts disponibles

| Comando | Descripcion |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo en `localhost:3000` |
| `npm run build` | Build de produccion |
| `npm run start` | Servidor de produccion |
| `npm run import` | Importar datos desde Excel |

---

## Deploy en Vercel

```bash
# Opcion A — desde CLI
npm install -g vercel
vercel

# Opcion B — desde GitHub
# 1. Subir repo a GitHub
# 2. Importar en vercel.com/new
# 3. Configurar variables de entorno
# 4. Deploy automatico en cada push a main
```

Variables de entorno en Vercel:

```
NEXT_PUBLIC_SUPABASE_URL      → tu URL de Supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY → tu anon key de Supabase
```

> `SUPABASE_SERVICE_ROLE_KEY` **no** va en Vercel — es solo para el script de importacion local.

---

## PWA — Instalacion movil

### Android (Chrome)
1. Abrir la app en Chrome
2. Menu `⋮` → **Instalar app**
3. Confirmar — aparece en el launcher

### iOS (Safari)
1. Abrir la app en Safari
2. Boton compartir `⬆` → **Anadir a pantalla de inicio**
3. Confirmar — aparece en el home screen

La app se abre en modo **standalone** sin barra del navegador.

---

## Problemas comunes

### `Missing script: dev`
Estas fuera del directorio del proyecto. Ejecuta `cd "Financial Dashboard Pro"`.

### `Cannot find module dotenv`
```bash
npm install -D dotenv
```

### Error de RLS en Supabase
Las politicas RLS requieren usuario autenticado. Crea un usuario en **Supabase → Authentication → Users**.

### Importacion Excel falla
Verifica que:
- Los nombres de hojas esten en **MAYUSCULAS**: `INGRESOS`, `GASTOS`
- Las columnas coincidan exactamente con la tabla de la seccion de importacion
- `SUPABASE_SERVICE_ROLE_KEY` este en `.env.local`

---

## Roadmap

- [ ] Multi-usuario (familia / pareja)
- [ ] Alertas push reales (Web Push API)
- [ ] Integracion bancaria PSD2
- [ ] Prediccion de gasto con IA
- [ ] Export fiscal automatico (PDF)
- [ ] Presupuestos por categoria
- [ ] Modo freelance — clientes y proyectos

---

## Buenas practicas

**No subir nunca:**

```
.env.local          ← credenciales privadas
node_modules/       ← generado por npm install
.next/              ← generado por npm run build
```

Estos ya estan en `.gitignore` por defecto.

---

<div align="center">

**Financial Dashboard Pro** — Construido con Next.js, Supabase y Tailwind CSS

*Esto ya no es un Excel bonito. Es un sistema financiero personal con logica de decision.*

</div>
