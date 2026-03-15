'use client';

import { useEffect, useState } from 'react';

type LeadCaptureStepProps = {
  onViewed: () => void;
  onSkip: () => void;
  onSubmit: (payload: { leadName: string | null; leadEmail: string | null }) => Promise<void> | void;
  isSubmitting?: boolean;
};

export function LeadCaptureStep({ onViewed, onSkip, onSubmit, isSubmitting = false }: LeadCaptureStepProps) {
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
  }, [leadName, leadEmail]);

  useEffect(() => {
    onViewed();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedName = leadName.trim();
    const trimmedEmail = leadEmail.trim();

    if (!trimmedName && !trimmedEmail) {
      setError('Add at least your name or email, or skip this step.');
      return;
    }

    await onSubmit({
      leadName: trimmedName || null,
      leadEmail: trimmedEmail || null,
    });
  }

  return (
    <section className="mx-auto max-w-4xl py-10">
      <div className="overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-950 shadow-2xl">
        <div className="grid gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">Before your result</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
              Want your result saved with your details for follow-up?
            </h1>
            <p className="mt-5 max-w-xl text-base leading-8 text-zinc-300 md:text-lg">
              Add your name and email if you want to keep your football profile tied to you. You can skip this and
              view your result immediately.
            </p>

            <div className="mt-8 grid gap-4 text-sm text-zinc-300 md:grid-cols-2">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="font-medium text-white">Completely optional</p>
                <p className="mt-2 text-zinc-400">No login. No forced email gate. Skip any time.</p>
              </div>
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/70 p-4">
                <p className="font-medium text-white">Useful if you coach or share</p>
                <p className="mt-2 text-zinc-400">Makes it easier to tie saved results back to a player later.</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-[1.75rem] border border-zinc-800 bg-zinc-900 p-6">
            <h2 className="text-2xl font-semibold text-white">See your result next</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Add your details if you want. Otherwise, skip and go straight to the result.
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
            </div>

            {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-2xl bg-emerald-300 px-5 py-3 font-medium text-black transition hover:bg-emerald-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Saving...' : 'Save and view result'}
              </button>
              <button
                type="button"
                onClick={onSkip}
                disabled={isSubmitting}
                className="rounded-2xl border border-zinc-700 px-5 py-3 font-medium text-white transition hover:border-zinc-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Skip for now
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
