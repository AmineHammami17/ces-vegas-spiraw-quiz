'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import GameBackground from '@/components/GameBackground';
import QuizQuestion from '@/components/QuizQuestion';
import QuizTimer from '@/components/QuizTimer';
import ProgressIndicator from '@/components/ProgressIndicator';
import LevelIndicator from '@/components/LevelIndicator';
import ScoreDisplay from '@/components/ScoreDisplay';
import PointsPopup from '@/components/PointsPopup';
import GameOverScreen from '@/components/GameOverScreen';
import { QuizQuestion as QuizQuestionType } from '@/types';
import { getRandomQuestions } from '@/lib/questions';
import { useSound } from '@/hooks/useSound';
import SoundSettings from '@/components/SoundSettings';
import { soundManager } from '@/lib/sounds';
import { motion, AnimatePresence } from 'framer-motion';

const TIMER_SECONDS = 15;
const QUESTIONS_PER_GAME = 15;

export default function QuizPage() {
  const router = useRouter();
  useSound();
  
  const [questions] = useState<QuizQuestionType[]>(() => getRandomQuestions(QUESTIONS_PER_GAME));
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeStarted, setTimeStarted] = useState<number>(Date.now());
  const [score, setScore] = useState(0);
  const [showPointsPopup, setShowPointsPopup] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [totalTime, setTotalTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  useEffect(() => {
    const timer = setTimeout(() => {
      soundManager.playQuizStart();
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setTimeStarted(Date.now());
    setSelectedAnswer(null);
    setShowResult(false);
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (answer: string) => {
    if (showResult || isSubmitting) return;
    setSelectedAnswer(answer);
    submitAnswer(answer);
  };

  const submitAnswer = async (answer: string | null = selectedAnswer) => {
    if (!answer || isSubmitting) return;

    setIsSubmitting(true);
    const timeTaken = Date.now() - timeStarted;

    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question_number: currentQuestion.id,
          original_question_id: currentQuestion.originalId || currentQuestion.id,
          answer: answer,
          time_taken_ms: timeTaken,
        }),
      });

      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      if (!response.ok) {
        if (isJson) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to submit answer');
        } else {
          throw new Error(`Failed to submit: ${response.status} ${response.statusText}`);
        }
      }

      if (!isJson) {
        throw new Error('Invalid response format');
      }

      const data = await response.json();

      if (data.success) {
        setScore((prev) => prev + data.points_earned);
        setPointsEarned(data.points_earned);
        setIsCorrect(data.is_correct);
        setShowResult(true);
        setShowPointsPopup(true);
        setTotalTime((prev) => prev + timeTaken);

        setTimeout(() => {
          setShowPointsPopup(false);
          if (isLastQuestion) {
            setGameOver(true);
          } else {
            setCurrentQuestionIndex((prev) => prev + 1);
          }
          setIsSubmitting(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
      setIsSubmitting(false);
    }
  };

  const handleTimerExpire = () => {
    if (!showResult && !isSubmitting) {
      submitAnswer(selectedAnswer || null);
    }
  };

  const handleViewLeaderboard = () => {
    router.push('/leaderboard');
  };

  if (gameOver) {
    return (
      <GameBackground>
        <GameOverScreen
          finalScore={score}
          totalTime={totalTime}
          onViewLeaderboard={handleViewLeaderboard}
        />
      </GameBackground>
    );
  }

  return (
    <GameBackground>
      <SoundSettings />
      <motion.div
        className="min-h-screen p-4 md:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <LevelIndicator
              currentLevel={currentQuestionIndex + 1}
              totalLevels={questions.length}
            />
            <ScoreDisplay score={score} />
          </motion.div>

          <motion.div
            className="mb-6"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ProgressIndicator
              current={currentQuestionIndex + 1}
              total={questions.length}
            />
          </motion.div>

          <motion.div
            className="flex justify-center mb-6"
            key={`timer-${currentQuestionIndex}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <QuizTimer 
              key={currentQuestionIndex} 
              seconds={TIMER_SECONDS} 
              onExpire={handleTimerExpire} 
            />
          </motion.div>

          <AnimatePresence mode="wait">
            <motion.div
              className="mb-6"
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -30, scale: 0.95 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <QuizQuestion
                question={currentQuestion}
                selectedAnswer={selectedAnswer}
                onAnswerSelect={handleAnswerSelect}
                showResult={showResult}
                correctAnswer={currentQuestion.correctAnswer}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          </AnimatePresence>

          {showPointsPopup && (
            <PointsPopup
              points={pointsEarned}
              isCorrect={isCorrect}
              onComplete={() => setShowPointsPopup(false)}
            />
          )}
        </div>
      </motion.div>
    </GameBackground>
  );
}

