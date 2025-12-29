export interface Registration {
  id: string;
  name: string;
  email: string;
  created_at: Date;
  session_id: string;
}

export interface QuizQuestion {
  id: number; // Display ID (1-15 for current game)
  originalId?: number; // Original ID from pool (1-50) for validation
  question: string;
  options: string[];
  correctAnswer: string;
}

export interface QuizSubmission {
  id: string;
  registration_id: string;
  question_number: number;
  answer: string;
  is_correct: boolean;
  time_taken_ms: number;
  points_earned: number;
  submitted_at: Date;
}

export interface Score {
  registration_id: string;
  name: string;
  email: string;
  total_score: number;
  total_time_ms: number;
  completed_at: Date;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  time: number;
  registration_id: string;
}

