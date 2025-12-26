import { Link } from "manicjs";
import { useTheme } from "manicjs/theme";

export default function Build() {
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
          className="w-84 max-sm:w-64 transition-all duration-250"
          style={{ viewTransitionName: "logo" }}
        />

        <p
          className="text-xl font-medium"
          style={{ viewTransitionName: "subtitle" }}
        >
          I mean, try building it?
        </p>

        <div className="flex items-center select-none justify-center gap-4 flex-wrap">
          <code className="border-box my-4 px-4 py-2">
            <span className="font-semibold" style={{ color: "#E96464" }}>
              bun
            </span>{" "}
            run build
          </code>
          <span>(or)</span>
          <code className="border-box my-4 px-4 py-2">
            <span className="font-semibold" style={{ color: "#E96464" }}>
              manic
            </span>{" "}
            build
          </code>
        </div>

        <div className="mt-6 flex gap-6">
          <Link
            to="/"
            className="btn-primary flex items-center justify-center"
            style={{ viewTransitionName: "linkbutton" }}
          >
            ← Go back
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
