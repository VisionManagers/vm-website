/**
 * Measurement (simplification audit §9 / conversion-log ruling 4A, 2026-10-05).
 * GA4 is already loaded in index.html (G-F5HM4G07JF). This file adds:
 *   - SPA page_view on every route change (index.html sets send_page_view:false so there are no doubles)
 *   - book_click        — any click on the one booking link (BOOKING_URLS.DISCOVERY), with the page it came from
 *   - onepager_download — any click on /downloads/*
 *   - leak_audit_start / leak_audit_complete / leak_audit_sent — fired from LeakAudit.tsx
 * Nothing here identifies a person; no PII is sent.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BOOKING_URLS } from '../constants';

declare global { interface Window { gtag?: (...args: any[]) => void } }

export function track(event: string, params: Record<string, string | number | boolean> = {}) {
  try {
    window.gtag?.('event', event, { page_path: window.location.pathname, ...params });
  } catch { /* analytics must never break the page */ }
}

/** Mount once inside the Router. */
export function Analytics() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.gtag?.('event', 'page_view', { page_path: pathname + search, page_location: window.location.href, page_title: document.title });
  }, [pathname, search]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.('a');
      if (!a) return;
      const href = a.getAttribute('href') || '';
      if (href === BOOKING_URLS.DISCOVERY) track('book_click', { label: (a.textContent || '').trim().slice(0, 60) });
      else if (href.includes('/downloads/')) track('onepager_download', { file: href.split('/').pop() || href });
    };
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
