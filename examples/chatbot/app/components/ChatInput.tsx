import { ArrowUp, SlidersHorizontal, Square } from "lucide-react";
import { ViewTransitions } from "manicjs";
import { useState } from "react";
import { ChatActionsPopup, type ContextSettings } from "./ChatActionsPopup";

type Model = { id: string; name: string };

export function ChatInput({
  textareaRef,
  handleInput,
  models,
  currentModel,
  onModelSelect,
  value,
  isLoading,
  onSubmit,
  onStop,
  contextSettings,
  onContextChange,
}: {
  textareaRef: React.Ref<HTMLTextAreaElement>;
  handleInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  models: Model[];
  currentModel: string;
  onModelSelect: (modelId: string) => void;
  value?: string;
  isLoading?: boolean;
  onSubmit?: (e?: React.FormEvent) => void;
  onStop?: () => void;
  contextSettings: ContextSettings;
  onContextChange: (settings: ContextSettings) => void;
}) {
  const [showActions, setShowActions] = useState(false);

  const hasContent = (value?.trim().length ?? 0) > 0;
  const isDisabled = !hasContent && !isLoading;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit?.();
    }
  };

  return (
    <ViewTransitions.div
      name="input"
      className="flex items-end justify-center gap-3"
    >
      <div
        className="
            relative flex flex-col justify-end gap-2 w-full
            p-2
            rounded-[28px]
            bg-background-subtle
            transition-all duration-500 ease-out-expo
            group
          "
      >
        <div className="flex items-end gap-2 w-full">
          <div className="relative">
            {showActions && (
              <ChatActionsPopup
                models={models}
                currentModel={currentModel}
                onModelSelect={(id) => {
                  onModelSelect(id);
                  setShowActions(false);
                }}
                contextSettings={contextSettings}
                onContextChange={onContextChange}
              />
            )}
            <button
              type="button"
              onClick={() => setShowActions(!showActions)}
              className={`
                flex items-center justify-center
                w-10 h-10 rounded-full
                hover:text-foreground
                active:bg-foreground/10
                cursor-pointer
                transition-all duration-200
                ${
                  showActions
                    ? "bg-foreground/20 text-foreground"
                    : "text-foreground/80 bg-foreground/10"
                }
              `}
            >
              <SlidersHorizontal size={18} strokeWidth={2} />
            </button>
          </div>

          <textarea
            ref={textareaRef}
            rows={1}
            value={value}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything..."
            className="
              flex-1
              min-h-[38px]
              max-h-[140px]
              p-2
              bg-transparent
              outline-none
              text-base text-foreground font-medium
              placeholder:text-foreground-muted/60
              resize-none
              leading-relaxed
            "
          />
        </div>
      </div>

      <button
        type="button"
        onClick={isLoading ? onStop : () => onSubmit?.()}
        disabled={isDisabled}
        className={`
                flex items-center justify-center
                w-12 h-12 min-w-12 min-h-12 rounded-full
                transition-all duration-300 ease-out-expo
                shadow-sm
                mb-1
                ${
                  isLoading
                    ? "bg-accent text-white hover:opacity-90 hover:scale-105 active:scale-95 cursor-pointer"
                    : isDisabled
                    ? "bg-foreground/20 text-foreground/40 cursor-not-allowed"
                    : "bg-foreground text-background hover:opacity-90 hover:scale-105 active:scale-95 cursor-pointer"
                }
              `}
      >
        {isLoading ? (
          <Square size={16} fill="currentColor" strokeWidth={3} />
        ) : (
          <ArrowUp size={22} />
        )}
      </button>
    </ViewTransitions.div>
  );
}
