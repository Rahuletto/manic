import { useChat } from "@ai-sdk/react";
import { Streamdown } from "streamdown";
import { useTheme, ThemeToggle } from "manicjs/theme";
import { useState, useEffect, useRef } from "react";
import { DefaultChatTransport } from "ai";
import { Sun, MoonStar, ChevronDown } from "lucide-react";
import { Link, ViewTransitions } from "manicjs";
import { ChatInput } from "../components/ChatInput";
import { type ContextSettings } from "../components/ChatActionsPopup";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { LoadingIndicator } from "../components/LoadingIndicator";

const SUGGESTIONS = [
  {
    title: "What is Manic?",
    subtitle: "Learn about this framework",
    text: "What is ManicJS and what makes it different from Next.js or Vite?",
  },
  {
    title: "Performance",
    subtitle: "See the benchmarks",
    text: "Show me how Manic compares to other frameworks in terms of build time and dev server startup.",
  },
  {
    title: "File-based Routing",
    subtitle: "Understand the conventions",
    text: "How does file-based routing work in Manic? Explain the route conventions.",
  },
  {
    title: "API Routes",
    subtitle: "Build your backend",
    text: "How do I create API routes in ManicJS with Elysia?",
  },
];

const MODELS = [
  { id: "gemini-2.5-flash-lite", name: "Gemini 2.5 Flash Lite" },
  { id: "gemini-2.5-flash", name: "Gemini 2.5 Flash" },
  { id: "gemini-2.5-pro", name: "Gemini 2.5 Pro" },
  { id: "gemini-3-flash-preview", name: "Gemini 3 Flash" },
  { id: "gemini-3-pro-preview", name: "Gemini 3 Pro" },
];

export default function Chatbot() {
  const { isDark } = useTheme();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [currentModel, setCurrentModel] = useState(MODELS[0].id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [contextSettings, setContextSettings] = useState<ContextSettings>({
    manicDocs: true,
    benchmarks: true,
  });

  const { messages, setMessages, sendMessage, status, stop, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { model: currentModel, context: contextSettings },
    }),
  });

  const [input, setInput] = useState("");
  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    const saved = localStorage.getItem("chat_messages");
    if (saved) {
      try {
        setMessages(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem("chat_messages", JSON.stringify(messages));
    }
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const target = e.target;
    target.style.height = "auto";
    target.style.height = `${target.scrollHeight}px`;
  };

  const onSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const currentInput = input;
    setInput("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.focus();
    }

    await sendMessage({
      text: currentInput,
    });
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
    if (textareaRef.current) {
      textareaRef.current.focus();
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.style.height = "auto";
          textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
        }
      }, 0);
    }
  };

  return (
    <main className="min-h-screen relative flex flex-col">
      <header className="fixed top-0 left-0 right-0 flex items-center justify-between w-full px-12 py-6 z-50 bg-background/80 backdrop-blur-md">
        <Link to="/">
          <ViewTransitions.div name="logo">
            <img
              src={
                isDark ? "/assets/wordmark.svg" : "/assets/wordmark-dark.svg"
              }
              alt="Wordmark"
              className="h-6 opacity-80 hover:opacity-100 transition-opacity"
            />
          </ViewTransitions.div>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              setMessages([]);
              localStorage.removeItem("chat_messages");
            }}
            className="text-foreground/40 hover:text-foreground/80 transition-colors text-xs font-medium px-3 py-1.5 rounded-full hover:bg-foreground/5"
            title="Clear Chat History"
          >
            Clear History
          </button>
          <ThemeToggle className="active:-rotate-16 transition-transform cursor-pointer">
            {(theme) =>
              theme === "dark" ? <Sun size={20} /> : <MoonStar size={20} />
            }
          </ThemeToggle>
        </div>
      </header>

      <div className="flex-1 w-full max-w-4xl mx-auto pt-24 pb-48 px-4 flex flex-col">
        {messages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center gap-6 mb-12 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
              <ViewTransitions.div name="icon">
                <img
                  src="/assets/icon.svg"
                  className="w-12 h-12"
                  alt="App Icon"
                />
              </ViewTransitions.div>

              <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight">
                How can I help you today?
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 fill-mode-backwards">
              {SUGGESTIONS.map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleSuggestionClick(item.text)}
                  className="group flex flex-col gap-1 p-6 py-5 rounded-[28px] bg-foreground/5 hover:bg-foreground/10 border border-transparent hover:border-foreground/5 transition-all duration-300 text-left cursor-pointer"
                >
                  <h3 className="font-semibold text-foreground text-lg">
                    {item.title}
                  </h3>
                  <p className="text-sm text-foreground/60 font-medium">
                    {item.subtitle}
                  </p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 w-full max-w-4xl mx-auto">
            {messages.map((m, index) => {
              const isLastAssistantMessage =
                m.role === "assistant" && index === messages.length - 1;

              const textContent =
                m.parts
                  ?.filter((p) => p.type === "text")
                  .map((p: any) => p.text)
                  .join("") ||
                m.content ||
                "";

              const reasoningContent =
                m.parts
                  ?.filter((p) => p.type === "reasoning")
                  .map((p) => {
                    const rp = p as {
                      type: "reasoning";
                      text?: string;
                      reasoning?: string;
                    };
                    return rp.text || rp.reasoning || "";
                  })
                  .join("") || "";

              return (
                <div
                  key={m.id}
                  className={`flex gap-4 ${
                    m.role === "user" ? "flex-row-reverse" : "flex-row"
                  } animate-in fade-in slide-in-from-bottom-2 duration-300`}
                >
                  {m.role !== "user" && (
                    <img
                      src="/assets/icon.svg"
                      className="w-5 h-5 opacity-80"
                      alt="AI"
                    />
                  )}
                  <div
                    className={`flex flex-col gap-1 min-w-0 max-w-[85%] ${
                      m.role === "user" ? "items-end" : "items-start"
                    }`}
                  >
                    {m.role === "assistant" && reasoningContent && (
                      <details
                        className="group w-full mb-2"
                        open={isLastAssistantMessage && isLoading}
                      >
                        <summary className="flex items-center gap-1.5 cursor-pointer text-sm text-foreground/50 hover:text-foreground/70 transition-colors select-none">
                          <ChevronDown
                            size={14}
                            className="transition-transform group-open:rotate-180"
                          />
                          <span>Thinking</span>
                        </summary>
                        <div className="mt-2 p-3 rounded-lg bg-foreground/5 text-sm text-foreground/70 max-h-[200px] overflow-y-auto">
                          <Streamdown
                            isAnimating={isLoading && isLastAssistantMessage}
                          >
                            {reasoningContent}
                          </Streamdown>
                        </div>
                      </details>
                    )}
                    <div
                      className={`prose dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 prose-pre:bg-transparent max-w-full overflow-hidden ${
                        m.role === "user"
                          ? "bg-foreground/5 max-w-lg text-foreground px-4 py-2.5 rounded-[20px] rounded-tr-sm"
                          : "py-1"
                      }`}
                    >
                      {m.role === "user" ? (
                        <div>{textContent}</div>
                      ) : (
                        <Streamdown
                          isAnimating={isLoading && isLastAssistantMessage}
                        >
                          {textContent}
                        </Streamdown>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {status === "submitted" && <LoadingIndicator />}

            {error && <ErrorDisplay error={error} isLoading={isLoading} />}

            <div ref={messagesEndRef} className="h-4" />
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto fixed bottom-8 left-0 right-0 z-50 px-4">
        <ChatInput
          textareaRef={textareaRef}
          handleInput={handleInput}
          value={input}
          isLoading={isLoading}
          onSubmit={onSubmit}
          onStop={stop}
          models={MODELS}
          currentModel={currentModel}
          onModelSelect={setCurrentModel}
          contextSettings={contextSettings}
          onContextChange={setContextSettings}
        />
      </div>
      <div className="w-screen fixed bottom-0 h-32 bg-linear-to-b from-transparent via-background/80 to-background" />
    </main>
  );
}
