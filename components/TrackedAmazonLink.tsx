'use client';

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
    // @ts-ignore
    window.plausible?.('Affiliate Click', { props: { key: itemKey, label, position } });
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
      className={`ml-1 underline-offset-2 hover:underline text-zinc-300 hover:text-zinc-100 ${className}`}>
      {label}
      <span className='sr-only'> on Amazon</span>
    </a>
  );
}
