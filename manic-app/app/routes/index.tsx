import { Link } from "manicjs";
import { useTheme } from "manicjs/theme";

export default function Home() {
  const { isDark } = useTheme();

  return (
    <main className="md:py-14 md:px-24 py-6 px-12 bg-background min-h-screen flex items-center justify-center text-foreground">
      <div
        style={{ viewTransitionName: "content" }}
        className="flex items-center justify-center flex-col gap-5"
      >
        <img
          src={isDark ? "/assets/wordmark.svg" : "/assets/wordmark-dark.svg"}
          alt="MANIC."
          className="max-md:w-96 max-sm:w-64 transition-all duration-250"
          style={{ viewTransitionName: "logo" }}
        />

        <p
          className="md:text-3xl text-xl font-semibold"
          style={{ viewTransitionName: "subtitle" }}
        >
          Stupidly heheheh, Crazy light.
        </p>

        <div className="mt-6 flex gap-6">
          <Link
            to="/build"
            className="btn-primary flex items-center justify-center"
            style={{ viewTransitionName: "linkbutton" }}
          >
            How fast? →
          </Link>
          <a
            href="/docs"
            className="btn-outline"
            style={{ viewTransitionName: "docsbutton" }}
          >
            Docs ↗
          </a>
        </div>
      </div>
    </main>
  );
}
