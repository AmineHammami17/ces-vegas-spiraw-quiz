'use client';

import { QuizQuestion as QuizQuestionType } from '@/types';
import Card from './ui/Card';
import AnswerButton from './AnswerButton';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizQuestionProps {
  question: QuizQuestionType;
  selectedAnswer: string | null;
  onAnswerSelect: (answer: string) => void;
  showResult?: boolean;
  correctAnswer?: string;
  isSubmitting?: boolean;
}

export default function QuizQuestion({
  question,
  selectedAnswer,
  onAnswerSelect,
  showResult = false,
  correctAnswer,
  isSubmitting = false,
}: QuizQuestionProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <motion.h2
        className="text-2xl font-bold text-white mb-6 leading-tight"
        key={question.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        {question.question}
      </motion.h2>
      <div className="space-y-3">
        <AnimatePresence mode="wait">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = showResult && option === correctAnswer;
            const isWrong = showResult && isSelected && option !== correctAnswer;

            return (
              <motion.div
                key={`${question.id}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.05,
                  ease: 'easeOut',
                }}
              >
                <AnswerButton
                  onClick={() => !showResult && !isSubmitting && onAnswerSelect(option)}
                  isSelected={isSelected}
                  isCorrect={isCorrect}
                  isWrong={isWrong}
                  disabled={showResult || isSubmitting}
                >
                  {option}
                </AnswerButton>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Card>
  );
}

