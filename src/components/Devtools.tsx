import "../styles/devtools.css";

const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null
    : require("@tanstack/react-router-devtools").TanStackRouterDevtools;

export const Devtools = () => {
  return (
    <>
      {process.env.NODE_ENV !== "production" && (
        <TanStackRouterDevtools position="bottom-right" />
      )}
      <button
        type="button"
        className="absolute right-5 bottom-5 border-1 border-foreground/20 bg-[#0e0e0ec2] backdrop-blur-md w-[50px] h-[50px] rounded-full flex items-center justify-center cursor-pointer"
        onClick={() => {
          (
            document.querySelector("button.go1767807125")! as HTMLButtonElement
          ).click();
        }}
      >
        <img alt="icon" src="/assets/icon.svg" className="w-6" />
      </button>
    </>
  );
};
