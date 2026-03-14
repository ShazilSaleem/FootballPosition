'use client';

export type SourceMetadata = {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
  landingPath?: string | null;
  referrer?: string | null;
};

const STORAGE_KEY = 'football-position-finder-source';

function normalize(value: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function readFromUrl(): SourceMetadata | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const utmSource = normalize(params.get('utm_source'));
  const utmMedium = normalize(params.get('utm_medium'));
  const utmCampaign = normalize(params.get('utm_campaign'));
  const utmTerm = normalize(params.get('utm_term'));
  const utmContent = normalize(params.get('utm_content'));
  const landingPath = normalize(window.location.pathname + window.location.search);
  const referrer = normalize(document.referrer);
  if (!utmSource && !utmMedium && !utmCampaign && !utmTerm && !utmContent && !referrer) return null;
  return { utmSource, utmMedium, utmCampaign, utmTerm, utmContent, landingPath, referrer };
}

function readCurrentSource(): SourceMetadata {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: normalize(params.get('utm_source')),
    utmMedium: normalize(params.get('utm_medium')),
    utmCampaign: normalize(params.get('utm_campaign')),
    utmTerm: normalize(params.get('utm_term')),
    utmContent: normalize(params.get('utm_content')),
    landingPath: normalize(window.location.pathname + window.location.search),
    referrer: normalize(document.referrer),
  };
}

function readStored(): SourceMetadata | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SourceMetadata;
  } catch {
    return null;
  }
}

function storeSource(source: SourceMetadata) {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(source));
  } catch {
    // ignore storage failures
  }
}

export function captureInitialSource() {
  if (readStored()) return;

  const fromUrl = readFromUrl();
  if (fromUrl) {
    storeSource(fromUrl);
    return;
  }

  storeSource(readCurrentSource());
}

export function getSourceMetadata(): SourceMetadata {
  const stored = readStored();
  if (stored) return stored;
  const current = readCurrentSource();
  storeSource(current);
  return current;
}
