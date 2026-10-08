"use client";

import * as React from "react";
import { scrollToSection } from "@/lib/scroll-to-section";

type SectionLinkProps = React.ComponentProps<"a"> & {
  href: string;
  /** Called before scrolling (e.g. close the mobile sheet). */
  onNavigate?: () => void;
  /** Delay scroll so overlays can close first. */
  delayMs?: number;
};

/** In-page nav link. Stays on the same page and scrolls to the matching section id. */
export function SectionLink({
  href,
  onNavigate,
  delayMs = 0,
  onClick,
  children,
  ...props
}: SectionLinkProps) {
  return (
    <a
      href={href}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        if (!href.startsWith("#")) return;

        event.preventDefault();
        onNavigate?.();

        const run = () => scrollToSection(href);
        if (delayMs > 0) {
          window.setTimeout(run, delayMs);
        } else {
          run();
        }
      }}
    >
      {children}
    </a>
  );
}
