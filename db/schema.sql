-- ============================================================
-- Sistema Financiero PRO — PostgreSQL / Supabase Schema
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ============================================================
-- SETTINGS (single row, upserted)
-- ============================================================
create table if not exists settings (
  id                          int primary key default 1 check (id = 1),
  active_scenario             int not null default 2,  -- 1=Conservador, 2=Realista, 3=Optimista
  forecast_start_month        date not null default date_trunc('month', now()),
  forecast_months             int not null default 12,
  expense_ratio_alert_threshold    numeric(5,2) not null default 80.00,  -- %
  aid_dependency_alert_threshold   numeric(5,2) not null default 50.00,  -- %
  income_end_alert_days       int not null default 60,
  new_expense_alert_days      int not null default 30,
  updated_at                  timestamptz not null default now()
);

insert into settings (id) values (1) on conflict do nothing;

-- ============================================================
-- INCOME SOURCES
-- ============================================================
create table if not exists income_sources (
  id              uuid primary key default gen_random_uuid(),
  type            text not null,        -- Nómina, Kindergeld, Wohngeld Plus, etc.
  category        text not null,        -- Trabajo, Ayuda, Extra, Otro
  description     text not null,
  monthly_amount  numeric(12,2) not null default 0,
  start_date      date not null,
  end_date        date,
  status          text not null default 'active',  -- active, finished, planned
  scenario        int not null default 1,           -- 1=Conservador, 2=Realista, 3=Optimista
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================
-- EXPENSE ITEMS
-- ============================================================
create table if not exists expense_items (
  id              uuid primary key default gen_random_uuid(),
  category        text not null,        -- Vivienda, Alimentación, Transporte, etc.
  subcategory     text,
  description     text not null,
  monthly_amount  numeric(12,2) not null default 0,
  start_date      date not null,
  end_date        date,
  type            text not null,        -- Fijo, Variable, Puntual, Deuda, Suscripción
  priority        text not null,        -- Esencial, Importante, Prescindible
  scenario        int not null default 1,
  status          text not null default 'active',  -- active, finished, planned
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ============================================================
-- MONTHLY SNAPSHOTS (histórico real)
-- ============================================================
create table if not exists monthly_snapshots (
  id                  uuid primary key default gen_random_uuid(),
  month               date not null unique,  -- always first day of month
  real_income         numeric(12,2),
  real_expenses       numeric(12,2),
  real_balance        numeric(12,2) generated always as (
                        coalesce(real_income,0) - coalesce(real_expenses,0)
                      ) stored,
  forecast_income     numeric(12,2),
  forecast_expenses   numeric(12,2),
  forecast_balance    numeric(12,2) generated always as (
                        coalesce(forecast_income,0) - coalesce(forecast_expenses,0)
                      ) stored,
  income_deviation    numeric(12,2) generated always as (
                        case when real_income is not null and forecast_income is not null
                        then real_income - forecast_income else null end
                      ) stored,
  expense_deviation   numeric(12,2) generated always as (
                        case when real_expenses is not null and forecast_expenses is not null
                        then real_expenses - forecast_expenses else null end
                      ) stored,
  balance_deviation   numeric(12,2) generated always as (
                        case when real_income is not null and forecast_income is not null
                        then (real_income - coalesce(real_expenses,0)) - (forecast_income - coalesce(forecast_expenses,0))
                        else null end
                      ) stored,
  closed              boolean not null default false,
  closed_at           timestamptz,
  notes               text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ============================================================
-- Row Level Security (basic — single user)
-- ============================================================
alter table settings enable row level security;
alter table income_sources enable row level security;
alter table expense_items enable row level security;
alter table monthly_snapshots enable row level security;

-- Allow all operations for authenticated users (single-user app)
create policy "auth users all" on settings for all using (auth.role() = 'authenticated');
create policy "auth users all" on income_sources for all using (auth.role() = 'authenticated');
create policy "auth users all" on expense_items for all using (auth.role() = 'authenticated');
create policy "auth users all" on monthly_snapshots for all using (auth.role() = 'authenticated');

-- ============================================================
-- Indexes
-- ============================================================
create index on income_sources (start_date, end_date, scenario);
create index on income_sources (status);
create index on expense_items (start_date, end_date, scenario);
create index on expense_items (status, priority);
create index on monthly_snapshots (month);

-- ============================================================
-- Updated_at trigger
-- ============================================================
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_income_sources_updated
  before update on income_sources
  for each row execute function update_updated_at();

create trigger trg_expense_items_updated
  before update on expense_items
  for each row execute function update_updated_at();

create trigger trg_monthly_snapshots_updated
  before update on monthly_snapshots
  for each row execute function update_updated_at();

create trigger trg_settings_updated
  before update on settings
  for each row execute function update_updated_at();