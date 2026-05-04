'use client';

import {
  FrameworkProvider,
  type ImageProps as FumadocsImageProps,
} from 'fumadocs-core/framework';
import { RootProvider as FumadocsRootProvider } from 'fumadocs-ui/provider/base';
import Image, { type ImageProps as NextImageProps } from 'next/image';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { ThemeWatcher } from '@/components/layout/ThemeWatcher';
import type { ComponentProps, FC, ReactNode } from 'react';

type FumadocsLinkProps = ComponentProps<'a'> & { prefetch?: boolean };

/** Adapts fumadocs framework image props (img-based) to Next.js `Image`. */
const FrameworkImage: FC<FumadocsImageProps> = ({ src, alt = '', ...rest }) => {
  if (src == null) return null;
  return <Image {...({ src, alt, ...rest } as NextImageProps)} />;
};

/** Bridges optional `href` on anchors to Next `Link`, which requires a URL when used. */
const FrameworkLink: FC<FumadocsLinkProps> = ({ href, prefetch, ...rest }) => {
  if (href == null || href === '') {
    return <a {...rest} />;
  }
  return <Link href={href} prefetch={prefetch} {...rest} />;
};

/**
 * Inline framework wiring (same as fumadocs-ui/provider/next) so Vinext/Vite does not
 * pre-bundle a second copy of fumadocs-core/framework — that breaks React context for
 * DocsLayout + MDX.
 */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <FrameworkProvider
      Image={FrameworkImage}
      Link={FrameworkLink}
      useParams={useParams}
      usePathname={usePathname}
      useRouter={useRouter}
    >
      <FumadocsRootProvider>
        {children}
        <ThemeWatcher />
      </FumadocsRootProvider>
    </FrameworkProvider>
  );
}
