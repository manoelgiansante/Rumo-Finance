-- =====================================================
-- RUMO FINANCE - TABELAS ADICIONAIS
-- Execute este script no SQL Editor do Supabase Dashboard
-- =====================================================

-- 1. ASSETS (Ativos/Patrimônio)
CREATE TABLE IF NOT EXISTS assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  purchase_date DATE,
  purchase_value DECIMAL(12,2) DEFAULT 0,
  current_value DECIMAL(12,2) DEFAULT 0,
  depreciation_rate DECIMAL(5,2) DEFAULT 10,
  farm_id UUID,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. FORECASTS (Previsões Financeiras)
CREATE TABLE IF NOT EXISTS forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL,
  category VARCHAR(100),
  description VARCHAR(255) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  probability DECIMAL(5,2) DEFAULT 80,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. BUDGETS (Orçamentos)
CREATE TABLE IF NOT EXISTS budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(100) NOT NULL,
  planned_amount DECIMAL(12,2) NOT NULL,
  actual_amount DECIMAL(12,2) DEFAULT 0,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. CLOSING_PERIODS (Fechamento Mensal)
CREATE TABLE IF NOT EXISTS closing_periods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'open',
  total_revenue DECIMAL(12,2) DEFAULT 0,
  total_expense DECIMAL(12,2) DEFAULT 0,
  balance DECIMAL(12,2) DEFAULT 0,
  closed_at TIMESTAMP,
  closed_by UUID,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. FIELD_NOTEBOOK (Caderno de Campo)
CREATE TABLE IF NOT EXISTS field_notebook (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  farm_id UUID,
  farm_name VARCHAR(255),
  sector VARCHAR(100),
  activity_type VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  weather JSONB,
  observations TEXT,
  photos TEXT[],
  location JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE closing_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_notebook ENABLE ROW LEVEL SECURITY;

-- 6. MACHINES (Integração com Rumo Máquinas)
CREATE TABLE IF NOT EXISTS machines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(50), -- tractor, harvester, sprayer, etc.
  brand VARCHAR(100),
  model VARCHAR(100),
  year INTEGER,
  hour_meter DECIMAL(10,1) DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active',
  last_maintenance DATE,
  next_maintenance DATE,
  fuel_consumption DECIMAL(6,2), -- L/h
  operational_cost DECIMAL(10,2), -- R$/h
  farm_id UUID,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 7. MACHINE_OPERATIONS (Operações de Máquinas)
CREATE TABLE IF NOT EXISTS machine_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id UUID REFERENCES machines(id),
  machine_name VARCHAR(255),
  operation_type VARCHAR(100),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP,
  hours_worked DECIMAL(6,2) DEFAULT 0,
  fuel_used DECIMAL(8,2),
  area_covered DECIMAL(10,2), -- hectares
  operator_name VARCHAR(255),
  farm_id UUID,
  sector VARCHAR(100),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 8. MACHINE_MAINTENANCE (Manutenções)
CREATE TABLE IF NOT EXISTS machine_maintenance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  machine_id UUID REFERENCES machines(id),
  machine_name VARCHAR(255),
  maintenance_type VARCHAR(20), -- preventive, corrective, routine
  description TEXT NOT NULL,
  date DATE NOT NULL,
  cost DECIMAL(12,2) DEFAULT 0,
  parts_replaced TEXT[],
  technician VARCHAR(255),
  next_maintenance_date DATE,
  next_maintenance_hours DECIMAL(10,1),
  created_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE machine_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE machine_maintenance ENABLE ROW LEVEL SECURITY;

-- Policies para acesso público (development)
CREATE POLICY "Enable all access for assets" ON assets FOR ALL USING (true);
CREATE POLICY "Enable all access for forecasts" ON forecasts FOR ALL USING (true);
CREATE POLICY "Enable all access for budgets" ON budgets FOR ALL USING (true);
CREATE POLICY "Enable all access for closing_periods" ON closing_periods FOR ALL USING (true);
CREATE POLICY "Enable all access for field_notebook" ON field_notebook FOR ALL USING (true);
CREATE POLICY "Enable all access for machines" ON machines FOR ALL USING (true);
CREATE POLICY "Enable all access for machine_operations" ON machine_operations FOR ALL USING (true);
CREATE POLICY "Enable all access for machine_maintenance" ON machine_maintenance FOR ALL USING (true);
