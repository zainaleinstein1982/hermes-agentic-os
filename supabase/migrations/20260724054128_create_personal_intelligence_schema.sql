/*
# Personal Intelligence — Core Schema

1. New Tables
   - `memories`      — stored facts, preferences, notes the assistant has learned
   - `conversations` — chat sessions with Ash
   - `messages`      — individual messages in a conversation
   - `integrations`  — connected data sources (Gmail, Calendar, Notion, etc.)
   - `skills`        — assistant capabilities/plugins

2. Security
   - RLS enabled on all tables
   - All policies use TO anon, authenticated (no sign-in required)
*/

-- MEMORIES
CREATE TABLE IF NOT EXISTS memories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content     text NOT NULL,
  category    text NOT NULL DEFAULT 'general',
  tags        text[] DEFAULT '{}',
  importance  int NOT NULL DEFAULT 3 CHECK (importance BETWEEN 1 AND 5),
  source      text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_memories" ON memories;
CREATE POLICY "anon_select_memories" ON memories FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_memories" ON memories;
CREATE POLICY "anon_insert_memories" ON memories FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_memories" ON memories;
CREATE POLICY "anon_update_memories" ON memories FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_memories" ON memories;
CREATE POLICY "anon_delete_memories" ON memories FOR DELETE TO anon, authenticated USING (true);

-- CONVERSATIONS
CREATE TABLE IF NOT EXISTS conversations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL DEFAULT 'New conversation',
  summary     text,
  created_at  timestamptz DEFAULT now(),
  updated_at  timestamptz DEFAULT now()
);
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_convs" ON conversations;
CREATE POLICY "anon_select_convs" ON conversations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_convs" ON conversations;
CREATE POLICY "anon_insert_convs" ON conversations FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_convs" ON conversations;
CREATE POLICY "anon_update_convs" ON conversations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_convs" ON conversations;
CREATE POLICY "anon_delete_convs" ON conversations FOR DELETE TO anon, authenticated USING (true);

-- MESSAGES
CREATE TABLE IF NOT EXISTS messages (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role            text NOT NULL CHECK (role IN ('user','assistant')),
  content         text NOT NULL,
  created_at      timestamptz DEFAULT now()
);
CREATE INDEX IF NOT EXISTS messages_conversation_id_idx ON messages(conversation_id);
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_messages" ON messages;
CREATE POLICY "anon_select_messages" ON messages FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_messages" ON messages;
CREATE POLICY "anon_insert_messages" ON messages FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_messages" ON messages;
CREATE POLICY "anon_delete_messages" ON messages FOR DELETE TO anon, authenticated USING (true);

-- INTEGRATIONS
CREATE TABLE IF NOT EXISTS integrations (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  type        text NOT NULL,
  icon        text NOT NULL DEFAULT '🔌',
  connected   boolean NOT NULL DEFAULT false,
  status      text NOT NULL DEFAULT 'disconnected',
  last_sync   timestamptz,
  config      jsonb DEFAULT '{}',
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_integrations" ON integrations;
CREATE POLICY "anon_select_integrations" ON integrations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_integrations" ON integrations;
CREATE POLICY "anon_insert_integrations" ON integrations FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_integrations" ON integrations;
CREATE POLICY "anon_update_integrations" ON integrations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_integrations" ON integrations;
CREATE POLICY "anon_delete_integrations" ON integrations FOR DELETE TO anon, authenticated USING (true);

-- SKILLS
CREATE TABLE IF NOT EXISTS skills (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text,
  category    text NOT NULL DEFAULT 'productivity',
  enabled     boolean NOT NULL DEFAULT false,
  icon        text NOT NULL DEFAULT '⚡',
  created_at  timestamptz DEFAULT now()
);
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "anon_select_skills" ON skills;
CREATE POLICY "anon_select_skills" ON skills FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_skills" ON skills;
CREATE POLICY "anon_insert_skills" ON skills FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_skills" ON skills;
CREATE POLICY "anon_update_skills" ON skills FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- Seed integrations
INSERT INTO integrations (name, type, icon, connected, status) VALUES
  ('Gmail', 'email', 'gmail', false, 'disconnected'),
  ('Google Calendar', 'calendar', 'calendar', false, 'disconnected'),
  ('Notion', 'notes', 'notion', false, 'disconnected'),
  ('Slack', 'messaging', 'slack', false, 'disconnected'),
  ('GitHub', 'developer', 'github', false, 'disconnected'),
  ('Linear', 'project', 'linear', false, 'disconnected'),
  ('Spotify', 'media', 'spotify', false, 'disconnected'),
  ('Dropbox', 'storage', 'dropbox', false, 'disconnected')
ON CONFLICT DO NOTHING;

-- Seed skills
INSERT INTO skills (name, description, category, enabled, icon) VALUES
  ('Email Triage', 'Scan inbox, flag important items, draft replies', 'email', false, '📧'),
  ('Daily Briefing', 'Morning summary of calendar, tasks, and news', 'productivity', false, '☀️'),
  ('Meeting Prep', 'Research attendees and prep talking points', 'calendar', false, '📅'),
  ('Task Delegation', 'Break down tasks and assign to the right tools', 'productivity', false, '✅'),
  ('Research Assistant', 'Deep-dive research on any topic', 'research', true, '🔍'),
  ('Writing Coach', 'Improve tone, clarity, and grammar', 'writing', true, '✍️'),
  ('Code Review', 'Review, refactor, and explain code', 'developer', false, '💻'),
  ('Travel Planner', 'Book flights, hotels, and itineraries', 'travel', false, '✈️')
ON CONFLICT DO NOTHING;

-- Seed memories
INSERT INTO memories (content, category, tags, importance, source) VALUES
  ('Prefers concise bullet-point summaries over paragraphs', 'preference', ARRAY['communication','style'], 5, 'chat'),
  ('Works best in early morning hours (6am–10am)', 'schedule', ARRAY['work','routine'], 4, 'calendar'),
  ('Dislikes jargon; prefers plain, direct language', 'preference', ARRAY['communication'], 4, 'chat'),
  ('Currently learning Rust for systems programming', 'learning', ARRAY['programming','rust'], 3, 'chat'),
  ('Vegetarian; allergic to shellfish', 'personal', ARRAY['food','health'], 5, 'profile'),
  ('Prefers dark mode in all apps', 'preference', ARRAY['ui','design'], 3, 'profile'),
  ('Runs 5km three times a week', 'health', ARRAY['fitness','routine'], 3, 'chat'),
  ('Main project: building a personal AI assistant', 'work', ARRAY['project','ai'], 5, 'chat')
ON CONFLICT DO NOTHING;
