-- ============================================================
-- Seed inicial — adapta los importes a tu realidad
-- ============================================================

-- Settings por defecto
update settings set
  active_scenario = 2,
  forecast_start_month = date_trunc('month', now()),
  forecast_months = 12,
  expense_ratio_alert_threshold = 80,
  aid_dependency_alert_threshold = 50,
  income_end_alert_days = 60,
  new_expense_alert_days = 30;

-- Ingresos de ejemplo (ajusta importes y fechas)
insert into income_sources (type, category, description, monthly_amount, start_date, scenario) values
  ('Nómina',            'Trabajo', 'Salario bruto neto',        1800.00, '2024-01-01', 1),
  ('Kindergeld',        'Ayuda',   'Kindergeld hijo 1',          250.00, '2024-01-01', 1),
  ('Wohngeld Plus',     'Ayuda',   'Wohngeld Plus',              350.00, '2024-03-01', 2),
  ('Kinderzuschlag',    'Ayuda',   'Kinderzuschlag',             292.00, '2024-01-01', 1),
  ('Bildung & Teilhabe','Ayuda',   'Bildung und Teilhabe',        58.00, '2024-01-01', 1),
  ('Ingreso extra',     'Extra',   'Trabajos puntuales',         200.00, '2024-06-01', 3);

-- Gastos de ejemplo (ajusta a tu realidad)
insert into expense_items (category, subcategory, description, monthly_amount, start_date, type, priority, scenario) values
  ('Vivienda',      'Alquiler',       'Alquiler piso',          900.00, '2024-01-01', 'Fijo',        'Esencial',      1),
  ('Vivienda',      'Suministros',    'Electricidad',            80.00, '2024-01-01', 'Variable',    'Esencial',      1),
  ('Vivienda',      'Suministros',    'Gas',                     60.00, '2024-01-01', 'Variable',    'Esencial',      1),
  ('Vivienda',      'Suministros',    'Internet',                30.00, '2024-01-01', 'Fijo',        'Esencial',      1),
  ('Alimentación',  null,             'Supermercado',           350.00, '2024-01-01', 'Variable',    'Esencial',      1),
  ('Transporte',    null,             'ÖPNV mensual',            49.00, '2024-01-01', 'Fijo',        'Importante',    1),
  ('Salud',         null,             'Krankenkasse',           180.00, '2024-01-01', 'Fijo',        'Esencial',      1),
  ('Educación',     null,             'Actividades niños',       50.00, '2024-01-01', 'Variable',    'Importante',    1),
  ('Suscripciones', null,             'Netflix/Spotify',         20.00, '2024-01-01', 'Suscripción', 'Prescindible',  1),
  ('Ahorro',        null,             'Fondo emergencia',       100.00, '2024-01-01', 'Fijo',        'Importante',    2),
  ('Ocio',          null,             'Salidas y ocio',          80.00, '2024-01-01', 'Variable',    'Prescindible',  2);