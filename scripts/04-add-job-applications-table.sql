-- Create job applications table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  position TEXT NOT NULL,
  cover_letter TEXT NOT NULL,
  cv_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON job_applications(created_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Allow anyone to submit applications
CREATE POLICY "Anyone can submit job applications" ON job_applications
  FOR INSERT WITH CHECK (true);

-- RLS Policy: Only admins can view applications (handled by service role)
