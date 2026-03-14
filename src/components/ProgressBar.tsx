'use client';

type ProgressBarProps = {
  value: number;
};

export function ProgressBar({ value }: ProgressBarProps) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
      <div className="h-full rounded-full bg-white transition-all" style={{ width: `${value}%` }} />
    </div>
  );
}
