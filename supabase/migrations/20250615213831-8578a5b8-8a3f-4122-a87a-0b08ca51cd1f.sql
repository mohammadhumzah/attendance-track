
-- Add subject column to entries_history table
ALTER TABLE public.entries_history 
ADD COLUMN subject TEXT;

-- Update existing records to have a default subject
UPDATE public.entries_history 
SET subject = 'General' 
WHERE subject IS NULL;

-- Make subject required for new entries
ALTER TABLE public.entries_history 
ALTER COLUMN subject SET NOT NULL;

-- Add index for better performance when filtering by subject
CREATE INDEX idx_entries_history_subject ON public.entries_history(subject);
