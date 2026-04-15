import { Link } from "manicjs";
import { useTheme } from "manicjs/theme";

const CONTENT_STYLE = { viewTransitionName: "content" };
const LOGO_STYLE = { viewTransitionName: "logo" };
const SUBTITLE_STYLE = { viewTransitionName: "subtitle" };
const LINKBUTTON_STYLE = { viewTransitionName: "linkbutton" };
const DOCSBUTTON_STYLE = { viewTransitionName: "docsbutton" };
const CODE_COLOR = { color: "#E96464" };

function BuildHeader({ isDark }: { isDark: boolean }) {
  return (
    <>
      <img
        src={isDark ? "/assets/wordmark.svg" : "/assets/wordmark-dark.svg"}
        alt="MANIC."
        className="w-84 max-sm:w-64 transition-all duration-250"
        style={LOGO_STYLE}
      />

      <p
        className="text-xl font-medium"
        style={SUBTITLE_STYLE}
      >
        I mean, try building it?
      </p>
    </>
  );
}

function BuildCommands() {
  return (
    <div className="flex items-center select-none justify-center gap-4 flex-wrap">
      <code className="border-box my-4 px-4 py-2">
        <span className="font-semibold" style={CODE_COLOR}>
          bun
        </span>{" "}
        run build
      </code>
      <span>(or)</span>
      <code className="border-box my-4 px-4 py-2">
        <span className="font-semibold" style={CODE_COLOR}>
          manic
        </span>{" "}
        build
      </code>
    </div>
  );
}

function BuildFooter() {
  return (
    <div className="mt-6 flex gap-6">
      <Link
        to="/"
        className="btn-primary flex items-center justify-center"
        style={LINKBUTTON_STYLE}
      >
        ← Go back
      </Link>
      <a
        href="/docs"
        className="btn-outline"
        style={DOCSBUTTON_STYLE}
      >
        Docs ↗
      </a>
    </div>
  );
}

export default function Build() {
  const { isDark } = useTheme();

  return (
    <main className="md:py-14 md:px-24 py-6 px-12 bg-background min-h-screen flex items-center justify-center text-foreground">
      <div
        style={CONTENT_STYLE}
        className="flex items-center justify-center flex-col gap-5"
      >
        <BuildHeader isDark={isDark} />
        <BuildCommands />
        <BuildFooter />
      </div>
    </main>
  );
}
