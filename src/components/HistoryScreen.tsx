'use client';

import { ResultCard } from '@/components/ResultCard';
import type { SavedResultEntry } from '@/lib/storage/results';

type HistoryScreenProps = {
  savedResults: SavedResultEntry[];
  onOpenSaved: (entry: SavedResultEntry) => void;
  onClearHistory: () => void;
  onBack: () => void;
};

export function HistoryScreen({ savedResults, onOpenSaved, onClearHistory, onBack }: HistoryScreenProps) {
  return (
    <section className="mx-auto max-w-4xl py-8">
      <p className="mb-4 text-sm uppercase tracking-[0.3em] text-zinc-400">Saved results</p>
      <h1 className="text-4xl font-bold text-white">Recent assessments</h1>
      <p className="mt-4 text-lg leading-8 text-zinc-300">
        Your latest results are stored online when available, with a local browser fallback so you can compare them later.
      </p>

      {savedResults.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
          <p className="text-zinc-400">No saved results yet. Complete the assessment to start building history.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-4">
          {savedResults.map((entry) => (
            <div key={entry.id} className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white">{entry.primary?.name ?? '-'}</h2>
                  <p className="mt-2 text-sm text-zinc-400">{new Date(entry.createdAt).toLocaleString()}</p>
                </div>
                <button onClick={() => onOpenSaved(entry)} className="rounded-2xl border border-zinc-700 px-4 py-2 text-white">
                  Open
                </button>
              </div>

              <p className="mt-4 leading-7 text-zinc-300">{entry.summary}</p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <ResultCard label="Primary" value={entry.primary?.name ?? '-'} muted />
                <ResultCard label="Secondary" value={entry.secondary?.name ?? '-'} muted />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex flex-wrap gap-4">
        <button onClick={onBack} className="rounded-2xl bg-white px-6 py-3 font-medium text-black">
          Back
        </button>
        <button onClick={onClearHistory} className="rounded-2xl border border-zinc-700 px-6 py-3 font-medium text-white">
          Clear saved results
        </button>
      </div>
    </section>
  );
}
