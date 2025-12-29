import { NextResponse } from 'next/server';
import { QUIZ_QUESTIONS } from '@/lib/questions';

export async function GET() {
  return NextResponse.json({
    questions: QUIZ_QUESTIONS,
  });
}

