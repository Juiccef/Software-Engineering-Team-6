-- Schedule Planning Pipeline - Database Schema
-- Run this in your Supabase SQL Editor

-- Create transcripts table
CREATE TABLE IF NOT EXISTS transcripts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_url text NOT NULL,
  extracted_text text,
  major text,
  workload_preference text CHECK (workload_preference IN ('light', 'medium', 'heavy')),
  credit_range text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_transcripts_session_id ON transcripts(session_id);

-- Add pipeline_state column to chat_sessions table
ALTER TABLE chat_sessions ADD COLUMN IF NOT EXISTS pipeline_state jsonb;

-- Enable Row Level Security (RLS) for transcripts
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;

-- Drop policy if it exists, then create it (PostgreSQL doesn't support IF NOT EXISTS for policies)
DROP POLICY IF EXISTS "Allow all operations on transcripts" ON transcripts;

-- Create policy to allow all operations (for development)
CREATE POLICY "Allow all operations on transcripts" ON transcripts
    FOR ALL USING (true) WITH CHECK (true);

