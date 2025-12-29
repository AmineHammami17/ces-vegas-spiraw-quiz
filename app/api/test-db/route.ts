import { NextResponse } from 'next/server';
import connectDB, { Registration, QuizSubmission } from '@/lib/db';

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'MONGODB_URI not configured',
          details: 'Please set MONGODB_URI in .env.local',
        },
        { status: 500 }
      );
    }

    await connectDB();

    const registrationCount = await Registration.countDocuments();
    const submissionCount = await QuizSubmission.countDocuments();

    return NextResponse.json({
      status: 'success',
      message: 'MongoDB connection successful!',
      details: {
        connection: 'Connected',
        registrations: registrationCount,
        submissions: submissionCount,
        mongodb_uri_set: !!process.env.MONGODB_URI,
        mongodb_uri_preview: process.env.MONGODB_URI.substring(0, 30) + '...',
      },
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: 'MongoDB connection failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        error_type: error instanceof Error ? error.name : 'Unknown',
      },
      { status: 500 }
    );
  }
}

