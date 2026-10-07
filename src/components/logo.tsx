import { cn } from "cn";
import { TruckMark } from "@/components/icons";
import { siteConfig } from "@/config/site";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <a href="#top" className={cn("group inline-flex items-center gap-2.5", className)} aria-label={`${siteConfig.name} home`}>
      <span className="flex size-10 items-center justify-center rounded-md bg-mav-yellow text-mav-black">
        <TruckMark className="h-6 w-9" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-heading text-[1.35rem] leading-none tracking-wide text-white">
          Man <span className="text-mav-yellow">with a</span> Mav
        </span>
        {!compact ? (
          <span className="mt-1 text-[0.6rem] font-semibold tracking-[0.22em] text-white/70 uppercase">
            {siteConfig.tagline}
          </span>
        ) : null}
      </span>
    </a>
  );
}
