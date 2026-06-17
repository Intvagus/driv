-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- ENUMS
-- ============================================================
DO $$ BEGIN
  CREATE TYPE procedure_category AS ENUM ('surgical', 'non_surgical');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE procedure_status AS ENUM ('draft', 'published', 'archived');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('awaiting_deposit', 'confirmed', 'cancelled', 'completed');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE payment_status AS ENUM (
    'deposit_pending',
    'deposit_submitted',
    'deposit_confirmed',
    'deposit_rejected',
    'balance_pending',
    'fully_paid'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'quoted', 'converted', 'lost');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE blog_status AS ENUM ('draft', 'published');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE admin_role AS ENUM (
    'super_admin',
    'content_editor',
    'procedure_manager',
    'patient_coordinator',
    'finance_admin',
    'clinical_coordinator'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============================================================
-- TABLES
-- ============================================================

-- Procedures
CREATE TABLE procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category procedure_category NOT NULL DEFAULT 'surgical',
  technique TEXT,
  graft_range_min INT,
  graft_range_max INT,
  duration_hours NUMERIC,
  downtime_days INT,
  price_per_graft NUMERIC,
  package_price NUMERIC,
  advance_amount NUMERIC,
  description TEXT,
  process_steps JSONB,
  included JSONB,
  excluded JSONB,
  pre_op_care TEXT,
  post_op_care TEXT,
  recovery_timeline JSONB,
  risks TEXT,
  seo_title TEXT,
  seo_description TEXT,
  status procedure_status NOT NULL DEFAULT 'draft',
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Bookings
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reference UUID NOT NULL DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_whatsapp TEXT,
  procedure_id UUID REFERENCES procedures(id) ON DELETE SET NULL,
  preferred_date DATE,
  scheduled_date DATE,
  booking_status booking_status NOT NULL DEFAULT 'awaiting_deposit',
  payment_status payment_status NOT NULL DEFAULT 'deposit_pending',
  estimated_total NUMERIC,
  advance_required NUMERIC,
  advance_paid NUMERIC,
  balance_due NUMERIC,
  notes TEXT,
  deposit_upload_token UUID NOT NULL DEFAULT gen_random_uuid(),
  deposit_reminder_count INT NOT NULL DEFAULT 0,
  last_deposit_reminder_sent_at TIMESTAMPTZ,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Consultation Leads
CREATE TABLE consultation_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  hair_loss_area TEXT,
  norwood_stage TEXT,
  age INT,
  medical_history TEXT,
  budget TEXT,
  preferred_technique TEXT,
  preferred_dates TEXT,
  notes TEXT,
  photo_path TEXT,
  status lead_status NOT NULL DEFAULT 'new',
  assigned_to UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Blog Posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image_path TEXT,
  author TEXT,
  tags TEXT[],
  seo_title TEXT,
  seo_description TEXT,
  status blog_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Before/After Gallery
CREATE TABLE before_after_gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  procedure_id UUID REFERENCES procedures(id) ON DELETE SET NULL,
  patient_consent BOOLEAN NOT NULL DEFAULT FALSE,
  before_image_path TEXT NOT NULL,
  after_image_path TEXT NOT NULL,
  months_post_op INT,
  graft_count INT,
  technique TEXT,
  description TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Testimonials
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_name TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT NOT NULL,
  procedure_id UUID REFERENCES procedures(id) ON DELETE SET NULL,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Team Members
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  photo_path TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Booking Reminders
CREATE TABLE booking_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  sent_via TEXT NOT NULL,
  message TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admin Users
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role admin_role NOT NULL DEFAULT 'content_editor',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Site Settings
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_procedures_updated_at BEFORE UPDATE ON procedures FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_consultation_leads_updated_at BEFORE UPDATE ON consultation_leads FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultation_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE before_after_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Helper function: is current user an admin?
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid()
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function: is current user a super_admin?
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE id = auth.uid() AND role = 'super_admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- PROCEDURES policies
CREATE POLICY "procedures_public_read" ON procedures FOR SELECT USING (status = 'published');
CREATE POLICY "procedures_admin_all" ON procedures FOR ALL USING (is_admin());

-- BOOKINGS policies
CREATE POLICY "bookings_patient_read_own" ON bookings FOR SELECT
  USING (user_id = auth.uid() OR deposit_upload_token = (current_setting('request.jwt.claims', true)::jsonb->>'deposit_upload_token')::uuid);
CREATE POLICY "bookings_patient_update_own" ON bookings FOR UPDATE
  USING (user_id = auth.uid());
CREATE POLICY "bookings_admin_all" ON bookings FOR ALL USING (is_admin());

-- CONSULTATION_LEADS policies
CREATE POLICY "consultation_leads_admin_all" ON consultation_leads FOR ALL USING (is_admin());
CREATE POLICY "consultation_leads_public_insert" ON consultation_leads FOR INSERT WITH CHECK (true);

-- BLOG_POSTS policies
CREATE POLICY "blog_posts_public_read" ON blog_posts FOR SELECT USING (status = 'published');
CREATE POLICY "blog_posts_admin_all" ON blog_posts FOR ALL USING (is_admin());

-- BEFORE_AFTER_GALLERY policies
CREATE POLICY "gallery_public_read" ON before_after_gallery FOR SELECT USING (patient_consent = true);
CREATE POLICY "gallery_admin_all" ON before_after_gallery FOR ALL USING (is_admin());

-- TESTIMONIALS policies
CREATE POLICY "testimonials_public_read" ON testimonials FOR SELECT USING (true);
CREATE POLICY "testimonials_admin_all" ON testimonials FOR ALL USING (is_admin());

-- TEAM_MEMBERS policies
CREATE POLICY "team_members_public_read" ON team_members FOR SELECT USING (true);
CREATE POLICY "team_members_admin_all" ON team_members FOR ALL USING (is_admin());

-- BOOKING_REMINDERS policies
CREATE POLICY "booking_reminders_admin_all" ON booking_reminders FOR ALL USING (is_admin());

-- ADMIN_USERS policies
CREATE POLICY "admin_users_read_own" ON admin_users FOR SELECT USING (id = auth.uid());
CREATE POLICY "admin_users_super_admin_all" ON admin_users FOR ALL USING (is_super_admin());

-- SITE_SETTINGS policies
CREATE POLICY "site_settings_public_read" ON site_settings FOR SELECT USING (true);
CREATE POLICY "site_settings_super_admin_write" ON site_settings FOR ALL USING (is_super_admin());

-- ============================================================
-- STORAGE BUCKETS (run manually or via dashboard)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('consultation-photos', 'consultation-photos', false);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('team-photos', 'team-photos', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('blog-images', 'blog-images', true);
