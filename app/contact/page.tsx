import { Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import ContactForm from './ContactForm';

export const metadata = {
  title: 'Contact | RECIPE.SYSTEM',
  description: 'Contact RECIPE.SYSTEM. Simple form, fast response.',
};

export default function ContactPage() {
  const lastUpdated = new Date().toLocaleDateString();

  return (
    <main className='mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-12 md:grid-cols-[1fr_320px]'>
      {/* Left: form (client) */}
      <ContactForm />

      {/* Right: sidebar (server-safe, no hooks) */}
      <aside className='top-24 hidden md:block'>
        <Card className='sticky border-zinc-800 bg-zinc-950 p-0'>
          <CardHeader className='pb-0'>
            <CardTitle className='text-sm font-semibold text-zinc-200 pt-9'>Info</CardTitle>
          </CardHeader>
          <CardContent className='pb-3'>
            <div className='space-y-3 text-xs text-zinc-400'>
              <div className='rounded-lg border border-zinc-800 bg-zinc-950 p-3'>
                <div className='mb-1 flex items-center gap-2'>
                  <Shield className='size-3.5 text-zinc-500' />
                  <span className='font-medium text-zinc-300'>Privacy</span>
                </div>
                <p>We store as little data as possible. See the policy for details.</p>
                <a
                  href='/privacy'
                  className='mt-2 inline-block text-zinc-300 underline underline-offset-2 hover:text-zinc-100'>
                  View privacy policy
                </a>
              </div>

              <Separator className='bg-zinc-800' />

              <div className='rounded-lg border border-zinc-800 bg-zinc-950 p-3'>
                <div className='mb-1 flex items-center gap-2'>
                  <Shield className='size-3.5 text-zinc-500' />
                  <span className='font-medium text-zinc-300'>Status</span>
                </div>
                <p className='mb-2'>
                  Messages are delivered securely. You will get a confirmation on success.
                </p>
                <Badge
                  variant='secondary'
                  className='border border-zinc-700 bg-zinc-900 text-zinc-300'>
                  Operational
                </Badge>
                <p className='mt-3 text-[10px] text-zinc-500'>Last updated: {lastUpdated}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </aside>
    </main>
  );
}
