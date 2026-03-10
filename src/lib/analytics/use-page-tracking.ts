'use client';

import type { ApiObject } from '@rudderstack/analytics-js';
import { useEffect } from 'react';

import { useRudderAnalytics } from './use-rudder-analytics';

function getGeoProperties(): Record<string, string> {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const locale = navigator.language;
  // Derive best-effort country code from locale region subtag (e.g. "en-US" → "US")
  const parts = locale.split('-');
  const country = parts.length >= 2 ? parts[parts.length - 1] : undefined;
  return {
    timezone,
    locale,
    ...(country ? { country } : {}),
  };
}

export function usePageTracking(
  pageName: string,
  properties?: Record<string, unknown>,
): void {
  const analytics = useRudderAnalytics();
  const propsKey = JSON.stringify(properties);

  useEffect(() => {
    if (!analytics) return;

    const parsed: ApiObject | undefined = propsKey
      ? (JSON.parse(propsKey) as ApiObject)
      : undefined;

    const geo = getGeoProperties();
    const enriched = { ...geo, ...(parsed ?? {}) } as ApiObject;

    console.log('[Analytics] Page:', pageName, enriched);
    analytics.page(pageName, pageName, enriched);
  }, [analytics, pageName, propsKey]);
}
