'use client';

import { Check, Copy } from 'lucide-react';
import { useCallback, useState } from 'react';

const COMMAND = 'bun create manic my-app';

interface CopyInstallCommandProps {
  /** Window chrome + glow — home hero only. */
  variant?: 'default' | 'showcase';
}

export function CopyInstallCommand({ variant = 'default' }: CopyInstallCommandProps) {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(COMMAND);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, []);

  const isShowcase = variant === 'showcase';

  return (
    <div
      className={
        isShowcase
          ? 'home-showcase-shell relative w-full max-w-xl overflow-hidden rounded-2xl border border-primary/25 bg-fd-card/40 shadow-[0_0_60px_-12px_rgba(241,81,86,0.35)] backdrop-blur-xl'
          : undefined
      }
    >
      {isShowcase ? (
        <div className="flex items-center gap-2 border-b border-fd-border/80 bg-fd-muted/30 px-4 py-2.5">
          <span className="flex gap-1.5" aria-hidden>
            <span className="size-3 rounded-full bg-[#ff5f57]" />
            <span className="size-3 rounded-full bg-[#febc2e]" />
            <span className="size-3 rounded-full bg-[#28c840]" />
          </span>
          <span className="font-mono text-[11px] uppercase tracking-widest text-fd-muted-foreground">
            ~/projects — bun
          </span>
        </div>
      ) : null}
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? 'Copied to clipboard' : 'Copy install command to clipboard'}
        className={
          isShowcase
            ? 'group flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-4 text-left font-mono text-sm text-fd-foreground transition-colors duration-200 hover:bg-fd-muted/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary md:text-base'
            : 'group flex w-full max-w-xl cursor-pointer items-center justify-between gap-3 rounded-xl border border-fd-border bg-fd-card/60 px-4 py-3 text-left font-mono text-sm text-fd-foreground shadow-sm backdrop-blur transition-colors duration-200 hover:border-primary/50 hover:bg-fd-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-fd-background md:text-base'
        }
      >
        <code className="min-w-0 flex-1 truncate">
          {isShowcase ? (
            <>
              <span className="mr-2 text-primary">$</span>
              {COMMAND}
            </>
          ) : (
            COMMAND
          )}
        </code>
        <span
          className={
            isShowcase
              ? 'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-fd-border/80 bg-fd-background/80 text-fd-muted-foreground transition-colors group-hover:border-primary/50 group-hover:text-primary'
              : 'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-fd-border bg-fd-muted/30 text-fd-muted-foreground transition-colors group-hover:border-primary/40 group-hover:text-primary'
          }
        >
          {copied ? <Check className="size-4" strokeWidth={2.25} aria-hidden /> : <Copy className="size-4" strokeWidth={2.25} aria-hidden />}
        </span>
      </button>
    </div>
  );
}
