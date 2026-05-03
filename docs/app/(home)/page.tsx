import { CopyInstallCommand } from '@/components/CopyInstallCommand';
import { HomeCTA } from '@/components/HomeCTA';
import { FreeOpenSourceSection } from '@/components/FreeOpenSourceSection';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';
import { gitConfig } from '@/lib/shared';
import { ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

const githubRepo = `https://github.com/${gitConfig.user}/${gitConfig.repo}`;

export const metadata: Metadata = {
  title: 'Manic — Bun-native React framework',
  description:
    'High-performance, production-grade React framework built on Bun with file-based routing, colocated APIs, and custom OXC-powered bundler.',
  openGraph: {
    title: 'Manic — Bun-native React framework',
    description: 'High-performance React framework for Bun. File routes, APIs, plugins, benchmarks.',
    images: [
      {
        url: '/pics/banner.png',
        width: 1600,
        height: 320,
        alt: 'Manic',
      },
    ],
  },
};

const HERO_BANNER = '/pics/banner.png' as const;

const STATS = [
  { value: '~20ms', label: 'Dev startup' },
  { value: '~400ms', label: 'Build time' },
  { value: '<20%', label: 'Chunk size vs competitors' },
] as const;

const DOCS_LINKS = [
  { href: '/docs/framework', label: 'Framework', desc: 'Install, routing, server, APIs, plugins, deploy.' },
  { href: '/docs/api', label: 'API reference', desc: 'Router, config, server, theme.' },
  { href: '/docs/cli', label: 'CLI', desc: 'dev, build, start, deploy, lint, fmt.' },
  { href: '/docs/core', label: 'Core', desc: 'How the engine fits together.' },
] as const;

const FEATURES: Array<{
  title: string;
  body: string;
  image: { src: string; alt: string } | null;
}> = [
  {
    title: 'Lightning-fast dev server',
    body: 'bun dev starts in ~20ms. Instant feedback during development with Bun\'s native bundler performance.',
    image: { src: '/pics/startup.png', alt: 'Terminal showing the Manic dev server starting.' },
  },
  {
    title: 'Unified toolchain',
    body: 'Same tools and configuration for dev and production. No surprises between environments.',
    image: { src: '/pics/hmr.png', alt: 'Development workflow with fast refresh.' },
  },
  {
    title: 'Fullstack routes',
    body: 'Colocate server and client code. Pages and API handlers in one place with automatic discovery.',
    image: { src: '/pics/fullstack.png', alt: 'Fullstack development with colocated routes and APIs.' },
  },
  {
    title: 'Production ready',
    body: 'Deploy in seconds to any platform. Optimized builds with OXC minification and code splitting.',
    image: { src: '/pics/build.png', alt: 'CLI output from a production manic build.' },
  },
  {
    title: 'MCP plugin for AI',
    body: 'Built-in Model Context Protocol support. Discoverable endpoints for agents and assistants.',
    image: null,
  },
  {
    title: 'File-based routing',
    body: 'Convention over configuration. Routes auto-discovered from your app directory structure.',
    image: { src: '/pics/file-based.png', alt: 'File-based routing structure.' },
  },
];

const GUIDE_LINKS = [
  { href: '/docs/framework/getting-started', label: 'Getting started' },
  { href: '/docs/framework/project-structure', label: 'Project structure' },
  { href: '/docs/framework/deployment', label: 'Deployment' },
  { href: '/docs/framework/plugins', label: 'Plugins' },
  { href: '/docs/framework/plugins/mcp', label: 'MCP' },
  { href: '/docs/framework/benchmarks', label: 'Benchmarks' },
  { href: '/docs/framework/routing/index', label: 'Routing' },
] as const;

const linkBase =
  'cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-fd-background';

export default function HomePage() {
  return (
    <main className="home-brand-lock flex flex-1 flex-col bg-fd-background">
      <div className="relative w-full border-b border-fd-border bg-[#1a0a0c]">
        <div className="relative aspect-[5/1] w-full min-h-[88px] max-h-[min(32vh,240px)] sm:min-h-[100px]">
          <Image
            src={HERO_BANNER}
            alt="Manic — wordmark and mark on burgundy"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
      </div>

      <section className="border-b border-fd-border">
        <div className="mx-auto max-w-3xl px-6 py-12 md:px-8 md:py-16">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-fd-muted-foreground">Documentation</p>
          <h1 className="text-2xl font-semibold tracking-tight text-fd-foreground md:text-3xl">
            <span className="sr-only">Manic — </span>
            The fastest React framework on Bun
          </h1>
          <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-fd-muted-foreground md:text-base">
            Production-grade React framework built from the ground up on Bun with a custom OXC-powered bundler, 
            <wbr />file-based routing, colocated APIs, and built-in{' '}
            <Link href="/docs/framework/plugins/mcp" className={`${linkBase} text-primary underline-offset-4 hover:underline`}>
              MCP plugin
            </Link>{' '}
            support for AI agents.
          </p>

          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-fd-muted-foreground md:text-base">
            Dev server ready in ~20ms. Production builds in ~400ms. Output bundle is 80% smaller than competitors.{' '}
            <Link href="/docs/framework/benchmarks" className={`${linkBase} text-primary underline-offset-4 hover:underline`}>
              Benchmarks
            </Link>
            .
          </p>

          <div className="mt-10 max-w-lg">
            <CopyInstallCommand />
          </div>

          <div className="mt-10 flex items-center gap-8 text-sm">
            <HomeCTA variant="solid" />
            <div className="flex gap-6">
              <Link href="/docs/framework" className={`${linkBase} text-fd-muted-foreground hover:text-fd-foreground`}>
                Docs
              </Link>
              <Link href="/docs/framework/benchmarks" className={`${linkBase} text-fd-muted-foreground hover:text-fd-foreground`}>
                Benchmarks
              </Link>
              <Link
                href={githubRepo}
                className={`${linkBase} text-fd-muted-foreground hover:text-fd-foreground`}
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-fd-border px-6 py-10 md:px-8" aria-label="Figures">
        <div className="mx-auto grid max-w-3xl grid-cols-3 gap-6 md:gap-8">
          {STATS.map(({ value, label }) => (
            <div key={label} className="min-w-0">
              <p className="font-mono text-xl font-medium tabular-nums text-fd-foreground md:text-2xl">{value}</p>
              <p className="mt-1 text-xs text-fd-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b border-fd-border px-6 py-14 md:px-8 md:py-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-sm font-medium text-fd-foreground">Documentation</h2>
          <ul className="mt-6 divide-y divide-fd-border border border-fd-border">
            {DOCS_LINKS.map(({ href, label, desc }) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`${linkBase} group flex flex-col gap-0.5 px-4 py-4 md:flex-row md:items-baseline md:justify-between md:gap-8 md:py-4`}
                >
                  <span className="text-sm font-medium text-fd-foreground">{label}</span>
                  <span className="flex flex-1 items-start justify-between gap-4 text-sm text-fd-muted-foreground md:justify-end">
                    <span className="md:text-right">{desc}</span>
                    <ArrowRight className="mt-0.5 size-4 shrink-0 text-fd-border md:mt-0" aria-hidden />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-fd-border">
        <div className="px-4 py-12 sm:px-6 md:py-16">
          <div className="mx-auto max-w-7xl px-2 sm:px-6 md:px-8">
            <h2 className="text-sm font-medium text-fd-foreground">Features</h2>
          </div>
        </div>
        <div className="grid gap-px border border-fd-border bg-fd-border grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {FEATURES.map(({ title, body, image }) => (
            <article key={title} className="bg-fd-background flex flex-col overflow-hidden">
              <div className="relative aspect-video w-full overflow-hidden border-b border-fd-border bg-fd-muted/20">
                {image ? (
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className={`object-cover ${title === 'Production ready' ? 'object-bottom' : 'object-top'}`}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    quality={100}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <span className="text-center text-xs text-fd-muted-foreground">Coming soon</span>
                  </div>
                )}
              </div>
              <div className="p-4 sm:p-6 flex-1 flex flex-col">
                <h3 className="text-sm font-medium text-fd-foreground">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fd-muted-foreground">{body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-b border-fd-border px-6 py-12 md:px-8 md:py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-sm font-medium text-fd-foreground">Guides</h2>
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            {GUIDE_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={`${linkBase} text-fd-muted-foreground underline-offset-4 hover:text-fd-foreground`}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FreeOpenSourceSection />

      <CTASection />
    </main>
  );
}
