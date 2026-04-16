import { Link } from 'manicjs';
import { useTheme } from 'manicjs/theme';
import { useState } from 'react';

export default function Home() {
  const { isDark } = useTheme();
  const [state, setState] = useState(0);

  return (
    <main className="md:py-14 md:px-24 py-6 px-12 bg-background min-h-screen flex items-center justify-center text-foreground">
      <div
        style={{ viewTransitionName: 'content' }}
        className="flex items-center justify-center flex-col gap-5"
      >
        <img
          src={isDark ? '/assets/wordmark.svg' : '/assets/wordmark-dark.svg'}
          alt="MANIC."
          className="max-md:w-96 max-sm:w-64 transition-all duration-250"
          style={{ viewTransitionName: 'logo' }}
        />

        <p
          className="md:text-3xl text-xl font-semibold"
          style={{ viewTransitionName: 'subtitle' }}
        >
          Godspeed, with bun and oxc toolkit
        </p>

        <div className="mt-6 flex gap-6">
          <Link
            to="/build"
            className="btn-primary flex items-center justify-center"
            style={{ viewTransitionName: 'linkbutton' }}
          >
            How fast? →
          </Link>
          <a
            href="/docs"
            className="btn-outline"
            style={{ viewTransitionName: 'docsbutton' }}
          >
            Docs ↗
          </a>
        </div>

        <button
          className="btn-outline px-4 py-2"
          onClick={() => setState(state + 1)}
        >
          {state}
        </button>
      </div>
    </main>
  );
}
