-- ═══════════════════════════════════════════════════════════════
-- SÈVRES & CO. — SUPABASE SCHEMA
-- Run this entire file in the Supabase SQL Editor
-- Project Settings → SQL Editor → New Query → Paste → Run
-- ═══════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────
-- EXTENSIONS
-- ─────────────────────────────────────────────

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ─────────────────────────────────────────────
-- ENUMS
-- ─────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE service_category AS ENUM ('hair', 'skin', 'nails', 'massage');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;


-- ─────────────────────────────────────────────
-- PROFILES TABLE
-- Extends Supabase auth.users
-- One row per authenticated user
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name   TEXT        NOT NULL,
  email       TEXT        NOT NULL,
  phone       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger on profiles
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ─────────────────────────────────────────────
-- AUTO-CREATE PROFILE ON SIGNUP
-- Trigger fires when a new user registers via
-- Supabase Auth — creates their profile row
-- automatically so no manual insert is needed
-- ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    NEW.raw_user_meta_data->>'phone'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─────────────────────────────────────────────
-- SERVICES TABLE
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.services (
  id          UUID             PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT             NOT NULL,
  category    service_category NOT NULL,
  duration    INTEGER          NOT NULL CHECK (duration >= 15),
  price       INTEGER          NOT NULL CHECK (price >= 0),
  description TEXT,
  active      BOOLEAN          NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ      NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ      NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS services_category_idx ON public.services(category);
CREATE INDEX IF NOT EXISTS services_active_idx   ON public.services(active);

-- Updated_at trigger
DROP TRIGGER IF EXISTS services_updated_at ON public.services;
CREATE TRIGGER services_updated_at
  BEFORE UPDATE ON public.services
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ─────────────────────────────────────────────
-- STYLISTS TABLE
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.stylists (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT        NOT NULL,
  bio         TEXT,
  photo_url   TEXT,
  specialties TEXT[]      NOT NULL DEFAULT '{}',
  active      BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS stylists_active_idx ON public.stylists(active);

-- Updated_at trigger
DROP TRIGGER IF EXISTS stylists_updated_at ON public.stylists;
CREATE TRIGGER stylists_updated_at
  BEFORE UPDATE ON public.stylists
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ─────────────────────────────────────────────
-- BOOKINGS TABLE
-- ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.bookings (
  id          UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID           NOT NULL REFERENCES auth.users(id)      ON DELETE CASCADE,
  service_id  UUID           NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  stylist_id  UUID           NOT NULL REFERENCES public.stylists(id) ON DELETE RESTRICT,
  date        DATE           NOT NULL,
  time_slot   TEXT           NOT NULL,
  status      booking_status NOT NULL DEFAULT 'pending',
  notes       TEXT,
  created_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

  -- Prevent double-booking same stylist at same slot
  CONSTRAINT unique_stylist_slot
    UNIQUE (stylist_id, date, time_slot)
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS bookings_user_id_idx   ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_stylist_id_idx ON public.bookings(stylist_id);
CREATE INDEX IF NOT EXISTS bookings_date_idx       ON public.bookings(date);
CREATE INDEX IF NOT EXISTS bookings_status_idx     ON public.bookings(status);
CREATE INDEX IF NOT EXISTS bookings_date_stylist_idx
  ON public.bookings(stylist_id, date);

-- Updated_at trigger
DROP TRIGGER IF EXISTS bookings_updated_at ON public.bookings;
CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


-- ═══════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY (RLS)
-- ═══════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────
-- ENABLE RLS ON ALL TABLES
-- ─────────────────────────────────────────────

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stylists  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings  ENABLE ROW LEVEL SECURITY;


-- ─────────────────────────────────────────────
-- PROFILES POLICIES
-- ─────────────────────────────────────────────

-- Users can read their own profile only
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Users can insert their own profile (belt-and-suspenders alongside trigger)
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Users can update their own profile
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users cannot delete their own profile
-- Deletion happens via auth.users cascade


-- ─────────────────────────────────────────────
-- SERVICES POLICIES
-- Public read — anyone can browse services
-- Write — service role only (admin API routes)
-- ─────────────────────────────────────────────

-- Anyone (including anonymous) can read active services
DROP POLICY IF EXISTS "services_select_active_public" ON public.services;
CREATE POLICY "services_select_active_public"
  ON public.services
  FOR SELECT
  USING (active = TRUE);

-- Authenticated users can also read inactive services
-- (for completeness — admin uses service role which bypasses RLS)
DROP POLICY IF EXISTS "services_select_all_authed" ON public.services;
CREATE POLICY "services_select_all_authed"
  ON public.services
  FOR SELECT
  USING (auth.role() = 'authenticated');


-- ─────────────────────────────────────────────
-- STYLISTS POLICIES
-- Public read of active stylists
-- Write — service role only
-- ─────────────────────────────────────────────

DROP POLICY IF EXISTS "stylists_select_active_public" ON public.stylists;
CREATE POLICY "stylists_select_active_public"
  ON public.stylists
  FOR SELECT
  USING (active = TRUE);

DROP POLICY IF EXISTS "stylists_select_all_authed" ON public.stylists;
CREATE POLICY "stylists_select_all_authed"
  ON public.stylists
  FOR SELECT
  USING (auth.role() = 'authenticated');


-- ─────────────────────────────────────────────
-- BOOKINGS POLICIES
-- Critical: users see only their own bookings
-- Admin uses service role which bypasses RLS
-- ─────────────────────────────────────────────

-- Users can only read their own bookings
DROP POLICY IF EXISTS "bookings_select_own" ON public.bookings;
CREATE POLICY "bookings_select_own"
  ON public.bookings
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert bookings for themselves only
DROP POLICY IF EXISTS "bookings_insert_own" ON public.bookings;
CREATE POLICY "bookings_insert_own"
  ON public.bookings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own bookings
-- (used to cancel — status change only)
DROP POLICY IF EXISTS "bookings_update_own" ON public.bookings;
CREATE POLICY "bookings_update_own"
  ON public.bookings
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users cannot delete bookings — cancellation is a status update
-- Hard deletes reserved for service role / admin


-- ═══════════════════════════════════════════════════════════════
-- SEED DATA
-- Paste and run AFTER tables are created
-- Comment out if you prefer to add via Admin Dashboard
-- ═══════════════════════════════════════════════════════════════


-- ─────────────────────────────────────────────
-- SEED STYLISTS
-- ─────────────────────────────────────────────

INSERT INTO public.stylists (name, bio, specialties, active) VALUES
(
  'Isabelle Morel',
  'Trained at Vidal Sassoon London, Isabelle brings 14 years of colour mastery to every appointment. Her balayage technique is sought after by Mumbai''s most discerning clientele.',
  ARRAY['Balayage', 'Colour', 'Keratin'],
  TRUE
),
(
  'Priya Nair',
  'A certified skin therapist with advanced training in LED therapy and gold facials. Priya believes radiant skin begins with understanding the individual.',
  ARRAY['Facials', 'LED Therapy', 'Microdermabrasion'],
  TRUE
),
(
  'Zara Khan',
  'Nail artist and extension specialist with a background in fine art. Zara''s nail designs have been featured in Vogue India and Elle Beauty.',
  ARRAY['Nail Art', 'Gel', 'Extensions'],
  TRUE
),
(
  'Amélie Dupont',
  'A holistic therapist trained in Bali and Paris, Amélie''s massage treatments are rituals in themselves. Her hot stone sessions are fully booked weeks in advance.',
  ARRAY['Hot Stone', 'Swedish', 'Deep Tissue'],
  TRUE
),
(
  'Rohan Mehta',
  'Precision haircut specialist with a decade of experience at luxury salons in Dubai and Mumbai. Rohan''s style philosophy: structure first, beauty follows.',
  ARRAY['Haircut', 'Blowout', 'Styling'],
  TRUE
),
(
  'Sofia Alves',
  'Brazilian-born spa therapist specialising in body rituals and scrubs. Sofia''s Himalayan Salt Scrub has a devoted following among Sèvres regulars.',
  ARRAY['Body Rituals', 'Scrubs', 'Relaxation'],
  TRUE
)
ON CONFLICT DO NOTHING;


-- ─────────────────────────────────────────────
-- SEED SERVICES
-- ─────────────────────────────────────────────

INSERT INTO public.services (name, category, duration, price, description, active) VALUES

-- HAIR
('Signature Blowout',            'hair', 60,  2500,  'A luxurious wash, condition, and style tailored to your hair type.',                            TRUE),
('Full Colour',                  'hair', 120, 6500,  'All-over colour with premium Wella or L''Oréal Professionnel shades.',                          TRUE),
('Balayage & Highlights',        'hair', 150, 9500,  'Hand-painted highlights for a natural, sun-kissed dimension.',                                   TRUE),
('Keratin Smoothing Treatment',  'hair', 180, 11000, 'Frizz-free, glossy results that last up to four months.',                                        TRUE),
('Precision Haircut',            'hair', 60,  1800,  'A tailored cut crafted to your face shape and lifestyle.',                                       TRUE),

-- SKIN
('Classic European Facial',      'skin', 75,  3500,  'Deep cleanse, exfoliation, and hydration for luminous skin.',                                    TRUE),
('Gold Radiance Facial',         'skin', 90,  5500,  '24K gold-infused treatment to firm, brighten, and rejuvenate.',                                  TRUE),
('Microdermabrasion',            'skin', 60,  4200,  'Crystal exfoliation to resurface and refine skin texture.',                                      TRUE),
('LED Light Therapy',            'skin', 45,  3000,  'Red and blue light therapy to target acne, ageing, and inflammation.',                           TRUE),

-- NAILS
('Classic Manicure',             'nails', 45, 1200,  'Shaping, cuticle care, and polish with your choice of colour.',                                  TRUE),
('Gel Manicure',                 'nails', 60, 1800,  'Long-lasting gel colour cured under UV for a flawless, chip-free finish.',                       TRUE),
('Luxury Spa Pedicure',          'nails', 75, 2200,  'Soak, scrub, mask, and polish — a complete foot revival ritual.',                                TRUE),
('Nail Art & Extensions',        'nails', 90, 3500,  'Bespoke nail extensions with hand-painted art by our nail artists.',                             TRUE),

-- MASSAGE
('Swedish Relaxation Massage',   'massage', 60,  3800, 'Gentle, flowing strokes to melt tension and restore calm.',                                   TRUE),
('Deep Tissue Massage',          'massage', 75,  4500, 'Targeted pressure on deep muscle layers for lasting relief.',                                  TRUE),
('Hot Stone Ritual',             'massage', 90,  5800, 'Warmed basalt stones combined with aromatherapy oil for profound relaxation.',                 TRUE),
('Himalayan Salt Scrub',         'massage', 60,  4200, 'Full-body exfoliation with mineral-rich Himalayan salt and nourishing oils.',                  TRUE)

ON CONFLICT DO NOTHING;


-- ═══════════════════════════════════════════════════════════════
-- VERIFY SETUP
-- Run these SELECT statements after setup to confirm
-- ═══════════════════════════════════════════════════════════════

-- SELECT COUNT(*) FROM public.stylists;  -- should be 6
-- SELECT COUNT(*) FROM public.services;  -- should be 17
-- SELECT schemaname, tablename, rowsecurity
--   FROM pg_tables
--   WHERE schemaname = 'public';          -- RLS should be TRUE for all tables