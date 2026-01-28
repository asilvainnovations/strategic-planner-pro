-- Strategic Planner Pro - Supabase Database Schema
-- This file contains the complete database schema for the application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- Stores user profile information
-- =====================================================
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    organization TEXT,
    job_title TEXT,
    phone TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notification_preferences JSONB DEFAULT '{
        "welcome_email": true,
        "kpi_alerts": true,
        "weekly_digest": true,
        "stale_plan_reminders": true
    }'::jsonb
);

-- Row Level Security (RLS) for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

-- =====================================================
-- STRATEGIC PLANS TABLE
-- Main table for strategic plans
-- =====================================================
CREATE TABLE strategic_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    organization TEXT,
    timeframe JSONB NOT NULL DEFAULT '{}'::jsonb,
    vision TEXT,
    mission TEXT,
    values TEXT[],
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed', 'archived')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES profiles(id)
);

-- Indexes for performance
CREATE INDEX idx_strategic_plans_user_id ON strategic_plans(user_id);
CREATE INDEX idx_strategic_plans_status ON strategic_plans(status);
CREATE INDEX idx_strategic_plans_created_at ON strategic_plans(created_at DESC);

-- RLS for strategic plans
ALTER TABLE strategic_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own plans"
    ON strategic_plans FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own plans"
    ON strategic_plans FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own plans"
    ON strategic_plans FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own plans"
    ON strategic_plans FOR DELETE
    USING (auth.uid() = user_id);

-- =====================================================
-- SWOT ITEMS TABLE
-- Stores SWOT analysis items
-- =====================================================
CREATE TABLE swot_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID REFERENCES strategic_plans(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('strength', 'weakness', 'opportunity', 'threat')),
    content TEXT NOT NULL,
    category TEXT,
    priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_swot_items_plan_id ON swot_items(plan_id);
CREATE INDEX idx_swot_items_type ON swot_items(type);
CREATE INDEX idx_swot_items_priority ON swot_items(priority);

-- RLS
ALTER TABLE swot_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage SWOT items in own plans"
    ON swot_items FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM strategic_plans
            WHERE strategic_plans.id = swot_items.plan_id
            AND strategic_plans.user_id = auth.uid()
        )
    );

-- =====================================================
-- STRATEGIC OPTIONS TABLE
-- Stores strategic options derived from SWOT
-- =====================================================
CREATE TABLE strategic_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID REFERENCES strategic_plans(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('SO', 'ST', 'WO', 'WT')),
    related_strengths UUID[],
    related_weaknesses UUID[],
    related_opportunities UUID[],
    related_threats UUID[],
    feasibility INTEGER CHECK (feasibility >= 1 AND feasibility <= 10),
    impact INTEGER CHECK (impact >= 1 AND impact <= 10),
    priority TEXT CHECK (priority IN ('high', 'medium', 'low')),
    status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'approved', 'in-progress', 'completed', 'rejected')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_strategic_options_plan_id ON strategic_options(plan_id);
CREATE INDEX idx_strategic_options_category ON strategic_options(category);
CREATE INDEX idx_strategic_options_status ON strategic_options(status);

-- RLS
ALTER TABLE strategic_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage strategic options in own plans"
    ON strategic_options FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM strategic_plans
            WHERE strategic_plans.id = strategic_options.plan_id
            AND strategic_plans.user_id = auth.uid()
        )
    );

-- =====================================================
-- BSC OBJECTIVES TABLE
-- Balanced Scorecard objectives
-- =====================================================
CREATE TABLE bsc_objectives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID REFERENCES strategic_plans(id) ON DELETE CASCADE,
    perspective TEXT NOT NULL CHECK (perspective IN ('financial', 'customer', 'internal', 'learning')),
    name TEXT NOT NULL,
    description TEXT,
    strategic_option_ids UUID[],
    status TEXT NOT NULL DEFAULT 'not-started' CHECK (status IN ('not-started', 'in-progress', 'completed', 'on-hold')),
    owner TEXT,
    start_date DATE,
    target_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_bsc_objectives_plan_id ON bsc_objectives(plan_id);
CREATE INDEX idx_bsc_objectives_perspective ON bsc_objectives(perspective);
CREATE INDEX idx_bsc_objectives_status ON bsc_objectives(status);

-- RLS
ALTER TABLE bsc_objectives ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage objectives in own plans"
    ON bsc_objectives FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM strategic_plans
            WHERE strategic_plans.id = bsc_objectives.plan_id
            AND strategic_plans.user_id = auth.uid()
        )
    );

-- =====================================================
-- KPIs TABLE
-- Key Performance Indicators
-- =====================================================
CREATE TABLE kpis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    objective_id UUID REFERENCES bsc_objectives(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    target TEXT NOT NULL,
    current TEXT,
    unit TEXT NOT NULL,
    frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'monthly', 'quarterly', 'yearly')),
    status TEXT NOT NULL DEFAULT 'on-track' CHECK (status IN ('on-track', 'at-risk', 'off-track', 'achieved')),
    owner TEXT,
    data_points JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_kpis_objective_id ON kpis(objective_id);
CREATE INDEX idx_kpis_status ON kpis(status);
CREATE INDEX idx_kpis_frequency ON kpis(frequency);

-- RLS
ALTER TABLE kpis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage KPIs in own plans"
    ON kpis FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM bsc_objectives
            JOIN strategic_plans ON strategic_plans.id = bsc_objectives.plan_id
            WHERE bsc_objectives.id = kpis.objective_id
            AND strategic_plans.user_id = auth.uid()
        )
    );

-- =====================================================
-- PAPS TABLE
-- Programs and Action Plans
-- =====================================================
CREATE TABLE paps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plan_id UUID REFERENCES strategic_plans(id) ON DELETE CASCADE,
    objective_id UUID REFERENCES bsc_objectives(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    activities JSONB DEFAULT '[]'::jsonb,
    budget JSONB DEFAULT '{
        "allocated": 0,
        "spent": 0,
        "currency": "USD"
    }'::jsonb,
    resources JSONB DEFAULT '[]'::jsonb,
    risks JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'planning' CHECK (status IN ('planning', 'approved', 'in-progress', 'completed', 'on-hold')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_paps_plan_id ON paps(plan_id);
CREATE INDEX idx_paps_objective_id ON paps(objective_id);
CREATE INDEX idx_paps_status ON paps(status);

-- RLS
ALTER TABLE paps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage PAPs in own plans"
    ON paps FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM strategic_plans
            WHERE strategic_plans.id = paps.plan_id
            AND strategic_plans.user_id = auth.uid()
        )
    );

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_strategic_plans_updated_at BEFORE UPDATE ON strategic_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_swot_items_updated_at BEFORE UPDATE ON swot_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_strategic_options_updated_at BEFORE UPDATE ON strategic_options
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bsc_objectives_updated_at BEFORE UPDATE ON bsc_objectives
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kpis_updated_at BEFORE UPDATE ON kpis
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_paps_updated_at BEFORE UPDATE ON paps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Uncomment to insert sample data for testing
/*
-- Insert sample user profile (replace with actual auth.users id)
INSERT INTO profiles (id, email, full_name, organization, job_title)
VALUES (
    'sample-user-id-here',
    'demo@strategicplannerpro.com',
    'Demo User',
    'Sample Organization',
    'Strategic Planning Manager'
);

-- Insert sample strategic plan
INSERT INTO strategic_plans (user_id, name, description, organization, vision, mission, values, status)
VALUES (
    'sample-user-id-here',
    'Sample Strategic Plan 2025-2027',
    'Three-year strategic plan for organizational growth',
    'Sample Organization',
    'To be the leading provider in our industry',
    'We deliver exceptional value through innovation',
    ARRAY['Innovation', 'Integrity', 'Excellence'],
    'active'
);
*/

-- =====================================================
-- ANALYTICS VIEWS (Optional)
-- =====================================================

-- View for plan statistics
CREATE OR REPLACE VIEW plan_statistics AS
SELECT
    sp.id AS plan_id,
    sp.name AS plan_name,
    sp.status,
    COUNT(DISTINCT si.id) AS swot_items_count,
    COUNT(DISTINCT so.id) AS strategic_options_count,
    COUNT(DISTINCT bo.id) AS objectives_count,
    COUNT(DISTINCT k.id) AS kpis_count,
    COUNT(DISTINCT p.id) AS paps_count,
    sp.created_at,
    sp.updated_at
FROM strategic_plans sp
LEFT JOIN swot_items si ON si.plan_id = sp.id
LEFT JOIN strategic_options so ON so.plan_id = sp.id
LEFT JOIN bsc_objectives bo ON bo.plan_id = sp.id
LEFT JOIN kpis k ON k.objective_id = bo.id
LEFT JOIN paps p ON p.plan_id = sp.id
GROUP BY sp.id, sp.name, sp.status, sp.created_at, sp.updated_at;

-- Grant access to the view
GRANT SELECT ON plan_statistics TO authenticated;

-- =====================================================
-- BACKUP RECOMMENDATIONS
-- =====================================================

-- Supabase provides automatic backups
-- For additional safety, consider:
-- 1. Regular manual backups using pg_dump
-- 2. Replication to another database
-- 3. Export critical data to JSON periodically

COMMENT ON DATABASE postgres IS 'Strategic Planner Pro - Production Database';
