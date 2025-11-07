'use client';

import { useId, useState } from 'react';
import { Mail, User, MessageSquareText, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const formId = useId();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if ((data.get('website') as string)?.length) {
      setStatus('error');
      return;
    }
    setStatus('saving');
    setProgress(25);
    try {
      await new Promise((r) => setTimeout(r, 250));
      setProgress(60);
      await new Promise((r) => setTimeout(r, 250));
      setProgress(100);
      setStatus('saved');
      form.reset();
      setTimeout(() => setProgress(0), 600);
    } catch {
      setStatus('error');
      setProgress(0);
    }
  }

  return (
    <form onSubmit={onSubmit} className='contents' aria-describedby={`${formId}-status`}>
      <Card className='border-zinc-800 bg-zinc-950'>
        <CardHeader className='pt-6 pb-4'>
          <div className='flex items-center justify-between'>
            <CardTitle className='text-2xl font-medium text-zinc-100'>Contact</CardTitle>
            <Badge variant='secondary' className='border border-zinc-700 bg-zinc-900 text-zinc-300'>
              {status === 'saving' ? 'Sending' : status === 'saved' ? 'Sent' : 'Ready'}
            </Badge>
          </div>
          <p className='mt-3 text-xs text-zinc-500' id={`${formId}-status`}>
            {status === 'idle' && 'Message will be delivered securely.'}
            {status === 'saving' && 'Sending your message. Please wait.'}
            {status === 'saved' && 'Message sent. Thank you.'}
            {status === 'error' && 'Something went wrong. Try again.'}
          </p>
        </CardHeader>

        <CardContent className='text-sm'>
          {status !== 'idle' && (
            <div className='mb-6 h-1 w-full overflow-hidden rounded bg-zinc-800'>
              <div
                className='h-full bg-zinc-300 transition-[width]'
                style={{ width: `${progress}%` }}
              />
            </div>
          )}

          <div className='grid gap-4 md:grid-cols-2'>
            <div className='grid gap-2'>
              <label htmlFor={`${formId}-name`} className='text-zinc-300'>
                Name
              </label>
              <div className='flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-2'>
                <User className='size-4 text-zinc-500' />
                <Input
                  id={`${formId}-name`}
                  name='name'
                  placeholder='Your name'
                  className='border-0 bg-transparent focus-visible:ring-0'
                  required
                />
              </div>
            </div>

            <div className='grid gap-2'>
              <label htmlFor={`${formId}-email`} className='text-zinc-300'>
                Email
              </label>
              <div className='flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-2'>
                <Mail className='size-4 text-zinc-500' />
                <Input
                  id={`${formId}-email`}
                  name='email'
                  type='email'
                  inputMode='email'
                  placeholder='you@example.com'
                  className='border-0 bg-transparent focus-visible:ring-0'
                  required
                />
              </div>
            </div>
          </div>

          <div className='mt-4 grid gap-2'>
            <label htmlFor={`${formId}-message`} className='text-zinc-300'>
              Message
            </label>
            <div className='flex items-start gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-2'>
              <MessageSquareText className='mt-3 size-4 text-zinc-500' />
              <Textarea
                id={`${formId}-message`}
                name='message'
                placeholder='Write your message'
                className='min-h-[140px] border-0 bg-transparent focus-visible:ring-0'
                required
              />
            </div>
          </div>

          <div className='mt-8 flex items-center gap-3'>
            <Button
              type='submit'
              className='h-9 px-4 bg-zinc-100 text-zinc-900 hover:bg-white'
              disabled={status === 'saving'}>
              {status === 'saving' ? (
                <>
                  <Loader2 className='mr-2 size-4 animate-spin' /> Sending
                </>
              ) : (
                'Send message'
              )}
            </Button>

            <Button
              type='reset'
              variant='outline'
              className='h-9 border-zinc-600 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white'
              disabled={status === 'saving'}>
              Clear
            </Button>
          </div>

          <input
            type='text'
            name='website'
            tabIndex={-1}
            autoComplete='off'
            className='hidden'
            aria-hidden='true'
          />
        </CardContent>
      </Card>
    </form>
  );
}
