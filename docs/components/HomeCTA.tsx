import { cn } from '@/lib/cn';
import Link from 'next/link';

interface HomeCTAProps {
  variant?: 'outline' | 'solid';
}

export function HomeCTA({ variant = 'outline' }: HomeCTAProps) {
  return (
    <Link
      href="/docs/framework/getting-started"
      className={cn(
        'inline-flex min-h-11 cursor-pointer items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-fd-background',
        variant === 'solid'
          ? 'rounded-full bg-primary px-8 py-3.5 text-background hover:bg-primary/90'
          : 'rounded-full bg-primary px-8 py-3.5 text-background hover:bg-primary/90',
      )}
    >
      Get Started
    </Link>
  );
}
