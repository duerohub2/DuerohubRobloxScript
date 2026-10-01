-- ScriptHub initial schema — PRD section 4, verbatim.
-- Run in Supabase SQL Editor. Idempotent types/tables are NOT guaranteed —
-- run once against a fresh project.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TYPE user_role AS ENUM ('user', 'moderator', 'admin');
CREATE TYPE script_status AS ENUM ('published', 'flagged', 'archived');
CREATE TYPE report_target AS ENUM ('script', 'comment', 'user');
CREATE TYPE report_status AS ENUM ('pending', 'resolved', 'dismissed');

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL CHECK (username ~ '^[a-z0-9_]{3,20}$'),
  display_name TEXT CHECK (char_length(display_name) <= 50),
  avatar_url TEXT,
  bio TEXT CHECK (char_length(bio) <= 300),
  role user_role DEFAULT 'user' NOT NULL,
  is_banned BOOLEAN DEFAULT FALSE NOT NULL,
  ban_reason TEXT,
  total_scripts INTEGER DEFAULT 0 NOT NULL,
  total_likes_received INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_role ON public.users(role);

CREATE TABLE public.games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  slug TEXT UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9-]+$'),
  description TEXT CHECK (char_length(description) <= 500),
  thumbnail_url TEXT,
  total_scripts INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX idx_games_slug ON public.games(slug);
CREATE INDEX idx_games_total_scripts ON public.games(total_scripts DESC);

CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  color TEXT DEFAULT '#8c64ff' NOT NULL,
  display_order INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
INSERT INTO public.categories (name, slug, color, display_order) VALUES
  ('Movement', 'movement', '#5ab0ff', 1),
  ('Visual',   'visual',   '#8c64ff', 2),
  ('Combat',   'combat',   '#ff4d4d', 3),
  ('Farming',  'farming',  '#6ec88a', 4),
  ('Utility',  'utility',  '#ffd60a', 5);

CREATE TABLE public.scripts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 3 AND 150),
  slug TEXT UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9-]+$'),
  description TEXT NOT NULL CHECK (char_length(description) BETWEEN 10 AND 1000),
  code TEXT NOT NULL CHECK (char_length(code) BETWEEN 1 AND 100000),
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  game_id UUID REFERENCES public.games(id) ON DELETE SET NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  tags TEXT[] DEFAULT '{}' NOT NULL,
  features TEXT[] DEFAULT '{}' NOT NULL,
  tested_with TEXT[] DEFAULT '{}' NOT NULL,
  is_keyless BOOLEAN DEFAULT FALSE NOT NULL,
  is_mobile_friendly BOOLEAN DEFAULT FALSE NOT NULL,
  status script_status DEFAULT 'published' NOT NULL,
  view_count INTEGER DEFAULT 0 NOT NULL,
  copy_count INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX idx_scripts_slug ON public.scripts(slug);
CREATE INDEX idx_scripts_author ON public.scripts(author_id);
CREATE INDEX idx_scripts_game ON public.scripts(game_id);
CREATE INDEX idx_scripts_category ON public.scripts(category_id);
CREATE INDEX idx_scripts_status ON public.scripts(status);
CREATE INDEX idx_scripts_created ON public.scripts(created_at DESC);
CREATE INDEX idx_scripts_title_lower ON public.scripts(LOWER(title));

CREATE TABLE public.script_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id UUID REFERENCES public.scripts(id) ON DELETE CASCADE NOT NULL,
  viewer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  ip_hash TEXT NOT NULL,
  viewed_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX idx_views_script ON public.script_views(script_id, viewed_at DESC);
CREATE INDEX idx_views_dedup ON public.script_views(script_id, ip_hash, viewed_at DESC);

CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  script_id UUID REFERENCES public.scripts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 2000),
  is_deleted BOOLEAN DEFAULT FALSE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX idx_comments_script ON public.comments(script_id, created_at DESC);
CREATE INDEX idx_comments_parent ON public.comments(parent_id);
CREATE INDEX idx_comments_user ON public.comments(user_id);

CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  target_type report_target NOT NULL,
  target_id UUID NOT NULL,
  reason TEXT NOT NULL CHECK (char_length(reason) BETWEEN 3 AND 200),
  status report_status DEFAULT 'pending' NOT NULL,
  resolved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
CREATE INDEX idx_reports_status ON public.reports(status, created_at DESC);

-- TRIGGERS

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_games_updated BEFORE UPDATE ON public.games
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_scripts_updated BEFORE UPDATE ON public.scripts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trg_comments_updated BEFORE UPDATE ON public.comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', 'user_' || substr(NEW.id::text, 1, 8)),
    COALESCE(NEW.raw_user_meta_data->>'username', 'New User')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.update_script_counters()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'published' THEN
    UPDATE public.users SET total_scripts = total_scripts + 1 WHERE id = NEW.author_id;
    IF NEW.game_id IS NOT NULL THEN
      UPDATE public.games SET total_scripts = total_scripts + 1 WHERE id = NEW.game_id;
    END IF;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'published' THEN
    UPDATE public.users SET total_scripts = GREATEST(total_scripts - 1, 0) WHERE id = OLD.author_id;
    IF OLD.game_id IS NOT NULL THEN
      UPDATE public.games SET total_scripts = GREATEST(total_scripts - 1, 0) WHERE id = OLD.game_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'published' AND NEW.status != 'published' THEN
    UPDATE public.users SET total_scripts = GREATEST(total_scripts - 1, 0) WHERE id = OLD.author_id;
    IF OLD.game_id IS NOT NULL THEN
      UPDATE public.games SET total_scripts = GREATEST(total_scripts - 1, 0) WHERE id = OLD.game_id;
    END IF;
  ELSIF TG_OP = 'UPDATE' AND OLD.status != 'published' AND NEW.status = 'published' THEN
    UPDATE public.users SET total_scripts = total_scripts + 1 WHERE id = NEW.author_id;
    IF NEW.game_id IS NOT NULL THEN
      UPDATE public.games SET total_scripts = total_scripts + 1 WHERE id = NEW.game_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_script_counters
  AFTER INSERT OR UPDATE OR DELETE ON public.scripts
  FOR EACH ROW EXECUTE FUNCTION public.update_script_counters();

CREATE OR REPLACE FUNCTION public.update_view_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.scripts SET view_count = view_count + 1 WHERE id = NEW.script_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_view_count
  AFTER INSERT ON public.script_views
  FOR EACH ROW EXECUTE FUNCTION public.update_view_count();

-- RLS

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.script_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Users: everyone can read, only own can update
CREATE POLICY users_select_all ON public.users FOR SELECT USING (true);
CREATE POLICY users_update_own ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY users_update_mod ON public.users FOR UPDATE
  USING (public.current_user_role() IN ('moderator', 'admin'));

-- Games: everyone can read, mod/admin can modify
CREATE POLICY games_select_all ON public.games FOR SELECT USING (true);
CREATE POLICY games_insert_mod ON public.games FOR INSERT
  WITH CHECK (public.current_user_role() IN ('moderator', 'admin'));
CREATE POLICY games_update_mod ON public.games FOR UPDATE
  USING (public.current_user_role() IN ('moderator', 'admin'));

-- Categories: everyone reads, no writes via RLS (seed only)
CREATE POLICY categories_select_all ON public.categories FOR SELECT USING (true);

-- Scripts: GUESTS CAN READ PUBLISHED. Only author or mod sees non-published.
CREATE POLICY scripts_select ON public.scripts FOR SELECT USING (
  status = 'published'
  OR author_id = auth.uid()
  OR public.current_user_role() IN ('moderator', 'admin')
);
CREATE POLICY scripts_insert_own ON public.scripts FOR INSERT
  WITH CHECK (author_id = auth.uid());
CREATE POLICY scripts_update_own ON public.scripts FOR UPDATE
  USING (author_id = auth.uid());
CREATE POLICY scripts_update_mod ON public.scripts FOR UPDATE
  USING (public.current_user_role() IN ('moderator', 'admin'));
CREATE POLICY scripts_delete_own ON public.scripts FOR DELETE
  USING (author_id = auth.uid() OR public.current_user_role() IN ('moderator', 'admin'));

-- Views: anyone (including guests) can insert, only auth can read
CREATE POLICY views_insert_all ON public.script_views FOR INSERT WITH CHECK (true);
CREATE POLICY views_select_auth ON public.script_views FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Comments: everyone reads (non-deleted), auth can write
CREATE POLICY comments_select_all ON public.comments FOR SELECT
  USING (is_deleted = FALSE);
CREATE POLICY comments_insert_auth ON public.comments FOR INSERT
  WITH CHECK (user_id = auth.uid());
CREATE POLICY comments_update_own ON public.comments FOR UPDATE
  USING (user_id = auth.uid());
CREATE POLICY comments_delete_own_or_mod ON public.comments FOR DELETE
  USING (user_id = auth.uid() OR public.current_user_role() IN ('moderator', 'admin'));

-- Reports: auth can insert, mod can read/update
CREATE POLICY reports_insert_auth ON public.reports FOR INSERT
  WITH CHECK (reporter_id = auth.uid());
CREATE POLICY reports_select_mod ON public.reports FOR SELECT
  USING (public.current_user_role() IN ('moderator', 'admin'));
CREATE POLICY reports_update_mod ON public.reports FOR UPDATE
  USING (public.current_user_role() IN ('moderator', 'admin'));
