import { useState, useEffect } from "react";
import { RefreshCw, Clock } from "lucide-react";

type ParsedError = {
  type: "rate_limit" | "quota" | "generic";
  message: string;
  retryAfter?: number;
  model?: string;
};

function parseError(error: Error): ParsedError {
  const message = error.message || String(error);

  if (
    message.includes("quota") ||
    message.includes("rate-limit") ||
    message.includes("exceeded")
  ) {
    const retryMatch = message.match(/retry in ([\d.]+)s/i);
    const modelMatch = message.match(/model: ([\w.-]+)/i);

    return {
      type: "quota",
      message: "Rate limit exceeded",
      retryAfter: retryMatch ? parseFloat(retryMatch[1]) : undefined,
      model: modelMatch ? modelMatch[1] : undefined,
    };
  }

  if (
    message.includes("429") ||
    message.toLowerCase().includes("too many requests")
  ) {
    return {
      type: "rate_limit",
      message: "Too many requests",
    };
  }

  return {
    type: "generic",
    message: message.length > 200 ? message.slice(0, 200) + "..." : message,
  };
}

export function ErrorDisplay({
  error,
  isLoading = false,
}: {
  error: Error;
  isLoading?: boolean;
}) {
  const parsed = parseError(error);
  const [countdown, setCountdown] = useState(
    parsed.retryAfter ? Math.ceil(parsed.retryAfter) : 0
  );

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const isQuotaError = parsed.type === "quota" || parsed.type === "rate_limit";

  return (
    <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <img
        src="/assets/icon.svg"
        className="w-5 h-5 opacity-80 shrink-0 mt-0.5"
        alt="AI"
      />
      <div className="flex-1 min-w-0">
        <div className="rounded-[20px] bg-accent/5 border border-accent/10 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-accent">
              {isQuotaError ? "Rate Limit" : "Error"}
            </span>
            {parsed.model && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-foreground/5 text-foreground/60 font-mono">
                {parsed.model}
              </span>
            )}
          </div>

          <p className="text-sm text-foreground/80 leading-relaxed">
            {isQuotaError
              ? "You've hit the API rate limit. This usually happens with free tier usage."
              : parsed.message}
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              disabled={countdown > 0 || isLoading}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                transition-all duration-300
                ${
                  countdown > 0 || isLoading
                    ? "bg-foreground/5 text-foreground/40 cursor-not-allowed"
                    : "bg-foreground text-background hover:opacity-90 active:scale-95 cursor-pointer"
                }
              `}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Retrying...</span>
                </>
              ) : countdown > 0 ? (
                <>
                  <Clock size={14} />
                  <span>Wait {countdown}s</span>
                </>
              ) : (
                <>
                  <RefreshCw size={14} />
                  <span>Retry</span>
                </>
              )}
            </button>

            {isQuotaError && (
              <a
                href="https://ai.google.dev/pricing"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-foreground/50 hover:text-foreground/80 transition-colors underline-offset-2 hover:underline"
              >
                Check API limits ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
