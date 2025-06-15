
-- Create user_signups table to track signup information
CREATE TABLE public.user_signups (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  signup_method TEXT NOT NULL CHECK (signup_method IN ('email', 'google')),
  signup_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create entries_history table to store user entry history
CREATE TABLE public.entries_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  entry_type TEXT NOT NULL,
  entry_data JSONB,
  entry_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on both tables
ALTER TABLE public.user_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entries_history ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_signups table
CREATE POLICY "Users can view their own signup data" 
  ON public.user_signups 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own signup data" 
  ON public.user_signups 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own signup data" 
  ON public.user_signups 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- RLS policies for entries_history table
CREATE POLICY "Users can view their own entries" 
  ON public.entries_history 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own entries" 
  ON public.entries_history 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own entries" 
  ON public.entries_history 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own entries" 
  ON public.entries_history 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_signups_user_id ON public.user_signups(user_id);
CREATE INDEX idx_entries_history_user_id ON public.entries_history(user_id);
CREATE INDEX idx_entries_history_created_at ON public.entries_history(created_at DESC);
CREATE INDEX idx_entries_history_entry_type ON public.entries_history(entry_type);
