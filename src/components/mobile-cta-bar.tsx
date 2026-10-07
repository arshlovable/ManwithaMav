"use client";

import * as React from "react";
import { MessageSquareText } from "lucide-react";
import { cn } from "cn";
import { WhatsAppIcon } from "@/components/icons";
import { buildSmsUrl, buildWhatsAppUrl } from "@/lib/contact";

/** Fixed bottom bar on small screens, shown once the hero scrolls out of view. */
export function MobileCtaBar() {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      aria-hidden={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-mav-black/95 p-3 backdrop-blur transition-transform duration-300 md:hidden",
        "pb-[max(0.75rem,env(safe-area-inset-bottom))]",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="grid grid-cols-2 gap-2">
        <a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          tabIndex={visible ? 0 : -1}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-mav-yellow text-sm font-semibold text-mav-black"
        >
          <WhatsAppIcon className="size-5" /> WhatsApp
        </a>
        <a
          href={buildSmsUrl()}
          tabIndex={visible ? 0 : -1}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-white/40 text-sm font-semibold text-white"
        >
          <MessageSquareText className="size-5" /> Text
        </a>
      </div>
    </div>
  );
}
