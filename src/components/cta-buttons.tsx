import { MessageSquareText } from "lucide-react";
import { cn } from "cn";
import { buttonVariants } from "@/components/ui/button";
import { WhatsAppIcon } from "@/components/icons";
import { buildSmsUrl, buildWhatsAppUrl } from "@/lib/contact";

interface CtaButtonsProps {
  className?: string;
  whatsappLabel?: string;
  smsLabel?: string;
  message?: string;
  size?: "md" | "lg";
  smsStyle?: "light" | "dark";
}

export function WhatsAppButton({
  label = "WhatsApp a Photo",
  message,
  className,
  size = "lg",
}: {
  label?: string;
  message?: string;
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <a
      href={buildWhatsAppUrl(message)}
      target="_blank"
      rel="noopener noreferrer"
      data-cta="whatsapp"
      className={cn(
        buttonVariants({ size: "lg" }),
        "gap-2 rounded-full bg-mav-yellow font-semibold text-mav-black shadow-[0_8px_24px_-8px_rgba(255,194,14,0.6)] hover:bg-mav-yellow-dark",
        size === "lg" ? "h-12 px-6 text-base" : "h-10 px-4 text-sm",
        className,
      )}
    >
      <WhatsAppIcon className="size-5" />
      {label}
    </a>
  );
}

export function SmsButton({
  label = "Text for a Quote",
  message,
  className,
  size = "lg",
  tone = "light",
}: {
  label?: string;
  message?: string;
  className?: string;
  size?: "md" | "lg";
  tone?: "light" | "dark";
}) {
  return (
    <a
      href={buildSmsUrl(message)}
      data-cta="sms"
      className={cn(
        buttonVariants({ size: "lg", variant: "outline" }),
        "gap-2 rounded-full font-semibold",
        tone === "light"
          ? "border-white/70 bg-white/5 text-white hover:border-white hover:bg-white/15 hover:text-white"
          : "border-mav-black/70 bg-transparent text-mav-black hover:bg-mav-black hover:text-white",
        size === "lg" ? "h-12 px-6 text-base" : "h-10 px-4 text-sm",
        className,
      )}
    >
      <MessageSquareText className="size-5" />
      {label}
    </a>
  );
}

export function CtaButtons({
  className,
  whatsappLabel,
  smsLabel,
  message,
  size = "lg",
  smsStyle = "light",
}: CtaButtonsProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-center", className)}>
      <WhatsAppButton label={whatsappLabel} message={message} size={size} />
      <SmsButton label={smsLabel} message={message} size={size} tone={smsStyle} />
    </div>
  );
}
