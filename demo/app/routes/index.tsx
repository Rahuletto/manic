import { Link } from "manicjs";
import { useTheme } from "manicjs/theme";
import { useState, useCallback } from "react";

const CONTENT_STYLE = { viewTransitionName: "content" };
const LOGO_STYLE = { viewTransitionName: "logo" };
const SUBTITLE_STYLE = { viewTransitionName: "subtitle" };
const LINKBUTTON_STYLE = { viewTransitionName: "linkbutton" };
const DOCSBUTTON_STYLE = { viewTransitionName: "docsbutton" };

export default function Home() {
  const { isDark } = useTheme();
  const [state, setState] = useState(0);

  const increment = useCallback(() => setState((s) => s + 1), []);

  return (
    <main className="md:py-14 md:px-24 py-6 px-12 bg-background min-h-screen flex items-center justify-center text-foreground">
      <div
        style={CONTENT_STYLE}
        className="flex items-center justify-center flex-col gap-5"
      >
        <img
          src={isDark ? "/assets/wordmark.svg" : "/assets/wordmark-dark.svg"}
          alt="MANIC."
          className="max-md:w-96 max-sm:w-64 transition-all duration-250"
          style={LOGO_STYLE}
        />

        <p
          className="md:text-3xl text-xl font-semibold"
          style={SUBTITLE_STYLE}
        >
          Godspeed, with bun and oxc toolkit right?
        </p>

        <div className="mt-6 flex gap-6">
          <Link
            to="/build"
            className="btn-primary flex items-center justify-center"
            style={LINKBUTTON_STYLE}
          >
            How fast? →
          </Link>
          <a
            href="/docs"
            className="btn-outline"
            style={DOCSBUTTON_STYLE}
          >
            Docs ↗
          </a>
        </div>

        <button className="btn-outline px-4 py-2 bg" onClick={increment}>{state}</button>
      </div>
    </main>
  );
}
