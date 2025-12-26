import { useTheme, ThemeToggle } from "manicjs/theme";
import { useRef } from "react";
import { Sun, MoonStar, ArrowUp, SlidersHorizontal } from "lucide-react";
import { Link, ViewTransitions } from "manicjs";

export default function Landing() {
  const { isDark } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <main>
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between w-full px-12 py-6 z-50">
        <img
          src={isDark ? "/assets/wordmark.svg" : "/assets/wordmark-dark.svg"}
          alt=""
          className="h-6 opacity-0"
        />

        <ThemeToggle className="active:-rotate-16 transition-transform cursor-pointer">
          {(theme) =>
            theme === "dark" ? <Sun size={20} /> : <MoonStar size={20} />
          }
        </ThemeToggle>
      </header>

      <section className="px-22 flex items-center justify-center flex-col h-[80vh]">
        <ViewTransitions.div name="logo">
          <img
            src={isDark ? "/assets/wordmark.svg" : "/assets/wordmark-dark.svg"}
            alt="Wordmark"
            className="h-32"
          />
        </ViewTransitions.div>
        <p
          className="md:text-3xl text-xl font-semibold"
          style={{ viewTransitionName: "subtitle" }}
        >
          Stupidly fast, Crazy light.
        </p>

        <div className="flex mt-16 items-center justify-center gap-8">
          <Link
            to="/chat"
            className="btn-primary flex items-center justify-center"
          >
            Chat
          </Link>
          <a
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline flex items-center justify-center"
            href="https://github.com/rahuletto/manic/tree/main/examples"
          >
            Explore other examples ↗
          </a>
        </div>

        <Link
          to="/chat"
          className="max-w-xl w-full mx-auto fixed bottom-64 left-0 right-0 px-4"
        >
          <ViewTransitions.div
            name="input"
            className="flex items-end justify-center gap-3"
          >
            <div
              className="
            relative flex items-center justify-end gap-2 w-full
            p-2
            rounded-[28px]
            bg-background-subtle
            transition-all duration-500 ease-out-expo
            group
          "
            >
              <button
                type="button"
                className={`
                flex items-center justify-center
                w-10 h-10 rounded-full
                hover:text-foreground
                active:bg-foreground/10
                cursor-pointer
                transition-all duration-200
                text-foreground/80 bg-foreground/10
              `}
              >
                <SlidersHorizontal size={18} strokeWidth={2} />
              </button>

              <textarea
                ref={textareaRef}
                rows={1}
                readOnly
                placeholder="Ask anything..."
                className="
              flex-1
              min-h-[38px]
              max-h-[140px]
              p-1
              bg-transparent
              outline-none
              text-base text-foreground font-medium
              placeholder:text-foreground-muted/60
              resize-none
              leading-relaxed
              cursor-pointer
            "
              />
            </div>

            <button
              type="button"
              className="
                flex items-center justify-center
                w-12 h-12 min-w-12 min-h-12 rounded-full
                bg-foreground text-background
                hover:opacity-90 hover:scale-105
                active:scale-95
                transition-all duration-300 ease-out-expo
                shadow-sm cursor-pointer
              "
            >
              <ArrowUp size={22} />
            </button>
          </ViewTransitions.div>
        </Link>
      </section>
    </main>
  );
}
