'use client';

import { useEffect } from 'react';
import { captureInitialSource } from '@/lib/analytics/source';
import { initPostHog, syncPostHogSourceProperties } from '@/lib/posthog';

export function PostHogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    captureInitialSource();
    initPostHog();
    syncPostHogSourceProperties();
  }, []);

  return <>{children}</>;
}
