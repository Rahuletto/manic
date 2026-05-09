import { gitConfig } from '@/lib/shared';
import Link from 'next/link';

const licenseUrl = `${gitConfig.protocol}://${gitConfig.hostname}/${gitConfig.user}/${gitConfig.repo}/blob/${gitConfig.branch}/LICENSE`;

export function FreeOpenSourceSection() {
  return (
    <section className="border-b border-fd-border bg-fd-muted/30">
      <div className="mx-auto max-w-6xl px-6 py-12 md:px-8 md:py-16">
        <h2 className="text-2xl md:text-3xl font-semibold text-fd-foreground">
          Free & open source
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-fd-muted-foreground max-w-2xl">
          Manic will always be free and open source, under the{' '}
          <Link
            href={licenseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            GNU General Public License v3.0 (GPL-3.0)
          </Link>
          . This is made possible by our contributors.
        </p>
        <Link
          href={`${gitConfig.protocol}://${gitConfig.hostname}/${gitConfig.user}/${gitConfig.repo}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex mt-6 min-h-10 cursor-pointer items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-fd-background rounded-full bg-primary px-6 py-3 text-background hover:bg-primary/90"
        >
          Contribute
        </Link>
      </div>
    </section>
  );
}
