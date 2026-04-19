'use client';
import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

/**
 * Robust Mermaid diagram renderer for Fumadocs.
 * Uses mermaid.render to generate SVGs and inject them into the DOM.
 */
export default function Mermaid({ chart }: { chart: string }) {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const id = useRef(`mermaid-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    // Detect dark mode from the document
    const isDark = document.documentElement.classList.contains('dark');
    
    mermaid.initialize({
      startOnLoad: false,
      theme: isDark ? 'dark' : 'default',
      securityLevel: 'loose',
      fontFamily: 'inherit',
      fontSize: 14,
      flowchart: {
        curve: 'stepAfter',
        padding: 20,
      },
    });

    const renderChart = async () => {
      try {
        const { svg } = await mermaid.render(id.current, chart);
        setSvg(svg);
        setError(false);
      } catch (err) {
        console.error('Mermaid render error:', err);
        setError(true);
      }
    };

    renderChart();

    // Re-render when theme changes (MutationObserver on html class)
    const observer = new MutationObserver(() => {
      const currentDark = document.documentElement.classList.contains('dark');
      mermaid.initialize({
        startOnLoad: false,
        theme: currentDark ? 'dark' : 'default',
      });
      renderChart();
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
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
    <div 
      className="mermaid-container flex justify-center py-6 bg-fd-card rounded-2xl border my-4 overflow-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
