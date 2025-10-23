import "../styles/devtools.css";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : require("@tanstack/react-router-devtools").TanStackRouterDevtools;

export const Devtools = () => {
  return (
    <>
      {process.env.NODE_ENV !== "production" && (
        <>
          <TanStackRouterDevtools position="bottom-right" />
          <button
            name="router-devtools"
            aria-label="router-devtools"
            type="button"
            className="fixed right-5 bottom-5 border-1 group transition-all duration-200 border-foreground/20 bg-foreground/10 backdrop-blur-md w-[50px] h-[50px] rounded-full flex items-center justify-center cursor-pointer"
            onClick={() => {
              (
                document.querySelector(
                  "button.go1767807125",
                )! as HTMLButtonElement
              ).click();
            }}
          >
            <div className="p-0.5 border-2 border-foreground  rounded-full flex-col flex items-center justify-center gap-0.5">
              <div className="w-1 h-1 bg-foreground rounded-full group-hover:bg-accent transition-all duration-100" />
              <div className="w-1 h-1 bg-foreground rounded-full group-hover:bg-accent transition-all duration-400" />
              <div className="w-1 h-1 bg-foreground rounded-full group-hover:bg-accent transition-all duration-600" />
            </div>
          </button>
        </>
      )}
    </>
  );
};
