'use client';

import { useCallback, useState } from 'react';

export default function Counter() {
  const [state, setState] = useState(0);

  const increment = useCallback(() => setState(s => s + 1), []);
  const decrement = useCallback(() => setState(s => s - 1), []);

  return (
    <div className="flex flex-col gap-5">
      <p className="text-foreground text-lg max-w-[500px]">
        To get started, edit the{' '}
        <code className="px-1 py-0.5 bg-white/5 rounded-md text-accent">
          routes/index.tsx
        </code>{' '}
        file and see the speed of the HMR.
      </p>
      <div className="flex items-center w-44 overflow-hidden border-2 border-foreground/10 rounded-xl">
        <button
          onClick={decrement}
          className="flex items-center justify-center px-4 py-2 shrink-0 opacity-70 border-r-2 border-foreground/20 hover:bg-foreground/5 transition-colors"
          aria-label="Decrease counter"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4"
            />
          </svg>
        </button>

        <span className="flex-1 min-w-0 px-2 py-2 text-2xl font-bold text-center truncate">
          {state}
        </span>

        <button
          onClick={increment}
          className="flex items-center justify-center px-4 py-2 shrink-0 opacity-70 border-l-2 border-foreground/20 hover:bg-foreground/5 transition-colors"
          aria-label="Increase counter"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
