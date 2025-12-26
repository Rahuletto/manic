export function LoadingIndicator() {
  return (
    <div className="flex items-start gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <img
        src="/assets/icon.svg"
        className="w-5 h-5 opacity-80 shrink-0 mt-0.5"
        alt="AI"
      />
      <div className="flex items-center gap-1 py-2">
        <span
          className="w-2 h-2 rounded-full bg-foreground/60 animate-bounce"
          style={{ animationDelay: "0ms", animationDuration: "600ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-foreground/60 animate-bounce"
          style={{ animationDelay: "150ms", animationDuration: "600ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-foreground/60 animate-bounce"
          style={{ animationDelay: "300ms", animationDuration: "600ms" }}
        />
      </div>
    </div>
  );
}
