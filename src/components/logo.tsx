import Image from "next/image";
import { cn } from "cn";
import { siteConfig } from "@/config/site";
import logoImage from "../../public/images/logo.png";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <a href="#top" className={cn("group inline-flex items-center", className)}>
      <Image
        src={logoImage}
        alt={siteConfig.name}
        priority
        sizes={compact ? "180px" : "280px"}
        className={cn(
          "h-auto w-auto",
          compact ? "h-12 sm:h-14" : "h-14 sm:h-16 md:h-[4.5rem]",
        )}
      />
    </a>
  );
}
