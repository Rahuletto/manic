'use client';
import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

/**
 * Mermaid diagram renderer for Fumadocs.
 * Uses client-side rendering to avoid hydration issues with generated SVGs.
 */
export default function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize mermaid with dark mode support
    mermaid.initialize({
      startOnLoad: true,
      theme: 'dark',
      securityLevel: 'loose',
      fontFamily: 'inherit',
    });
    
    // Trigger re-render of the chart
    if (ref.current) {
      mermaid.contentLoaded();
    }
  }, [chart]);

  return (
    <div className="mermaid flex justify-center py-6 bg-fd-card rounded-xl border my-4 overflow-auto" suppressHydrationWarning>
      <pre ref={ref} className="text-sm" suppressHydrationWarning>
        {chart}
      </pre>
    </div>
  );
}
