import { POSITIONS, type PositionKey } from '@/data/questions';
import type { AnswerMap, RankedPosition } from '@/lib/scoring/calculateResult';
import type { SavedResultEntry } from '@/lib/storage/results';
import type { SourceMetadata } from '@/lib/analytics/source';

type RemoteResultPayload = {
  id: string;
  createdAt: string;
  answers: AnswerMap;
  scores: Record<string, number>;
  primaryKey: string;
  primaryName: string;
  primaryScore: number;
  primaryArchetype: string;
  secondaryKey: string | null;
  secondaryName: string | null;
  secondaryScore: number | null;
  secondaryArchetype: string | null;
  tertiaryKey: string | null;
  tertiaryName: string | null;
  tertiaryScore: number | null;
  tertiaryArchetype: string | null;
  strengths: string[];
  watchouts: string[];
  summary: string;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
};

const POSITION_KEYS = new Set(Object.keys(POSITIONS) as PositionKey[]);

function toRankedPosition(
  key: string | null,
  name: string | null,
  score: number | null,
  archetype: string | null,
): RankedPosition | null {
  if (!key || !name || score === null || archetype === null) return null;
  if (!POSITION_KEYS.has(key as PositionKey)) return null;
  return {
    key: key as PositionKey,
    name,
    score,
    archetype,
  };
}

function mapRemoteResult(payload: RemoteResultPayload): SavedResultEntry {
  return {
    id: payload.id,
    createdAt: payload.createdAt,
    answers: payload.answers ?? {},
    primary: toRankedPosition(payload.primaryKey, payload.primaryName, payload.primaryScore, payload.primaryArchetype),
    secondary: toRankedPosition(payload.secondaryKey, payload.secondaryName, payload.secondaryScore, payload.secondaryArchetype),
    summary: payload.summary ?? '',
    strengths: Array.isArray(payload.strengths) ? payload.strengths : [],
    watchouts: Array.isArray(payload.watchouts) ? payload.watchouts : [],
    utmSource: payload.utmSource ?? null,
    utmMedium: payload.utmMedium ?? null,
    utmCampaign: payload.utmCampaign ?? null,
  };
}

export async function fetchResults(signal?: AbortSignal): Promise<SavedResultEntry[]> {
  const response = await fetch('/api/results', { signal, cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Failed to fetch results');
  }

  const data = (await response.json()) as { results?: RemoteResultPayload[] };
  if (!Array.isArray(data.results)) {
    return [];
  }

  return data.results.map(mapRemoteResult);
}

export async function createResult(
  answers: AnswerMap,
  source: SourceMetadata = {},
  signal?: AbortSignal,
): Promise<SavedResultEntry> {
  const response = await fetch('/api/results', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers, ...source }),
    signal,
  });

  if (!response.ok) {
    throw new Error('Failed to create result');
  }

  const data = (await response.json()) as { result?: RemoteResultPayload };
  if (!data.result) {
    throw new Error('Malformed create result response');
  }

  return mapRemoteResult(data.result);
}

export async function clearRemoteResults(signal?: AbortSignal): Promise<void> {
  const response = await fetch('/api/results', { method: 'DELETE', signal });
  if (!response.ok) {
    throw new Error('Failed to clear results');
  }
}

export async function fetchResultById(id: string, signal?: AbortSignal): Promise<SavedResultEntry | null> {
  const response = await fetch(`/api/results/${encodeURIComponent(id)}`, { signal, cache: 'no-store' });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error('Failed to fetch result');
  }

  const data = (await response.json()) as { result?: RemoteResultPayload };
  if (!data.result) {
    return null;
  }

  return mapRemoteResult(data.result);
}
