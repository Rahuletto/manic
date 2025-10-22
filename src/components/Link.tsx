import {
  type LinkProps,
  Link as TSRLink,
  useNavigate,
} from "@tanstack/react-router";
import { type CSSProperties, useTransition } from "react";

interface ManicLinkProps extends LinkProps {
  viewTransitionName?: string;
  className?: string;
  disableViewTransition?: boolean;
  style?: CSSProperties;
}

export const Link = ({
  viewTransitionName,
  disableViewTransition = false,
  style,
  className,
  preload = "intent",
  preloadDelay = 50,
  resetScroll = false,
  to,
  ...linkProps
}: ManicLinkProps) => {
  const [, startTransition] = useTransition();
  const navigate = useNavigate();

  const handleNavigation = (e: React.MouseEvent<HTMLAnchorElement>) => {
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
          navigate({ to, resetScroll });
        });
      });
    }
  };

  return (
    <TSRLink
      to={to}
      preload={preload}
      preloadDelay={preloadDelay}
      resetScroll={resetScroll}
      className={className}
      {...linkProps}
      onClick={handleNavigation}
      style={viewTransitionName ? { ...style, viewTransitionName } : style}
    />
  );
};
