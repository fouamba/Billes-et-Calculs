-- Initial Supabase schema generated from Prisma model and migration plan
-- This migration aligns the data layer with the updated cahier des charges.
-- Execute via Supabase CLI or SQL editor once Supabase project is linked.

-- Enable uuid extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core tables
CREATE TABLE IF NOT EXISTS student_profiles (
  id UUID PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  class_id UUID,
  adaptive_level INTEGER DEFAULT 1 CHECK (adaptive_level BETWEEN 1 AND 3),
  current_max_value INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  teacher_id UUID,
  school_year TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS game_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  level INTEGER NOT NULL CHECK (level BETWEEN 1 AND 3),
  module INTEGER DEFAULT 1,
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  score INTEGER DEFAULT 0,
  problems_attempted INTEGER DEFAULT 0,
  problems_correct INTEGER DEFAULT 0,
  badge_earned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS problems_attempted (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES game_sessions(id) ON DELETE CASCADE,
  problem_number INTEGER NOT NULL,
  problem_type TEXT NOT NULL CHECK (problem_type IN ('composition', 'decomposition')),
  total_value INTEGER NOT NULL,
  part1_value INTEGER NOT NULL,
  part2_value INTEGER NOT NULL,
  unknown_position TEXT NOT NULL CHECK (unknown_position IN ('total', 'part1', 'part2')),
  user_answer INTEGER,
  expected_answer INTEGER NOT NULL,
  is_correct BOOLEAN,
  attempts INTEGER DEFAULT 1,
  duration_ms INTEGER,
  hints_requested INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  icon_url TEXT,
  criteria JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_badges (
  user_id UUID NOT NULL,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

CREATE TABLE IF NOT EXISTS strategies_detected (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  problem_id UUID NOT NULL REFERENCES problems_attempted(id) ON DELETE CASCADE,
  strategy_type TEXT NOT NULL,
  confidence NUMERIC(3,2) DEFAULT 0.50,
  detected_at TIMESTAMPTZ DEFAULT NOW()
);

-- Relationships to auth schema (assumes Supabase auth.users)
ALTER TABLE student_profiles
  ADD CONSTRAINT student_profiles_user_fk
  FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE classes
  ADD CONSTRAINT classes_teacher_fk
  FOREIGN KEY (teacher_id) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE game_sessions
  ADD CONSTRAINT game_sessions_user_fk
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE user_badges
  ADD CONSTRAINT user_badges_user_fk
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user ON game_sessions(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_problems_session ON problems_attempted(session_id, problem_number);
CREATE INDEX IF NOT EXISTS idx_student_profiles_class ON student_profiles(class_id);

-- Row Level Security (RLS)
ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems_attempted ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Policies for students
CREATE POLICY IF NOT EXISTS "Students view own profile"
  ON student_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY IF NOT EXISTS "Students view own sessions"
  ON game_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Students insert own sessions"
  ON game_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Students view own problems"
  ON problems_attempted FOR SELECT
  USING (
    session_id IN (
      SELECT id FROM game_sessions WHERE user_id = auth.uid()
    )
  );

-- Policies for teachers
CREATE POLICY IF NOT EXISTS "Teachers view their students"
  ON student_profiles FOR SELECT
  USING (
    class_id IN (
      SELECT id FROM classes WHERE teacher_id = auth.uid()
    )
  );

CREATE POLICY IF NOT EXISTS "Teachers view their classes sessions"
  ON game_sessions FOR SELECT
  USING (
    user_id IN (
      SELECT id FROM student_profiles 
      WHERE class_id IN (
        SELECT id FROM classes WHERE teacher_id = auth.uid()
      )
    )
  );

-- Trigger to maintain updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_student_profiles_updated_at ON student_profiles;
CREATE TRIGGER update_student_profiles_updated_at
  BEFORE UPDATE ON student_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
