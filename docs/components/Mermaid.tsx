'use client';
import { useEffect, useState } from 'react';
import mermaid from 'mermaid';

export default function Mermaid({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let cancelled = false;

    const isDark = document.documentElement.classList.contains('dark');

    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'forest',
      securityLevel: 'loose',
      fontFamily: 'inherit',
      fontSize: 14,
      flowchart: {
        curve: 'step',
        padding: 20,
      },
    });

    const renderChart = async () => {
      const renderId = `mermaid-${crypto.randomUUID()}`;
      try {
        const { svg: nextSvg } = await mermaid.render(renderId, chart);
        if (!cancelled) {
          setSvg(nextSvg);
          setError(false);
        }
      } catch (err) {
        console.error('Mermaid render error:', err);
        if (!cancelled) setError(true);
      }
    };

    renderChart();

    const observer = new MutationObserver(() => {
      const currentDark = document.documentElement.classList.contains('dark');
      mermaid.initialize({
        startOnLoad: false,
        theme: currentDark ? 'dark' : 'forest',
        securityLevel: 'loose',
        fontFamily: 'inherit',
        fontSize: 14,
        flowchart: {
          curve: 'step',
          padding: 20,
        },
      });
      renderChart();
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [chart]);

  if (error) {
    return (
      <div className="flex justify-center py-6 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20 my-4">
        <span>Failed to render diagram. Check console for details.</span>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="flex justify-center py-6 bg-fd-card rounded-2xl border my-4 overflow-auto min-h-[100px]">
        <div className="animate-pulse text-fd-muted-foreground text-sm">Initializing diagram...</div>
      </div>
    );
  }

  return (
    <div className="mermaid-container my-4 overflow-x-auto rounded-2xl border border-fd-border bg-fd-card p-4">
      <div dangerouslySetInnerHTML={{ __html: svg }} />
    </div>
  );
}
