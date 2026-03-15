import type { AnswerMap, RankedPosition } from '@/lib/scoring/calculateResult';

export type FeedbackRating = 'yes' | 'somewhat' | 'no';

export type SavedResultEntry = {
  id: string;
  createdAt: string;
  answers: AnswerMap;
  primary: RankedPosition | null;
  secondary: RankedPosition | null;
  summary: string;
  strengths: string[];
  watchouts: string[];
  leadName?: string | null;
  leadEmail?: string | null;
  leadCapturedAt?: string | null;
  feedbackRating?: FeedbackRating | null;
  feedbackText?: string | null;
  feedbackSubmittedAt?: string | null;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
};

const STORAGE_KEY = 'football-position-finder-results';

export function loadLocalResults(): SavedResultEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as SavedResultEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveLocalResult(entry: SavedResultEntry): SavedResultEntry[] {
  const current = loadLocalResults();
  const next = [entry, ...current].slice(0, 10);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function clearLocalResults(): SavedResultEntry[] {
  window.localStorage.removeItem(STORAGE_KEY);
  return [];
}
