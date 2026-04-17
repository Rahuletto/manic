import { Link } from 'manicjs';
import { useTheme } from 'manicjs/theme';
import { useState, useCallback } from 'react';

const CONTENT_STYLE = { viewTransitionName: 'content' };
const LOGO_STYLE = { viewTransitionName: 'logo' };
const SUBTITLE_STYLE = { viewTransitionName: 'subtitle' };
const LINKBUTTON_STYLE = { viewTransitionName: 'linkbutton' };
const DOCSBUTTON_STYLE = { viewTransitionName: 'docsbutton' };

export default function Home() {
  const { isDark } = useTheme();
  const [state, setState] = useState(0);

  const increment = useCallback(() => setState(s => s + 1), []);
  const decrement = useCallback(() => setState(s => s - 1), []);

  return (
    <main className="py-32 md:px-24 px-12 mx-auto flex items-start justify-center gap-32 flex-col max-w-screen-lg min-h-screen text-foreground">

        <div className="flex gap-6 flex-col">
          <img
            src={isDark ? '/assets/wordmark.svg' : '/assets/wordmark-dark.svg'}
            alt="MANIC."
            className="max-md:w-54 max-sm:w-54 transition-all duration-250"
            style={LOGO_STYLE}
          />

          <p className="md:text-2xl text-xl font-medium" style={SUBTITLE_STYLE}>
            Stupidly fast, Crazy light React framework.
          </p>
        </div>

        <div className="flex flex-col gap-5">
          <p className="text-foreground text-lg max-w-[500px]">
            To get started, edit the <code className="px-1 py-0.5 bg-white/5 rounded-md text-accent">routes/index.tsx</code> file and see the speed of the HMR.
          </p>
          <div className="flex items-center w-44 overflow-hidden border-2 border-foreground/10 rounded-xl">
            <button
              onClick={decrement}
              className="flex items-center justify-center px-4 py-2 shrink-0 opacity-70 border-r-2 border-foreground/20"
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
              className="flex items-center justify-center px-4 py-2 shrink-0 opacity-70 border-l-2 border-foreground/20"
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

        <div className="mt-6 flex gap-6 md:flex-row flex-col items-start">
          <Link
            to="/build"
            className="btn-primary flex items-center justify-center"
            style={LINKBUTTON_STYLE}
          >
            How fast? →
          </Link>
          <Link
            to="/build"
            className="btn-secondary flex items-center justify-center"
            style={LINKBUTTON_STYLE}
          >
            Documentation
          </Link>
        </div>

    </main>
  );
}
