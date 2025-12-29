import { NextRequest, NextResponse } from 'next/server';
import connectDB, { Registration, QuizSubmission } from '@/lib/db';
import { cookies } from 'next/headers';

let cache: {
  data: any;
  timestamp: number;
} | null = null;

const CACHE_DURATION = 1000; // 1 second

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const now = Date.now();
    if (cache && now - cache.timestamp < CACHE_DURATION) {
      return NextResponse.json({
        leaderboard: cache.data.slice(0, limit),
      });
    }

    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;
    let currentUserId: string | null = null;

    if (sessionId) {
      const registration = await Registration.findOne({ session_id: sessionId });
      currentUserId = registration?._id.toString() || null;
    }

    const scores = await QuizSubmission.aggregate([
      {
        $group: {
          _id: '$registration_id',
          total_score: { $sum: '$points_earned' },
          total_time_ms: { $sum: '$time_taken_ms' },
          completed_at: { $max: '$submitted_at' },
        },
      },
      {
        $match: {
          total_score: { $gt: 0 },
        },
      },
      {
        $lookup: {
          from: 'registrations',
          localField: '_id',
          foreignField: '_id',
          as: 'registration',
        },
      },
      {
        $unwind: '$registration',
      },
      {
        $project: {
          registration_id: '$_id',
          name: '$registration.name',
          email: '$registration.email',
          total_score: 1,
          total_time_ms: 1,
          completed_at: 1,
        },
      },
      {
        $sort: {
          total_score: -1,
          total_time_ms: 1,
        },
      },
      {
        $limit: limit,
      },
    ]);

    const leaderboard = scores.map((score, index) => ({
      rank: index + 1,
      name: score.name,
      score: score.total_score,
      time: score.total_time_ms,
      registration_id: score.registration_id.toString(),
    }));

    cache = {
      data: leaderboard,
      timestamp: now,
    };

    return NextResponse.json({
      leaderboard,
      current_user_id: currentUserId,
    });
  } catch (error) {
    console.error('Leaderboard error:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching leaderboard' },
      { status: 500 }
    );
  }
}

