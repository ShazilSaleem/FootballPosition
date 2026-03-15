'use client';

import { useEffect, useMemo, useRef } from 'react';
import { ProgressBar } from '@/components/ProgressBar';
import { ResultCard } from '@/components/ResultCard';
import { ResultsFeedbackSection } from '@/components/ResultsFeedbackSection';
import { calculateResult, formatShareText } from '@/lib/scoring/calculateResult';
import { trackEvent } from '@/lib/analytics/analytics';
import type { FeedbackRating, SavedResultEntry } from '@/lib/storage/results';

type ResultsScreenProps = {
  entry: SavedResultEntry;
  onRetake: () => void;
  onBackHome: () => void;
  onOpenHistory: () => void;
  onFeedbackSubmit: (payload: { feedbackRating: FeedbackRating; feedbackText: string | null }) => Promise<void> | void;
  isFeedbackSaving?: boolean;
};

export function ResultsScreen({
  entry,
  onRetake,
  onBackHome,
  onOpenHistory,
  onFeedbackSubmit,
  isFeedbackSaving = false,
}: ResultsScreenProps) {
  const { answers } = entry;
  const result = useMemo(() => calculateResult(answers), [answers]);
  const maxScore = result.primary?.score ?? 1;
  const shareText = useMemo(() => formatShareText(result), [result]);
  const lastViewedKey = useRef<string | null>(null);
  const feedbackViewedKey = useRef<string | null>(null);

  useEffect(() => {
    const viewKey = `${result.primary?.key ?? 'none'}-${result.secondary?.key ?? 'none'}-${Object.keys(answers).length}`;
    if (lastViewedKey.current === viewKey) return;
    lastViewedKey.current = viewKey;
    trackEvent('result_viewed', {
      primary: result.primary?.key ?? null,
      secondary: result.secondary?.key ?? null,
      answersCount: Object.keys(answers).length,
    });
  }, [answers, result.primary?.key, result.secondary?.key]);

  function handleFeedbackViewed() {
    if (feedbackViewedKey.current === entry.id) return;
    feedbackViewedKey.current = entry.id;
    trackEvent('feedback_viewed', { resultId: entry.id });
  }

  function handleFeedbackRatingSelected(rating: FeedbackRating) {
    trackEvent('feedback_rating_selected', {
      resultId: entry.id,
      feedbackRating: rating,
    });
  }

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Football Position Finder Result', text: shareText });
        trackEvent('result_shared', { method: 'native' });
        return;
      }
    } catch {
      // fall through
    }

    try {
      await navigator.clipboard.writeText(shareText);
      window.alert('Result copied to clipboard.');
      trackEvent('result_shared', { method: 'clipboard' });
      return;
    } catch {
      window.alert(shareText);
      trackEvent('result_shared', { method: 'manual' });
    }
  }

  return (
    <section className="mx-auto max-w-4xl py-8">
      <p className="mb-4 text-sm uppercase tracking-[0.3em] text-zinc-400">Your result</p>
      <h1 className="text-4xl font-bold text-white">{result.primary?.name ?? 'No result available'}</h1>
      <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-300">{result.summary}</p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <ResultCard label="Primary position" value={result.primary?.name ?? '-'} />
        <ResultCard label="Secondary position" value={result.secondary?.name ?? '-'} muted />
        <ResultCard label="Archetype" value={result.primary?.archetype ?? '-'} muted />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-2xl font-semibold text-white">Strengths</h2>
          <ul className="mt-4 list-disc pl-5 leading-8 text-zinc-300">
            {result.strengths.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="text-2xl font-semibold text-white">Watchouts</h2>
          <ul className="mt-4 list-disc pl-5 leading-8 text-zinc-300">
            {result.watchouts.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="text-2xl font-semibold text-white">Top position matches</h2>
        <div className="mt-5 grid gap-4">
          {result.ranking.slice(0, 5).map((item) => (
            <div key={item.key}>
              <div className="mb-2 flex items-center justify-between text-sm text-zinc-300">
                <span>{item.name}</span>
                <span>{item.score} pts</span>
              </div>
              <ProgressBar value={Math.min((item.score / maxScore) * 100, 100)} />
            </div>
          ))}
        </div>
      </div>

      {(entry.leadName || entry.leadEmail) ? (
        <div className="mt-6 rounded-3xl border border-emerald-400/20 bg-emerald-400/5 p-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">Saved contact</p>
            <h2 className="text-2xl font-semibold text-white">Lead information attached to this result</h2>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <ResultCard label="Name" value={entry.leadName ?? '-'} muted />
            <ResultCard label="Email" value={entry.leadEmail ?? '-'} muted />
          </div>
        </div>
      ) : null}

      <ResultsFeedbackSection
        initialRating={entry.feedbackRating ?? null}
        initialText={entry.feedbackText ?? null}
        onViewed={handleFeedbackViewed}
        onRatingSelected={handleFeedbackRatingSelected}
        onSubmit={onFeedbackSubmit}
        isSubmitting={isFeedbackSaving}
      />

      <div className="mt-8 flex flex-wrap gap-4">
        <button onClick={onRetake} className="rounded-2xl bg-white px-6 py-3 font-medium text-black">Retake assessment</button>
        <button onClick={handleShare} className="rounded-2xl border border-zinc-700 px-6 py-3 font-medium text-white">Share result</button>
        <button onClick={onOpenHistory} className="rounded-2xl border border-zinc-700 px-6 py-3 font-medium text-white">View saved results</button>
        <button onClick={onBackHome} className="rounded-2xl border border-zinc-700 px-6 py-3 font-medium text-white">Back to home</button>
      </div>
    </section>
  );
}
