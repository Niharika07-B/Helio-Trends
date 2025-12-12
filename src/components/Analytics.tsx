'use client';

import { useEffect } from 'react';
import Script from 'next/script';

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

export function Analytics() {
  useEffect(() => {
    if (GA_ID && typeof window !== 'undefined') {
      // Initialize Google Analytics
      window.gtag = window.gtag || function() {
        (window.gtag.q = window.gtag.q || []).push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', GA_ID, {
        page_title: 'HelioTrends',
        page_location: window.location.href,
      });
    }
  }, []);

  // Always render the same structure to prevent hydration mismatch
  if (!GA_ID) return <></>;  // Return empty fragment instead of null

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_title: 'HelioTrends',
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  );
}

// Track custom events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}

// Track page views
export function trackPageView(url: string, title: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_ID, {
      page_title: title,
      page_location: url,
    });
  }
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: {
      (...args: any[]): void;
      q?: any[];
    };
  }
}