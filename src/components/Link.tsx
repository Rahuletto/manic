import { type LinkProps, Link as TSRLink } from "@tanstack/react-router";
import { type CSSProperties, useTransition } from "react";

interface ViewTransitionLinkProps extends Omit<LinkProps, "onClick"> {
  viewTransitionName?: string;
  disableViewTransition?: boolean;
  style: CSSProperties;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const Link = ({
  viewTransitionName,
  disableViewTransition = false,
  onClick,
  style,
  preload = "intent",
  preloadDelay = 50,
  resetScroll = false,
  ...linkProps
}: ViewTransitionLinkProps) => {
  const [, startTransition] = useTransition();

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);

    if (
      e.defaultPrevented ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }

    if (!disableViewTransition && document.startViewTransition) {
      e.preventDefault();

      document.startViewTransition(() => {
        startTransition(() => {
          e.currentTarget?.click();
        });
      });
    }
  };

  return (
    <TSRLink
      preload={preload}
      preloadDelay={preloadDelay}
      resetScroll={resetScroll}
      {...linkProps}
      onClick={handleNavigation}
      style={viewTransitionName ? { ...style, viewTransitionName } : style}
    />
  );
};
