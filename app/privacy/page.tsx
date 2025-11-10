import { Shield, Lock, Cookie, Link2, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

export const metadata = {
  title: 'Privacy Policy | RECIPE.SYSTEM',
  description: 'Privacy Policy for RECIPE.SYSTEM',
};

export default function PrivacyPage() {
  const lastUpdated = new Date().toLocaleDateString();

  const sections = [
    { id: 'scope', icon: Info, label: 'Scope' },
    { id: 'categories', icon: Shield, label: 'Categories of Personal Data' },
    { id: 'sources', icon: Info, label: 'Sources of Personal Data' },
    { id: 'purposes', icon: Info, label: 'Purposes and Legal Bases' },
    { id: 'cookies', icon: Cookie, label: 'Cookies and Similar Technologies' },
    { id: 'sharing', icon: Link2, label: 'How We Share Data' },
    { id: 'retention', icon: Info, label: 'Retention' },
    { id: 'security', icon: Lock, label: 'Security' },
    { id: 'intl', icon: Info, label: 'International Transfers' },
    { id: 'your-rights', icon: Shield, label: 'Your Privacy Rights' },
    { id: 'ccpa', icon: Shield, label: 'California Notice at Collection' },
    { id: 'children', icon: Info, label: 'Children’s Privacy' },
    { id: 'dnt', icon: Info, label: 'Do Not Track' },
    { id: 'changes', icon: Info, label: 'Changes to this Policy' },
    { id: 'affiliate', icon: Link2, label: 'Affiliate Disclosure' },
    { id: 'contact', icon: Info, label: 'Contact' },
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
              This Privacy Policy explains how RECIPE.SYSTEM collects, uses, discloses, and protects
              personal data when you visit the website, create content, communicate with us, or
              otherwise interact with our services.
            </p>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className='mt-6 space-y-6'>
          {/* 1. Scope */}
          <Card id='scope' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Info className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>1. Scope</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <p>
                This policy applies to personal data processed by RECIPE.SYSTEM in connection with
                the public website and related features. It does not apply to third party websites,
                services, or applications that may be linked from our site.
              </p>
            </CardContent>
          </Card>

          {/* 2. Categories */}
          <Card id='categories' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Shield className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>
                  2. Categories of Personal Data
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <ul className='list-disc space-y-2 pl-5'>
                <li>
                  <span className='font-medium'>Identifiers.</span> IP address, device identifiers,
                  and approximate location derived from IP.
                </li>
                <li>
                  <span className='font-medium'>Internet or network activity.</span> Access time,
                  pages viewed, referring URLs, user agent, and interaction logs.
                </li>
                <li>
                  <span className='font-medium'>User submissions.</span> Information you provide in
                  forms or messages, such as name, email, and content you submit.
                </li>
                <li>
                  <span className='font-medium'>Inferences.</span> Limited technical inferences for
                  performance, security, and abuse prevention.
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* 3. Sources */}
          <Card id='sources' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Info className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>
                  3. Sources of Personal Data
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <p>
                We collect personal data directly from you, automatically from your device when you
                use the site, and from service providers that support our operations.
              </p>
            </CardContent>
          </Card>

          {/* 4. Purposes and Legal Bases */}
          <Card id='purposes' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Info className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>
                  4. Purposes and Legal Bases
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <ul className='list-disc space-y-2 pl-5'>
                <li>
                  <span className='font-medium'>Provide and operate the site.</span> Process
                  requests, display content, and maintain core functionality.{' '}
                  <span className='italic'>Legal basis:</span> performance of a contract or
                  legitimate interests.
                </li>
                <li>
                  <span className='font-medium'>Security and integrity.</span> Detect, prevent, and
                  respond to fraud, abuse, and technical issues.{' '}
                  <span className='italic'>Legal basis:</span> legitimate interests and legal
                  obligations.
                </li>
                <li>
                  <span className='font-medium'>Communications.</span> Respond to inquiries and
                  provide administrative messages. <span className='italic'>Legal basis:</span>{' '}
                  consent where required or legitimate interests.
                </li>
                <li>
                  <span className='font-medium'>Compliance.</span> Comply with applicable laws,
                  regulations, and lawful requests. <span className='italic'>Legal basis:</span>{' '}
                  legal obligations.
                </li>
              </ul>
              <p className='mt-3'>
                We do not use personal data for targeted advertising or for selling personal
                information as defined by applicable law.
              </p>
            </CardContent>
          </Card>

          {/* 5. Cookies */}
          <Card id='cookies' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Cookie className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>
                  5. Cookies and Similar Technologies
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <p>
                We may use cookies or local storage to enable core features, maintain session state,
                and improve security. Categories used:
              </p>
              <ul className='list-disc space-y-2 pl-5 mt-2'>
                <li>
                  <span className='font-medium'>Strictly necessary.</span> Required for basic site
                  functions. These cannot be disabled in our systems.
                </li>
                <li>
                  <span className='font-medium'>Functional.</span> Remembers preferences you set.
                </li>
              </ul>
              <p className='mt-3'>
                We do not use cookies for cross site targeted advertising or third party analytics.
                Your browser settings may allow you to block or delete cookies, which may affect
                functionality.
              </p>
            </CardContent>
          </Card>

          {/* 6. Sharing */}
          <Card id='sharing' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Link2 className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>
                  6. How We Share Data
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <ul className='list-disc space-y-2 pl-5'>
                <li>
                  <span className='font-medium'>Service providers.</span> Vendors that host,
                  maintain, or secure the site and process data on our behalf under written
                  contracts.
                </li>
                <li>
                  <span className='font-medium'>Legal compliance.</span> Disclosures to government
                  authorities or third parties when required by law or to protect rights and safety.
                </li>
                <li>
                  <span className='font-medium'>Business transfers.</span> In connection with a
                  merger, acquisition, or asset sale, subject to appropriate protections.
                </li>
              </ul>
              <p className='mt-3'>
                We do not sell or share personal information for cross context behavioral
                advertising.
              </p>
            </CardContent>
          </Card>

          {/* 7. Retention */}
          <Card id='retention' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Info className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>7. Retention</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <p>
                We retain personal data for as long as necessary to fulfill the purposes described
                in this policy, including complying with legal, accounting, or reporting
                obligations. When no longer needed, data is deleted or de identified consistent with
                applicable law.
              </p>
            </CardContent>
          </Card>

          {/* 8. Security */}
          <Card id='security' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Lock className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>8. Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <p>
                We implement technical and organizational measures designed to protect personal data
                from unauthorized access, disclosure, alteration, and destruction. No system can be
                guaranteed to be fully secure.
              </p>
            </CardContent>
          </Card>

          {/* 9. International Transfers */}
          <Card id='intl' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Info className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>
                  9. International Transfers
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <p>
                If personal data is transferred to countries with different data protection laws, we
                will implement appropriate safeguards as required by applicable law.
              </p>
            </CardContent>
          </Card>

          {/* 10. Your Rights */}
          <Card id='your-rights' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Shield className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>
                  10. Your Privacy Rights
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <p>
                Depending on your location, you may have rights to request access to, correction of,
                or deletion of your personal data, to object to or restrict certain processing, and
                to data portability. To exercise these rights, use the contact method below. We will
                verify requests as required by law.
              </p>
              <p className='mt-3'>
                Residents of the European Economic Area, the UK, and Switzerland also have the right
                to lodge a complaint with a supervisory authority.
              </p>
            </CardContent>
          </Card>

          {/* 11. California Notice at Collection */}
          <Card id='ccpa' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Shield className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>
                  11. California Notice at Collection
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <p>
                We collect the categories of personal information described above under Identifiers,
                Internet or network activity, and User submissions for the purposes described in
                this policy. We do not sell or share personal information as defined in Cal. Civ.
                Code § 1798.140. We retain information as described in the Retention section.
                California residents may request access, deletion, and correction and may limit use
                of sensitive personal information if applicable.
              </p>
            </CardContent>
          </Card>

          {/* 12. Children */}
          <Card id='children' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Info className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>
                  12. Children’s Privacy
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <p>
                The site is not directed to children under 13 and we do not knowingly collect
                personal data from children under 13. If you believe a child has provided personal
                data, contact us so we can take appropriate action.
              </p>
            </CardContent>
          </Card>

          {/* 13. Do Not Track */}
          <Card id='dnt' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Info className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>
                  13. Do Not Track
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <p>
                Some browsers offer a Do Not Track signal. Because there is no standard governing
                responses to these signals, we do not respond to them. We do not engage in targeted
                advertising.
              </p>
            </CardContent>
          </Card>

          {/* 14. Changes */}
          <Card id='changes' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Info className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>
                  14. Changes to this Policy
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <p>
                We may update this policy. The effective date will appear at the top of the page.
                Material changes will be posted on this page.
              </p>
            </CardContent>
          </Card>

          {/* 15. Affiliate Disclosure */}
          <Card id='affiliate' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Link2 className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>
                  15. Affiliate Disclosure
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <p>
                Some pages may include links to third party products or services. If you make a
                purchase through these links, RECIPE.SYSTEM may earn a commission. Prices are not
                affected by these links. We do not control third party sites and their privacy
                practices are governed by their own policies.
              </p>
            </CardContent>
          </Card>

          {/* 16. Contact */}
          <Card id='contact' className='border-zinc-800 bg-zinc-950'>
            <CardHeader className='pb-3'>
              <div className='flex items-center gap-2'>
                <Info className='size-4 text-zinc-400' />
                <CardTitle className='text-lg font-semibold text-zinc-200'>16. Contact</CardTitle>
              </div>
            </CardHeader>
            <CardContent className='text-sm leading-relaxed text-zinc-300'>
              <p>
                To exercise your rights or ask questions about this policy, use the contact page.
              </p>
              <div className='mt-3'>
                <a
                  href='/contact'
                  className='inline-flex items-center gap-2 text-sm text-zinc-400 underline underline-offset-2 hover:text-zinc-200'>
                  Contact
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Footer detail */}
          <div className='pt-2'>
            <Separator className='my-4 border-zinc-800' />
            <p className='text-xs text-zinc-500'>Last updated: {lastUpdated}</p>
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
