-- GSU Panther Chatbot - Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create chat_sessions table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id),
  title text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id uuid REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role text CHECK (role IN ('user', 'assistant')),
  message text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_sessions_created_at ON chat_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies to allow all operations (for development)
-- Drop policies if they exist first (PostgreSQL doesn't support IF NOT EXISTS for policies)
DROP POLICY IF EXISTS "Allow all operations on chat_sessions" ON chat_sessions;
DROP POLICY IF EXISTS "Allow all operations on chat_messages" ON chat_messages;

CREATE POLICY "Allow all operations on chat_sessions" ON chat_sessions
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on chat_messages" ON chat_messages
    FOR ALL USING (true) WITH CHECK (true);

-- Insert some sample data for testing
INSERT INTO chat_sessions (title) VALUES
('Welcome to GSU Panther Chatbot!'),
('Course Planning Help'),
('Campus Resources');

-- Insert sample messages
INSERT INTO chat_messages (session_id, role, message) VALUES
((SELECT id FROM chat_sessions WHERE title = 'Welcome to GSU Panther Chatbot!' LIMIT 1), 'assistant', 'Hello! I''m Pounce, your GSU Panther Chatbot. How can I help you today?'),
((SELECT id FROM chat_sessions WHERE title = 'Course Planning Help' LIMIT 1), 'user', 'Help me plan my next semester courses'),
((SELECT id FROM chat_sessions WHERE title = 'Course Planning Help' LIMIT 1), 'assistant', 'I''d be happy to help you plan your courses! What''s your major and what year are you?'),
((SELECT id FROM chat_sessions WHERE title = 'Campus Resources' LIMIT 1), 'user', 'What campus resources are available?'),
((SELECT id FROM chat_sessions WHERE title = 'Campus Resources' LIMIT 1), 'assistant', 'GSU offers many great resources! We have the library, tutoring centers, career services, and more. What specific area are you interested in?');