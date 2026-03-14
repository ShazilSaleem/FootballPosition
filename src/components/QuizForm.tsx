'use client';

import { useMemo, useState } from 'react';
import { QUESTIONS } from '@/data/questions';
import { ProgressBar } from '@/components/ProgressBar';
import type { AnswerMap } from '@/lib/scoring/calculateResult';
import { trackEvent } from '@/lib/analytics/analytics';

type QuizFormProps = {
  onComplete: (answers: AnswerMap) => void;
  onBackHome: () => void;
};

export function QuizForm({ onComplete, onBackHome }: QuizFormProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<AnswerMap>({});

  const currentQuestion = QUESTIONS[currentIndex];
  const progress = useMemo(() => ((currentIndex + 1) / QUESTIONS.length) * 100, [currentIndex]);

  function handleSelect(optionId: string) {
    const nextAnswers = { ...answers, [currentQuestion.id]: optionId };
    setAnswers(nextAnswers);
    trackEvent('question_answered', {
      questionId: currentQuestion.id,
      optionId,
      questionIndex: currentIndex + 1,
    });

    if (currentIndex === QUESTIONS.length - 1) {
      onComplete(nextAnswers);
      return;
    }

    setCurrentIndex((prev) => prev + 1);
  }

  function handleBack() {
    if (currentIndex === 0) {
      onBackHome();
      return;
    }

    setCurrentIndex((prev) => prev - 1);
  }

  return (
    <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm text-zinc-400">
          <span>Question {currentIndex + 1} of {QUESTIONS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <h2 className="text-2xl font-semibold text-white md:text-3xl">{currentQuestion.title}</h2>

      <div className="mt-6 grid gap-3">
        {currentQuestion.options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => handleSelect(option.id)}
            className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-4 text-left text-zinc-100 transition hover:border-zinc-500 hover:bg-zinc-900"
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <button type="button" onClick={handleBack} className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-300">
          {currentIndex === 0 ? 'Back to home' : 'Back'}
        </button>
        <p className="text-right text-sm text-zinc-500">Choose the option that feels most natural to you.</p>
      </div>
    </div>
  );
}
