'use client';

import { getSourceMetadata } from '@/lib/analytics/source';
import { initPostHog, posthog } from '@/lib/posthog';

type AnalyticsProperties = Record<string, unknown>;

const GA4_ID = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

export function initAnalytics() {
  // PostHog initialization is owned by PostHogProvider.
  initPostHog();
}

export function trackEvent(name: string, properties: AnalyticsProperties = {}) {
  if (typeof window === 'undefined') return;

  initPostHog();

  const source = getSourceMetadata();
  const payload = { ...source, ...properties };

  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.capture(name, payload);
  }

  if (GA4_ID && typeof window.gtag === 'function') {
    window.gtag('event', name, payload);
  }
}
