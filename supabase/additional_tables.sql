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

-- Enable Row Level Security
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE closing_periods ENABLE ROW LEVEL SECURITY;

-- Policies para acesso público (development)
CREATE POLICY "Enable all access for assets" ON assets FOR ALL USING (true);
CREATE POLICY "Enable all access for forecasts" ON forecasts FOR ALL USING (true);
CREATE POLICY "Enable all access for budgets" ON budgets FOR ALL USING (true);
CREATE POLICY "Enable all access for closing_periods" ON closing_periods FOR ALL USING (true);
