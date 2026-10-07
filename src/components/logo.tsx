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
        sizes={compact ? "140px" : "220px"}
        className={cn("h-auto w-auto", compact ? "h-10" : "h-11 sm:h-12")}
      />
    </a>
  );
}
