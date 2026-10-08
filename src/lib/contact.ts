import { siteConfig } from "../config/site";

export function buildWhatsAppUrl(message: string = siteConfig.defaultMessage): string {
  const digits = siteConfig.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/**
 * iOS historically wanted `sms:number&body=` while Android wants `sms:number?body=`.
 * The `?&` form is accepted by both, which is why it is used here.
 */
export function buildSmsUrl(message: string = siteConfig.defaultMessage): string {
  return `sms:${siteConfig.phoneNumber}?&body=${encodeURIComponent(message)}`;
}

export function buildTelUrl(): string {
  return `tel:${siteConfig.phoneNumber}`;
}

export interface QuoteRequest {
  tier?: string;
  pickup?: string;
  dropoff?: string;
  item?: string;
  when?: string;
  access?: string;
}

export function buildQuoteMessage(req: QuoteRequest): string {
  const lines = ["Hi Man with a Mav! I'd like a quote."];
  if (req.tier) lines.push(`Service: ${req.tier}`);
  if (req.item) lines.push(`Item: ${req.item}`);
  if (req.pickup) lines.push(`Pickup: ${req.pickup}`);
  if (req.dropoff) lines.push(`Drop-off: ${req.dropoff}`);
  if (req.access) lines.push(`Access: ${req.access}`);
  if (req.when) lines.push(`Preferred time: ${req.when}`);
  lines.push("I'll attach a photo next.");
  return lines.join("\n");
}
