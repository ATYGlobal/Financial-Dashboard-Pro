🚀 Sistema Financiero PRO — PWA

Control financiero realista, basado en escenarios, diseñado para tomar decisiones con datos, no con intuición.

⸻

🧠 Filosofía del sistema

Este proyecto nace de una idea simple pero poderosa:

No gestionas dinero. Gestionas escenarios.

* Conservador → supervivencia
* Realista → estabilidad
* Optimista → crecimiento

La app no solo registra… anticipa.

⸻

⚙️ Stack tecnológico

* Next.js 14 (App Router)
* TypeScript
* Supabase (DB + Auth + RLS)
* TailwindCSS
* Recharts
* PWA (next-pwa)

⸻

📦 Requisitos

* Node.js 18+
* Cuenta en Supabase
* Cuenta en Vercel

⸻

🧩 1. Instalación

git clone https://github.com/ATYGlobal/Financial-Dashboard-Pro.git
cd Financial\ Dashboard\ Pro
npm install

⸻

🗄️ 2. Configuración de Supabase

1. Crear proyecto en 👉 https://supabase.com
2. Ir a SQL Editor
3. Ejecutar:

-- Esquema
/db/schema.sql
-- Datos iniciales
/db/seed.sql

4. Ir a Settings → API
5. Copiar:

* NEXT_PUBLIC_SUPABASE_URL
* NEXT_PUBLIC_SUPABASE_ANON_KEY

⸻

🔐 3. Variables de entorno

cp .env.local.example .env.local

Editar .env.local:

NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=... # SOLO para importación Excel

⸻

🧪 4. Desarrollo local

npm run dev

Abrir:

http://localhost:3000

⸻

📊 5. Importación desde Excel (opcional)

npm run import -- "./Sistema Financiero PRO.xlsx"

⚠️ Requisitos:

* .env.local con SUPABASE_SERVICE_ROLE_KEY
* Hojas:
    * INGRESOS
    * GASTOS

Columnas esperadas

INGRESOS

* DESCRIPCIÓN
* TIPO
* CATEGORÍA
* IMPORTE MES (€)
* FECHA INICIO / FIN
* ESCENARIO
* ESTADO

GASTOS

* DESCRIPCIÓN
* CATEGORÍA / SUBCATEGORÍA
* IMPORTE MES (€)
* TIPO
* PRIORIDAD
* ESCENARIO
* ESTADO

⸻

🧮 Lógica del sistema

✔️ Regla de inclusión

Un item aplica si:

* start_date <= fin del mes
* end_date IS NULL OR >= inicio del mes
* scenario <= active_scenario

⸻

🎯 Escenarios

Escenario	Nivel	Qué incluye
Conservador	1	Solo lo seguro
Realista	2	Base + crecimiento probable
Optimista	3	Todo

⸻

📈 Forecast

* Horizonte configurable (6–24 meses)
* Balance mensual + acumulado
* Detección automática de:
    * Déficits
    * Dependencia de ayudas
    * Exceso de gasto

⸻

📜 Histórico (clave del sistema)

🔒 Los datos reales no se recalculan

* Cada mes cerrado = snapshot inmutable
* El forecast cambia → el histórico NO

Esto es lo que convierte la app en herramienta de decisión real.

⸻

🧱 Estructura del proyecto

sistema-financiero/
├── app/
│   ├── dashboard/
│   ├── incomes/
│   ├── expenses/
│   ├── forecast/
│   ├── scenarios/
│   ├── history/
│   └── settings/
├── components/
│   ├── ui/
│   ├── forms/
│   ├── charts/
│   └── layout/
├── lib/
├── db/
├── scripts/
├── public/
└── types/

⸻

📱 PWA

Instalación

* Android (Chrome) → “Instalar app”
* iOS (Safari) → “Añadir a pantalla de inicio”

Features

* Offline básico
* Modo standalone
* Iconos personalizados

⸻

🚀 Deploy en Vercel

1. Ir a 👉 https://vercel.com
2. Importar repo
3. Configurar variables:

NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY

4. Deploy

⸻

⚠️ Buenas prácticas

No subir:

.env.local
node_modules
.next

⸻

🧨 Problemas comunes

❌ “Missing script dev”

➡️ Estás fuera del proyecto

⸻

❌ “Cannot find module dotenv”

npm install -D dotenv

⸻

❌ Supabase error (RLS)

➡️ Crear usuario o revisar policies

⸻

❌ Import Excel falla

➡️ Revisar:

* nombres en MAYÚSCULAS
* columnas exactas

⸻

🧭 Roadmap (visión real)

* Multi-user (familia)
* Alertas push reales
* Integración bancaria (PSD2)
* IA: predicción de gasto
* Export fiscal automático

⸻
