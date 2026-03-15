'use client';

import Image from 'next/image';
import { useEffect } from 'react';
import logo from '@/assests/logo.png';
import { trackEvent } from '@/lib/analytics/analytics';

type HomeScreenProps = {
  onStart: () => void;
  onShowAbout: () => void;
};

const POSITIONS = [
  'Goalkeeper',
  'Center Back',
  'Full Back',
  'Defensive Midfielder',
  'Central Midfielder',
  'Attacking Midfielder',
  'Winger',
  'Striker',
];

const BENEFITS = [
  {
    title: 'A clearer role fit',
    copy: 'Stop guessing where you should play. See the position that matches your instincts, habits, and strengths.',
  },
  {
    title: 'Actionable strengths and watchouts',
    copy: 'You get the upside of your profile plus the parts of your game worth sharpening next.',
  },
  {
    title: 'Better conversations with coaches',
    copy: 'Use the result as a starting point when deciding where you can contribute most on the pitch.',
  },
];

const TRUST_SIGNALS = [
  {
    name: 'FIFA Training Centre',
    href: 'https://www.fifatrainingcentre.com/',
    summary: 'Official coaching, player-development, and training education resources from FIFA.',
  },
  {
    name: 'England Football Learning',
    href: 'https://community.thefa.com/coaching/',
    summary: 'FA learning content focused on coach development, player development, and holistic growth.',
  },
  {
    name: 'U.S. Soccer Talent Identification',
    href: 'https://www.ussoccer.com/talent-identification',
    summary: 'Official guidance emphasizing context, long-term development, and non-linear player progress.',
  },
];

const STEPS = [
  'Answer 12 quick questions about how you think, move, and make decisions in a match.',
  'We score your responses across multiple football positions without changing your answers mid-way.',
  'You get a ranked result, a clear primary fit, backup fits, and feedback you can act on.',
];

export function HomeScreen({ onStart, onShowAbout }: HomeScreenProps) {
  useEffect(() => {
    trackEvent('landing_viewed');
  }, []);

  return (
    <section className="pb-16">
      <div className="animate-fade-soft overflow-hidden rounded-[2rem] border border-zinc-800 bg-[radial-gradient(circle_at_top_left,_rgba(110,231,183,0.14),_transparent_30%),linear-gradient(135deg,_#101516_0%,_#050505_55%,_#0e1112_100%)]">
        <div className="pointer-events-none absolute hidden lg:block">
          <div className="animate-float-slow absolute left-[62%] top-12 h-24 w-24 rounded-full bg-emerald-300/10 blur-2xl" />
          <div className="animate-float-slow absolute left-[78%] top-44 h-32 w-32 rounded-full bg-cyan-300/10 blur-3xl [animation-delay:0.6s]" />
        </div>
        <div className="grid gap-10 px-6 py-10 md:px-10 md:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="relative">
            <div className="animate-fade-up flex items-center gap-4 [animation-delay:0.05s]">
              <div className="p-1">
                <Image src={logo} alt="Football Position Finder logo" className="h-16 w-16 object-contain md:h-20 md:w-20" priority />
              </div>
              <p className="text-base font-semibold uppercase tracking-[0.34em] text-emerald-300 md:text-lg">Football Position Finder</p>
            </div>
            <h1 className="animate-fade-up mt-5 max-w-3xl text-4xl font-semibold leading-tight text-white md:text-6xl [animation-delay:0.12s]">
              Find the football position that actually fits how you play.
            </h1>
            <p className="animate-fade-up mt-6 max-w-2xl text-base leading-8 text-zinc-300 md:text-lg [animation-delay:0.2s]">
              For amateur players, position confusion slows development. This assessment turns your natural tendencies
              into a clearer role recommendation so you can train with more purpose and communicate your fit with more
              confidence.
            </p>

            <div className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row [animation-delay:0.28s]">
              <button
                onClick={onStart}
                className="rounded-2xl bg-emerald-300 px-6 py-3 font-medium text-black transition hover:-translate-y-0.5 hover:bg-emerald-200"
              >
                Start the 12-question assessment
              </button>
              <button
                onClick={onShowAbout}
                className="rounded-2xl border border-zinc-700 px-6 py-3 font-medium text-white transition hover:-translate-y-0.5 hover:border-zinc-500"
              >
                See how it works
              </button>
            </div>

            <div className="animate-fade-up mt-8 flex flex-wrap gap-3 text-sm text-zinc-300 [animation-delay:0.36s]">
              <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-4 py-2">Takes about 2 minutes</span>
              <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-4 py-2">No login required</span>
              <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-4 py-2">Built for amateur players</span>
            </div>
          </div>

          <div className="animate-fade-up grid gap-4 [animation-delay:0.32s]">
            <div className="rounded-[1.75rem] border border-zinc-800 bg-black/40 p-6 backdrop-blur">
              <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">What you get</p>
              <div className="mt-5 grid gap-3">
                {BENEFITS.map((item, index) => (
                  <div key={item.title} className="animate-fade-up rounded-2xl border border-zinc-800 bg-zinc-900/80 p-4" style={{ animationDelay: `${0.42 + index * 0.08}s` }}>
                    <p className="font-medium text-white">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-zinc-400">{item.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="animate-fade-up rounded-[1.75rem] border border-zinc-800 bg-zinc-950 p-6 [animation-delay:0.08s]">
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">How it works</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">A short assessment with a practical outcome.</h2>
          <div className="mt-6 grid gap-4">
            {STEPS.map((step, index) => (
              <div key={step} className="flex gap-4 rounded-3xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-300 text-sm font-semibold text-black">
                  {index + 1}
                </div>
                <p className="text-sm leading-7 text-zinc-300">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="animate-fade-up rounded-[1.75rem] border border-zinc-800 bg-zinc-950 p-6 [animation-delay:0.16s]">
          <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">Positions covered</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">Coverage across the spine, the flanks, and the final third.</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {POSITIONS.map((position, index) => (
              <div key={position} className="animate-fade-up rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-4 text-zinc-200" style={{ animationDelay: `${0.22 + index * 0.04}s` }}>
                {position}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="animate-fade-up mt-8 rounded-[1.75rem] border border-zinc-800 bg-zinc-950 p-6 md:p-8 [animation-delay:0.18s]">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">Why this helps amateur players</p>
            <h2 className="mt-4 text-3xl font-semibold text-white">Most players are training hard without a clear role identity.</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300">
              At amateur level, players are often moved around based on team need rather than fit. That can hide their
              best qualities. This assessment helps you understand where your instincts point so you can improve faster,
              choose smarter development priorities, and explain your game more clearly to coaches.
            </p>
          </div>

          <div className="rounded-[1.5rem] border border-zinc-800 bg-[linear-gradient(160deg,_rgba(16,185,129,0.18),_rgba(24,24,27,0.9))] p-6">
            <p className="text-sm uppercase tracking-[0.25em] text-emerald-100">Best for</p>
            <ul className="mt-4 grid gap-3 text-sm leading-7 text-zinc-100">
              <li className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Players unsure of their strongest role</li>
              <li className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Coaches needing a lightweight conversation starter</li>
              <li className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">Teams testing players in multiple positions</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="animate-fade-up mt-8 rounded-[1.75rem] border border-zinc-800 bg-zinc-950 p-6 md:p-8 [animation-delay:0.24s]">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-emerald-300">Why players trust this</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Built around ideas used in respected football development ecosystems.</h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-zinc-400">
            This tool is still a lightweight self-assessment, but it is framed around player-development thinking that
            serious football organizations use when they talk about role fit, coaching, and long-term improvement.
          </p>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {TRUST_SIGNALS.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className="animate-fade-up rounded-3xl border border-zinc-800 bg-zinc-900 p-5 transition hover:-translate-y-1 hover:border-zinc-600 hover:bg-zinc-900/80"
              style={{ animationDelay: `${0.3 + index * 0.08}s` }}
            >
              <div className="text-lg font-medium text-white">{item.name}</div>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{item.summary}</p>
              <p className="mt-4 text-sm font-medium text-emerald-300">Open source</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
