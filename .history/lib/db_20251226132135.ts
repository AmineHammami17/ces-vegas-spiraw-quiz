import postgres from 'postgres';

// Get database URL from environment variables
const databaseUrl = process.env.DATABASE_URL || '';

if (!databaseUrl) {
  console.warn('DATABASE_URL not configured. Database operations will fail.');
}

// Create PostgreSQL client
// Using connection pooling for serverless environments
export const sql = postgres(databaseUrl, {
  max: process.env.NODE_ENV === 'production' ? 1 : 10, // Serverless: 1 connection per function, local: 10
  idle_timeout: 20, // Close idle connections after 20 seconds
  connect_timeout: 10, // Connection timeout in seconds
  ssl: process.env.NODE_ENV === 'production' ? 'require' : undefined, // Force SSL in production
  transform: {
    // Convert snake_case to camelCase if needed
    undefined: null,
  },
});

// Database schema types (same as before)
export interface Database {
  public: {
    Tables: {
      registrations: {
        Row: {
          id: string;
          name: string;
          email: string;
          created_at: string;
          session_id: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          created_at?: string;
          session_id: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          created_at?: string;
          session_id?: string;
        };
      };
      quiz_submissions: {
        Row: {
          id: string;
          registration_id: string;
          question_number: number;
          answer: string;
          is_correct: boolean;
          time_taken_ms: number;
          points_earned: number;
          submitted_at: string;
        };
        Insert: {
          id?: string;
          registration_id: string;
          question_number: number;
          answer: string;
          is_correct: boolean;
          time_taken_ms: number;
          points_earned: number;
          submitted_at?: string;
        };
        Update: {
          id?: string;
          registration_id?: string;
          question_number?: number;
          answer?: string;
          is_correct?: boolean;
          time_taken_ms?: number;
          points_earned?: number;
          submitted_at?: string;
        };
      };
    };
  };
}
