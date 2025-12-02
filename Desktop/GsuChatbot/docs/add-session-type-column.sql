-- Add session_type column to chat_sessions table
-- This allows us to distinguish voice conversations from regular chat sessions

-- Add the session_type column with a default value of 'chat'
ALTER TABLE chat_sessions 
ADD COLUMN IF NOT EXISTS session_type text DEFAULT 'chat' CHECK (session_type IN ('chat', 'voice'));

-- Update existing sessions to have 'chat' type (if they don't have one)
UPDATE chat_sessions 
SET session_type = 'chat' 
WHERE session_type IS NULL;

-- Create an index for filtering by session type
CREATE INDEX IF NOT EXISTS idx_chat_sessions_session_type ON chat_sessions(session_type);

