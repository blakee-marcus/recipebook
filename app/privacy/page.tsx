// app/privacy/page.tsx
import { Shield, Lock, Cookie, Link2, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export const metadata = {
  title: 'Privacy Policy | RECIPE.SYSTEM',
  description: 'How RECIPE.SYSTEM handles data with a focus on simplicity and respect.',
};

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString();

  const sections = [
    { id: 'info', icon: Shield, label: 'Information Collected' },
    { id: 'cookies', icon: Cookie, label: 'Cookies' },
    { id: 'third-parties', icon: Link2, label: 'Third Parties' },
    { id: 'data-you-submit', icon: Info, label: 'Data You Submit' },
    { id: 'your-rights', icon: Shield, label: 'Your Rights' },
    { id: 'security', icon: Lock, label: 'Security' },
    { id: 'changes', icon: Info, label: 'Changes' },
    { id: 'affiliate', icon: Link2, label: 'Affiliate Links' },
  ];

  return (
    <main className='mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-12 md:grid-cols-[1fr_280px]'>
      {/* Left: content */}
      <div>
        {/* Header panel */}
        <Card className='border-zinc-800 bg-zinc-950'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-2xl font-medium text-zinc-100'>Privacy Policy</CardTitle>
              <Badge
                variant='secondary'
                className='border border-zinc-700 bg-zinc-900 text-zinc-300'>
                Current
              </Badge>
            </div>
            <p className='mt-2 text-xs text-zinc-500'>Last updated: {lastUpdated}</p>
          </CardHeader>
          <CardContent className='text-sm leading-relaxed text-zinc-300'>
            <p>
              RECIPE.SYSTEM values privacy. This site exists to share recipes in a clean and quiet
              way. It collects as little information as possible to function.
            </p>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className='mt-6 space-y-6'>
          {/* 1. Information Collected */}
          <Card id='info' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Shield className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>
                  1. Information Collected
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <p>
                This site may record basic technical details that your browser sends, such as IP
                address, user agent, and pages visited. This helps with performance, reliability,
                and abuse prevention. No profiles are built from this data.
              </p>
            </CardContent>
          </Card>

          {/* 2. Cookies */}
          <Card id='cookies' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Cookie className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>2. Cookies</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <p>
                Cookies, if present, are used only for essential features like remembering simple
                preferences. No tracking cookies are set by this site.
              </p>
            </CardContent>
          </Card>

          {/* 3. Third Parties */}
          <Card id='third-parties' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Link2 className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>
                  3. Third Parties
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <p>
                This site does not load third party analytics tools or advertising scripts. External
                links may appear in content. External sites have their own policies.
              </p>
            </CardContent>
          </Card>

          {/* 4. Data You Submit */}
          <Card id='data-you-submit' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Info className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>
                  4. Data You Submit
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <p>
                If you choose to send a message or submit information, it will be used only to
                respond to your request. You can ask for deletion at any time.
              </p>
            </CardContent>
          </Card>

          {/* 5. Your Rights */}
          <Card id='your-rights' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Shield className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>
                  5. Your Rights
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <p>
                You can request access to or deletion of any personal data you provided. Use the
                contact page for requests.
              </p>
            </CardContent>
          </Card>

          {/* 6. Security */}
          <Card id='security' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Lock className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>6. Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <p>
                Reasonable safeguards are in place to protect data in transit and at rest. No method
                is perfect, but care is taken to reduce risk.
              </p>
            </CardContent>
          </Card>

          {/* 7. Changes */}
          <Card id='changes' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Info className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>7. Changes</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <p>
                Any material changes to this policy will be posted on this page with an updated
                date.
              </p>
            </CardContent>
          </Card>

          {/* 8. Affiliate Links */}
          <Card id='affiliate' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Link2 className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>
                  8. Affiliate Links
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <p>
                Some recipe pages may include links to products or tools used in cooking. These are
                chosen for relevance and quality. If you purchase something through one of these
                links, RECIPE.SYSTEM may earn a small commission at no extra cost to you. This
                supports hosting and maintenance.
              </p>
            </CardContent>
          </Card>

          {/* Footer detail */}
          <div className='pt-2'>
            <Separator className='my-4 border-zinc-800' />
            <p className='text-xs text-zinc-500'>Last updated: {lastUpdated}</p>
            <div className='mt-4'>
              <a
                href='/contact'
                className='inline-flex items-center gap-2 text-sm text-zinc-400 underline underline-offset-2 hover:text-zinc-200'>
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Right: sticky TOC */}
      <aside className='top-24 hidden md:block'>
        <Card className='sticky border-zinc-800 bg-zinc-950 p-0'>
          <CardHeader className='pb-2'>
            <CardTitle className='text-sm font-semibold text-zinc-200'>On this page</CardTitle>
          </CardHeader>
          <CardContent className='space-y-1 pb-4'>
            {sections.map(({ id, icon: Icon, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className='group flex items-center gap-2 rounded px-2 py-1 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'>
                <Icon className='size-3.5 text-zinc-500 group-hover:text-zinc-300' />
                <span>{label}</span>
              </a>
            ))}
          </CardContent>
        </Card>
      </aside>
    </main>
  );
}
