import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import SiteNav from '@/components/site-nav';
import './globals.css';
import { getBaseUrl } from '@/lib/site';

const base = getBaseUrl();

export const metadata: Metadata = {
  metadataBase: new URL(base),
  title: {
    default: 'RECIPE.SYSTEM',
    template: '%s | RECIPE.SYSTEM',
  },
  description: 'Quiet recipes with clear steps.',
  applicationName: 'RECIPE.SYSTEM',
  openGraph: {
    type: 'website',
    url: '/',
    title: 'RECIPE.SYSTEM',
    siteName: 'RECIPE.SYSTEM',
    description: 'Quiet recipes with clear steps.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'RECIPE.SYSTEM' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RECIPE.SYSTEM',
    description: 'Quiet recipes with clear steps.',
    images: ['/og.png'],
  },
  icons: {
    icon: [{ url: '/favicon.ico' }, { url: '/icon.png', type: 'image/png' }],
    apple: [{ url: '/apple-touch-icon.png' }],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0b0c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

function SiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RECIPE.SYSTEM',
    url: `${base}/`,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${base}/recipes?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='min-h-dvh bg-[#0a0b0c] text-zinc-200 antialiased'>
        <SiteJsonLd />
        <SiteNav />
        <div id='main' className='relative z-10'>
          {children}
        </div>
        <footer className='border-t border-zinc-800/70'>
          <div className='mx-auto flex max-w-6xl items-center justify-between px-4 py-6 text-xs text-zinc-500'>
            <p>Cook with care. Share with credit.</p>
            <nav className='flex items-center gap-4'>
              <a href='/privacy' className='hover:text-zinc-300'>
                Privacy
              </a>
              <a href='/contact' className='hover:text-zinc-300'>
                Contact
              </a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
