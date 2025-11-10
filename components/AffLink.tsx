'use client';

import { Link2, ShoppingCart, Disc, Store, Truck, Boxes, Leaf } from 'lucide-react';
import { buildAffiliateUrl, type AffItem } from '@/lib/affiliates';

type Props = {
  item: AffItem;
  label?: string;
  className?: string;
  position?: string; // analytics placement
  variant?: 'text' | 'button' | 'chip';
  iconOnly?: boolean; // icon only with SR text
  withIcon?: boolean; // icon + text
};

function cx(...a: (string | false | undefined)[]) {
  return a.filter(Boolean).join(' ');
}

// Hostname -> icon map using stable Lucide exports
function vendorIcon(host: string) {
  const h = host.toLowerCase();
  if (h.includes('amazon')) return { Icon: ShoppingCart, title: 'Amazon' };
  if (h.includes('target')) return { Icon: Disc, title: 'Target' };
  if (h.includes('walmart')) return { Icon: Store, title: 'Walmart' };
  if (h.includes('instacart')) return { Icon: Truck, title: 'Instacart' };
  if (h.includes('costco')) return { Icon: Boxes, title: 'Costco' };
  if (h.includes('wholefoods') || h.includes('whole-foods') || h.includes('wholefood'))
    return { Icon: Leaf, title: 'Whole Foods' };
  return { Icon: Link2, title: 'Shop link' };
}

export function AffLink({
  item,
  label,
  className = '',
  position = 'inline',
  variant = 'text',
  iconOnly = false,
  withIcon,
}: Props) {
  const href = buildAffiliateUrl(item);

  const showIconWithText = withIcon ?? variant === 'chip';

  let host = '';
  try {
    host = new URL(href).host;
  } catch {
    host = '';
  }
  const { Icon, title: vendorName } = vendorIcon(host);

  const base =
    'inline-flex items-center gap-1 rounded-sm focus:outline-none focus:ring-1 focus:ring-zinc-600 transition-colors';
  const styles =
    variant === 'button'
      ? 'px-2 py-1 text-xs bg-zinc-200 text-zinc-900 hover:bg-white'
      : variant === 'chip'
      ? 'px-2 py-1 text-[11px] border border-zinc-700 text-zinc-200 hover:border-zinc-500'
      : 'text-xs text-zinc-400 underline-offset-2 hover:underline hover:text-zinc-200';

  const text = label ?? item.label ?? 'Buy';

  const onClick = () => {
    // optional analytics if present
    // @ts-ignore
    window.plausible?.('Affiliate Click', {
      props: { key: item.key, label: text, vendor: vendorName, position },
    });
    // @ts-ignore
    window.gtag?.('event', 'affiliate_click', {
      event_category: 'monetization',
      event_label: `${item.key}:${position}:${vendorName}`,
      value: 1,
    });
  };

  return (
    <a
      href={href}
      target='_blank'
      rel='nofollow sponsored noopener'
      data-affiliate={item.key}
      data-position={position}
      aria-label={text}
      title={text}
      onClick={onClick}
      className={cx(base, styles, className)}>
      {iconOnly ? (
        <>
          <Icon className='size-3.5' aria-hidden />
          <span className='sr-only'>{text}</span>
        </>
      ) : (
        <>
          {showIconWithText && <Icon className='size-3.5' aria-hidden />}
          <span>{text}</span>
        </>
      )}
    </a>
  );
}
