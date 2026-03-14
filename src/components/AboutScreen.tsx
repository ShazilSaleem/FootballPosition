'use client';

type AboutScreenProps = {
  onBack: () => void;
};

export function AboutScreen({ onBack }: AboutScreenProps) {
  return (
    <section className="mx-auto max-w-3xl py-8">
      <h1 className="text-4xl font-bold text-white">How it works</h1>
      <p className="mt-6 text-lg leading-8 text-zinc-300">
        The assessment uses a rule-based scoring engine. Each answer contributes weighted points toward one or more football positions. Your final result is based on repeated patterns across the full assessment, not a single answer.
      </p>
      <button onClick={onBack} className="mt-6 rounded-2xl bg-white px-6 py-3 font-medium text-black">
        Back
      </button>
    </section>
  );
}
