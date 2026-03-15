import './globals.css';
import type { Metadata } from 'next';
import Script from 'next/script';
import type { ReactNode } from 'react';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';
import { PostHogProvider } from '@/components/PostHogProvider';
import logo from '@/assests/logo.png';

const ga4Id = process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID;

export const metadata: Metadata = {
  title: 'Football Position Finder',
  description: 'Discover your best football position based on your playing style.',
  icons: {
    icon: logo.src,
    shortcut: logo.src,
    apple: logo.src,
  },
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        {ga4Id ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
            <Script
              id="ga4-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${ga4Id}', { send_page_view: false });
`,
              }}
            />
          </>
        ) : null}
        <PostHogProvider>
          <AnalyticsProvider>{children}</AnalyticsProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
