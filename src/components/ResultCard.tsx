'use client';

type ResultCardProps = {
  label: string;
  value: string;
  muted?: boolean;
};

export function ResultCard({ label, value, muted = false }: ResultCardProps) {
  return (
    <div className={`rounded-2xl border p-4 ${muted ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-700 bg-zinc-950'}`}>
      <p className="text-sm text-zinc-400">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
