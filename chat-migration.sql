-- Chat Sessions Table
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  subtitle TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI System Prompts Table
CREATE TABLE IF NOT EXISTS ai_system_prompts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  template TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chat Session Settings Table
CREATE TABLE IF NOT EXISTS chat_session_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chat_session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  system_prompt_name TEXT DEFAULT 'buzzberry_default',
  max_tokens INTEGER DEFAULT 1000,
  temperature REAL DEFAULT 0.7,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_is_active ON chat_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(chat_session_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);

-- Enable Row Level Security
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_system_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_session_settings ENABLE ROW LEVEL SECURITY;

-- Chat Sessions Policies
CREATE POLICY "Users can view own chat sessions" ON chat_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat sessions" ON chat_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat sessions" ON chat_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat sessions" ON chat_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Chat Messages Policies
CREATE POLICY "Users can view messages in own sessions" ON chat_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_messages.chat_session_id 
      AND chat_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages in own sessions" ON chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_messages.chat_session_id 
      AND chat_sessions.user_id = auth.uid()
    )
  );

-- AI System Prompts Policies (read-only for all authenticated users)
CREATE POLICY "Authenticated users can view system prompts" ON ai_system_prompts
  FOR SELECT USING (auth.role() = 'authenticated');

-- Chat Session Settings Policies
CREATE POLICY "Users can view settings for own sessions" ON chat_session_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_session_settings.chat_session_id 
      AND chat_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert settings for own sessions" ON chat_session_settings
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_session_settings.chat_session_id 
      AND chat_sessions.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update settings for own sessions" ON chat_session_settings
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM chat_sessions 
      WHERE chat_sessions.id = chat_session_settings.chat_session_id 
      AND chat_sessions.user_id = auth.uid()
    )
  );

-- Insert default system prompts
INSERT INTO ai_system_prompts (name, description, template) VALUES
('buzzberry_default', 'Default Buzzberry AI assistant for influencer marketing and creator discovery', 'You are Buzzberry AI, an expert in influencer marketing and creator discovery.'),
('buzzberry_analyst', 'Analytical Buzzberry AI focused on data insights and metrics', 'You are Buzzberry AI in analytical mode. Focus on providing detailed data insights, metrics analysis, and performance comparisons.'),
('buzzberry_creative', 'Creative Buzzberry AI focused on campaign ideas and creative strategies', 'You are Buzzberry AI in creative mode. Focus on innovative campaign ideas, creative strategies, and out-of-the-box thinking for influencer marketing.')
ON CONFLICT (name) DO NOTHING;

-- Create triggers for updated_at
CREATE TRIGGER update_chat_sessions_updated_at 
  BEFORE UPDATE ON chat_sessions 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_system_prompts_updated_at 
  BEFORE UPDATE ON ai_system_prompts 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_session_settings_updated_at 
  BEFORE UPDATE ON chat_session_settings 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column(); 