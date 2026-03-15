'use client';

import { useEffect, useState } from 'react';
import type { FeedbackRating } from '@/lib/storage/results';

type ResultsFeedbackSectionProps = {
  initialRating?: FeedbackRating | null;
  initialText?: string | null;
  onSubmit: (payload: { feedbackRating: FeedbackRating; feedbackText: string | null }) => Promise<void> | void;
  onViewed: () => void;
  onRatingSelected: (rating: FeedbackRating) => void;
  isSubmitting?: boolean;
};

const FEEDBACK_OPTIONS: Array<{ value: FeedbackRating; label: string; blurb: string }> = [
  { value: 'yes', label: 'Yes', blurb: 'This feels like a strong fit for how I actually play.' },
  { value: 'somewhat', label: 'Somewhat', blurb: 'Parts of this fit, but some details are off.' },
  { value: 'no', label: 'No', blurb: 'This misses my natural style or strongest role.' },
];

export function ResultsFeedbackSection({
  initialRating = null,
  initialText = null,
  onSubmit,
  onViewed,
  onRatingSelected,
  isSubmitting = false,
}: ResultsFeedbackSectionProps) {
  const [feedbackRating, setFeedbackRating] = useState<FeedbackRating | null>(initialRating);
  const [feedbackText, setFeedbackText] = useState(initialText ?? '');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    onViewed();
  }, []);

  useEffect(() => {
    setFeedbackRating(initialRating);
    setFeedbackText(initialText ?? '');
    setStatusMessage(null);
  }, [initialRating, initialText]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!feedbackRating) {
      setStatusMessage('Choose a rating before submitting feedback.');
      return;
    }

    await onSubmit({
      feedbackRating,
      feedbackText: feedbackText.trim() || null,
    });

    setStatusMessage('Thanks. Your feedback has been saved.');
  }

  return (
    <section className="mt-6 rounded-[2rem] border border-zinc-800 bg-zinc-900 p-6">
      <div className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">Feedback</p>
        <h2 className="text-2xl font-semibold text-white">Was this result accurate?</h2>
        <p className="text-sm leading-7 text-zinc-400">
          Your response helps improve the assessment experience for future players.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-6">
        <div className="grid gap-3 md:grid-cols-3">
          {FEEDBACK_OPTIONS.map((option) => {
            const isActive = feedbackRating === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setFeedbackRating(option.value);
                  onRatingSelected(option.value);
                  setStatusMessage(null);
                }}
                className={`rounded-3xl border px-4 py-4 text-left transition ${
                  isActive
                    ? 'border-emerald-300 bg-emerald-300/10 text-white'
                    : 'border-zinc-700 bg-zinc-950 text-zinc-200 hover:border-zinc-500'
                }`}
              >
                <div className="font-medium">{option.label}</div>
                <div className="mt-2 text-sm leading-6 text-zinc-400">{option.blurb}</div>
              </button>
            );
          })}
        </div>

        <label className="mt-5 grid gap-2">
          <span className="text-sm text-zinc-300">Optional feedback</span>
          <textarea
            value={feedbackText}
            onChange={(event) => setFeedbackText(event.target.value)}
            rows={4}
            placeholder="Tell us what felt right or wrong about the suggested position."
            className="rounded-3xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
          />
        </label>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? 'Saving feedback...' : 'Submit feedback'}
          </button>
          {statusMessage ? <p className="text-sm text-zinc-400">{statusMessage}</p> : null}
        </div>
      </form>
    </section>
  );
}
