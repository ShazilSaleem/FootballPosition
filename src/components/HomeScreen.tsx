'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics/analytics';

type HomeScreenProps = {
  onStart: () => void;
  onShowAbout: () => void;
};

export function HomeScreen({ onStart, onShowAbout }: HomeScreenProps) {
  useEffect(() => {
    trackEvent('landing_viewed');
  }, []);

  return (
    <section className="mx-auto max-w-5xl py-12 text-center">
      <p className="mb-4 text-sm uppercase tracking-[0.3em] text-zinc-400">Football Position Finder</p>
      <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
        Discover the football position where you can perform best.
      </h1>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-400">
        Answer a short assessment about your playing style, decisions, and strengths to find your best-fit role on the pitch.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button onClick={onStart} className="rounded-2xl bg-white px-6 py-3 font-medium text-black transition hover:opacity-90">
          Start the assessment
        </button>
        <button onClick={onShowAbout} className="rounded-2xl border border-zinc-700 px-6 py-3 font-medium text-white transition hover:border-zinc-500">
          How it works
        </button>
      </div>
    </section>
  );
}
