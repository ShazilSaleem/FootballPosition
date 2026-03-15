'use client';

import { useEffect, useState } from 'react';
import type { SavedResultEntry } from '@/lib/storage/results';

type LeadCaptureStepProps = {
  entry: SavedResultEntry;
  onViewed: () => void;
  onSubmit: (payload: { leadName: string; leadEmail: string; leadRole: 'player' | 'coach' | 'academy' }) => Promise<void> | void;
  isSubmitting?: boolean;
};

export function LeadCaptureStep({ entry, onViewed, onSubmit, isSubmitting = false }: LeadCaptureStepProps) {
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadRole, setLeadRole] = useState<'player' | 'coach' | 'academy' | ''>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [leadName, leadEmail, leadRole]);

  useEffect(() => {
    onViewed();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = leadName.trim();
    const trimmedEmail = leadEmail.trim();
    const trimmedRole = leadRole;

    if (!trimmedName || !trimmedEmail || !trimmedRole) {
      setError('Name, email, and role are required to unlock the full result.');
      return;
    }

    await onSubmit({
      leadName: trimmedName,
      leadEmail: trimmedEmail,
      leadRole: trimmedRole,
    });
  }

  return (
    <section className="mx-auto max-w-4xl py-10">
      <div className="overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="grid gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">Before your result</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Your top fit is ready. Unlock the full breakdown first.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-zinc-300 md:text-lg">
              We have calculated your result already. Enter your name, email, and whether you are a player, coach, or
              academy to reveal the full position profile, strengths, watchouts, and top-match list.
            </p>

            <div className="mt-8 grid gap-4 text-sm text-zinc-300 md:grid-cols-2">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="font-medium text-white">Result teaser</p>
                <p className="mt-2 text-zinc-400">A tailored role recommendation has been generated from your answers.</p>
              </div>
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="font-medium text-white">What unlocks next</p>
                <p className="mt-2 text-zinc-400">Full role breakdown, strengths, watchouts, and your complete ranking.</p>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-zinc-950 p-5">
              <p className="text-sm uppercase tracking-[0.22em] text-zinc-500">Preview</p>
              <h2 className="mt-3 text-3xl font-semibold text-white">Your position profile is ready</h2>
              <p className="mt-3 text-zinc-400">
                We have calculated your football profile already. Unlock the full report to see your best-fit role,
                supporting fit, strengths, watchouts, and ranking.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
                  <p className="text-sm text-zinc-500">Top strength preview</p>
                  <p className="mt-2 text-white blur-[2px] select-none">{entry.strengths[0] ?? 'Role clarity and development cues'}</p>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-black/30 p-4">
                  <p className="text-sm text-zinc-500">Complete result</p>
                  <p className="mt-2 text-white blur-[2px] select-none">Secondary role, archetype, ranked fits, feedback panel</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[1.75rem] border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-2xl font-semibold text-white">Unlock full result</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Enter your details to continue to the complete assessment breakdown.
            </p>

            <div className="mt-6 grid gap-4">
              <label className="grid gap-2">
                <span className="text-sm text-zinc-300">Name</span>
                <input
                  value={leadName}
                  onChange={(event) => setLeadName(event.target.value)}
                  placeholder="Your name"
                  className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-zinc-300">Email</span>
                <input
                  type="email"
                  value={leadEmail}
                  onChange={(event) => setLeadEmail(event.target.value)}
                  placeholder="you@example.com"
                  className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-sm text-zinc-300">Are you a player, coach, or academy?</span>
                <select
                  value={leadRole}
                  onChange={(event) => setLeadRole(event.target.value as 'player' | 'coach' | 'academy' | '')}
                  className="rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-emerald-400"
                >
                  <option value="">Select one</option>
                  <option value="player">Player</option>
                  <option value="coach">Coach</option>
                  <option value="academy">Academy</option>
                </select>
              </label>
            </div>

            {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-2xl bg-emerald-300 px-5 py-3 font-medium text-black transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Saving...' : 'Continue to full result'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
