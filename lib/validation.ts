import { z } from 'zod';

export const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
});

export const quizSubmissionSchema = z.object({
  question_number: z.number().int().min(1).max(15),
  original_question_id: z.number().int().min(1).max(50).optional(), // Original question ID from pool
  answer: z.string().min(1, 'Answer is required'),
  time_taken_ms: z.number().int().min(0).max(15000),
});

export type RegistrationFormData = z.infer<typeof registrationSchema>;
export type QuizSubmissionData = z.infer<typeof quizSubmissionSchema>;

