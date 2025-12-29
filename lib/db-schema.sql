-- Database schema for CES Quiz Website
-- Run this SQL in your PostgreSQL database

-- Create registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT NOT NULL UNIQUE
);

-- Create quiz_submissions table
CREATE TABLE IF NOT EXISTS quiz_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  question_number INTEGER NOT NULL CHECK (question_number >= 1 AND question_number <= 15),
  answer TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  time_taken_ms INTEGER NOT NULL CHECK (time_taken_ms >= 0 AND time_taken_ms <= 15000),
  points_earned INTEGER NOT NULL CHECK (points_earned >= 0),
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(registration_id, question_number)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_session_id ON registrations(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_registration_id ON quiz_submissions(registration_id);
CREATE INDEX IF NOT EXISTS idx_quiz_submissions_question_number ON quiz_submissions(question_number);

-- Create a view for scores (computed from quiz_submissions)
CREATE OR REPLACE VIEW scores AS
SELECT 
  r.id AS registration_id,
  r.name,
  r.email,
  COALESCE(SUM(qs.points_earned), 0) AS total_score,
  COALESCE(SUM(qs.time_taken_ms), 0) AS total_time_ms,
  MAX(qs.submitted_at) AS completed_at
FROM registrations r
LEFT JOIN quiz_submissions qs ON r.id = qs.registration_id
GROUP BY r.id, r.name, r.email;

-- Create index on scores view (via materialized view if needed)
-- For better performance, you might want to create a materialized view:
-- CREATE MATERIALIZED VIEW scores_materialized AS SELECT * FROM scores;
-- CREATE INDEX idx_scores_total_score ON scores_materialized(total_score DESC, total_time_ms ASC);
-- Refresh periodically: REFRESH MATERIALIZED VIEW scores_materialized;

