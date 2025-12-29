import { NextRequest, NextResponse } from 'next/server';
import { quizSubmissionSchema } from '@/lib/validation';
import { calculatePoints, isValidTiming } from '@/lib/scoring';
import connectDB, { Registration, QuizSubmission } from '@/lib/db';
import { cookies } from 'next/headers';
import { ALL_QUIZ_QUESTIONS } from '@/lib/questions';
import mongoose from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI not configured');
      return NextResponse.json(
        { error: 'Database not configured. Please set up MONGODB_URI.' },
        { status: 500 }
      );
    }

    await connectDB();

    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session not found. Please register first.' },
        { status: 401 }
      );
    }

    const registration = await Registration.findOne({ session_id: sessionId });

    if (!registration) {
      return NextResponse.json(
        { error: 'Invalid session' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = quizSubmissionSchema.parse(body);

    if (!isValidTiming(validatedData.time_taken_ms)) {
      return NextResponse.json(
        { error: 'Invalid timing data' },
        { status: 400 }
      );
    }

    const questionId = validatedData.original_question_id || validatedData.question_number;
    
    if (!questionId || questionId < 1 || questionId > 50) {
      console.error('Invalid question ID:', questionId);
      return NextResponse.json(
        { error: 'Invalid question number', details: `Question ID ${questionId} is out of range` },
        { status: 400 }
      );
    }

    const question = ALL_QUIZ_QUESTIONS.find(
      (q) => q.id === questionId
    );

    if (!question) {
      console.error('Question not found:', questionId);
      return NextResponse.json(
        { error: 'Invalid question number', details: `Question with ID ${questionId} not found` },
        { status: 400 }
      );
    }

    const registrationId = registration._id;

    const existing = await QuizSubmission.findOne({
      registration_id: registrationId,
      question_number: validatedData.question_number,
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Answer already submitted for this question' },
        { status: 400 }
      );
    }

    const isCorrect = question.correctAnswer === validatedData.answer;

    const pointsEarned = calculatePoints(isCorrect, validatedData.time_taken_ms);

    try {
      await QuizSubmission.create({
        registration_id: registrationId,
        question_number: validatedData.question_number,
        answer: validatedData.answer,
        is_correct: isCorrect,
        time_taken_ms: validatedData.time_taken_ms,
        points_earned: pointsEarned,
      });
    } catch (dbError) {
      console.error('Database insert error:', dbError);
      return NextResponse.json(
        { 
          error: 'Failed to submit answer',
          details: dbError instanceof Error ? dbError.message : 'Database error occurred'
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      is_correct: isCorrect,
      points_earned: pointsEarned,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      console.error('Validation error:', error);
      return NextResponse.json(
        { error: 'Invalid input data', details: error.message },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message.includes('MongoServerError')) {
      console.error('MongoDB server error:', error);
      return NextResponse.json(
        { 
          error: 'Database connection error',
          details: 'Unable to connect to database. Please check your MongoDB connection.'
        },
        { status: 500 }
      );
    }

    if (error instanceof Error && error.name === 'MongooseError') {
      console.error('Mongoose error:', error);
      return NextResponse.json(
        { 
          error: 'Database error',
          details: error.message
        },
        { status: 500 }
      );
    }

    console.error('Submission error:', error);
    return NextResponse.json(
      { 
        error: 'An error occurred during submission',
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.name : 'Unknown'
      },
      { status: 500 }
    );
  }
}

