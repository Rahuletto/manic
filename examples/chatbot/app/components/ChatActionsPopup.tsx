import { Cpu, ChevronLeft, Check, BookOpen, Gauge } from "lucide-react";
import { useState } from "react";

type Model = { id: string; name: string };

export type ContextSettings = {
  manicDocs: boolean;
  benchmarks: boolean;
};

export function ChatActionsPopup({
  models,
  currentModel,
  onModelSelect,
  contextSettings,
  onContextChange,
}: {
  models: Model[];
  currentModel: string;
  onModelSelect: (modelId: string) => void;
  contextSettings: ContextSettings;
  onContextChange: (settings: ContextSettings) => void;
}) {
  const [view, setView] = useState<"main" | "models">("main");

  if (view === "models") {
    return (
      <div className="absolute bottom-full left-0 mb-4 w-64 p-1.5 rounded-2xl bg-background-subtle flex flex-col gap-0.5 origin-bottom-left animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 z-50 overflow-hidden">
        <div className="flex items-center gap-2 px-2 py-1.5 mb-1">
          <button
            onClick={() => setView("main")}
            className="p-1 rounded-lg hover:bg-foreground/10 transition-colors text-foreground/60 hover:text-foreground"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="text-xs font-semibold text-foreground/60 uppercase tracking-wider">
            Select Model
          </div>
        </div>
        <div className="max-h-[240px] overflow-y-auto no-scrollbar flex flex-col gap-0.5">
          {models.map((model) => (
            <button
              key={model.id}
              onClick={() => {
                onModelSelect(model.id);
                setView("main");
              }}
              className="flex items-center justify-between px-3 py-2 text-[14px] font-medium text-foreground/80 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-colors text-left group"
            >
              <span>{model.name}</span>
              {currentModel === model.id && (
                <Check size={14} className="text-color-accent" />
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute bottom-full left-0 mb-4 w-52 p-1.5 rounded-2xl bg-background-subtle flex flex-col gap-0.5 origin-bottom-left animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200 z-50">
      <button
        onClick={() => setView("models")}
        className="flex items-center gap-2.5 px-3 py-2 text-[14px] font-medium text-foreground/80 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-colors text-left group"
      >
        <Cpu
          size={16}
          className="text-foreground group-hover:text-color-accent transition-colors"
        />
        <span>Change Model</span>
      </button>

      <div className="h-px bg-foreground/10 my-1" />

      <div className="px-2 py-1">
        <div className="text-[11px] font-semibold text-foreground/40 uppercase tracking-wider mb-1">
          Context
        </div>
      </div>

      <button
        onClick={() =>
          onContextChange({
            ...contextSettings,
            manicDocs: !contextSettings.manicDocs,
          })
        }
        className="flex items-center justify-between px-3 py-2 text-[14px] font-medium text-foreground/80 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-colors text-left group"
      >
        <div className="flex items-center gap-2.5">
          <BookOpen
            size={16}
            className="text-foreground group-hover:text-color-accent transition-colors"
          />
          <span>Manic Docs</span>
        </div>
        <div
          className={`w-8 h-5 rounded-full transition-colors ${
            contextSettings.manicDocs ? "bg-accent" : "bg-foreground/20"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${
              contextSettings.manicDocs ? "translate-x-3.5" : "translate-x-0.5"
            }`}
          />
        </div>
      </button>

      <button
        onClick={() =>
          onContextChange({
            ...contextSettings,
            benchmarks: !contextSettings.benchmarks,
          })
        }
        className="flex items-center justify-between px-3 py-2 text-[14px] font-medium text-foreground/80 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-colors text-left group"
      >
        <div className="flex items-center gap-2.5">
          <Gauge
            size={16}
            className="text-foreground group-hover:text-color-accent transition-colors"
          />
          <span>Benchmarks</span>
        </div>
        <div
          className={`w-8 h-5 rounded-full transition-colors ${
            contextSettings.benchmarks ? "bg-accent" : "bg-foreground/20"
          }`}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${
              contextSettings.benchmarks ? "translate-x-3.5" : "translate-x-0.5"
            }`}
          />
        </div>
      </button>
    </div>
  );
}
