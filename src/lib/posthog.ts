'use client';

import posthog from 'posthog-js';
import { getSourceMetadata } from '@/lib/analytics/source';

let initialized = false;

export function initPostHog() {
  if (initialized) return;
  if (typeof window === 'undefined') return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true,
    autocapture: false,
  });

  initialized = true;
}

export function syncPostHogSourceProperties() {
  if (typeof window === 'undefined') return;
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

  const source = getSourceMetadata();
  const properties = Object.fromEntries(Object.entries(source).filter(([, value]) => value));

  if (Object.keys(properties).length > 0) {
    posthog.register(properties);
  }
}

export { posthog };
