'use client';

import { Link2 } from 'lucide-react';

type Props = {
  href: string;
  label: string;
  itemKey: string;
  position?: string;
  className?: string;
};

export default function TrackedAmazonLink({
  href,
  label,
  itemKey,
  position = 'ingredients_list',
  className = '',
}: Props) {
  const onClick = () => {
    // Plausible
    // @ts-ignore
    window.plausible?.('Affiliate Click', {
      props: { key: itemKey, label, position },
    });
    // gtag
    // @ts-ignore
    window.gtag?.('event', 'affiliate_click', {
      event_category: 'monetization',
      event_label: `${itemKey}:${position}`,
      value: 1,
    });
  };

  return (
    <a
      href={href}
      target='_blank'
      rel='nofollow sponsored noopener'
      data-affiliate={itemKey}
      data-position={position}
      aria-label={`Buy ${label} on Amazon`}
      title={`Buy ${label} on Amazon`}
      onClick={onClick}
      className={`ml-1 inline-flex items-center gap-1 text-zinc-300 hover:text-zinc-100 underline-offset-2 hover:underline transition-colors ${className}`}>
      {label}
      <span className='sr-only'> on Amazon</span>
      <Link2 className='size-3 opacity-0 group-hover:opacity-100 transition-opacity' aria-hidden />
    </a>
  );
}
