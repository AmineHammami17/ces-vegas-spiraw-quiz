import mongoose, { Schema, model, models } from 'mongoose';

export interface IQuizSubmission {
  _id?: string;
  registration_id: mongoose.Types.ObjectId;
  question_number: number;
  answer: string;
  is_correct: boolean;
  time_taken_ms: number;
  points_earned: number;
  submitted_at?: Date;
}

const QuizSubmissionSchema = new Schema<IQuizSubmission>(
  {
    registration_id: {
      type: Schema.Types.ObjectId,
      ref: 'Registration',
      required: true,
    },
    question_number: {
      type: Number,
      required: true,
      min: 1,
      max: 15,
    },
    answer: {
      type: String,
      required: true,
    },
    is_correct: {
      type: Boolean,
      required: true,
    },
    time_taken_ms: {
      type: Number,
      required: true,
      min: 0,
      max: 15000,
    },
    points_earned: {
      type: Number,
      required: true,
      min: 0,
    },
    submitted_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

QuizSubmissionSchema.index({ registration_id: 1 });
QuizSubmissionSchema.index({ question_number: 1 });
QuizSubmissionSchema.index({ registration_id: 1, question_number: 1 }, { unique: true });

export const QuizSubmission =
  models.QuizSubmission || model<IQuizSubmission>('QuizSubmission', QuizSubmissionSchema);


