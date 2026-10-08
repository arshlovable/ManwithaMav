/**
 * Single source of truth for business details.
 * Phone / WhatsApp: Canadian GHL Lead Connector number with WhatsApp Business.
 */
export const siteConfig = {
  name: "Man with a Mav",
  legalName: "Man with a Mav",
  tagline: "Small-load & furniture delivery",
  slogan: "Too big for your car? That's a Mav job.",
  description:
    "Fast, local furniture pickup and delivery for Facebook Marketplace finds, IKEA purchases, couches, dressers and other bulky items across Brampton, Mississauga, Etobicoke and Vaughan.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://manwithamav.ca",
  locale: "en_CA",

  // Digits only (country code first) for wa.me links.
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "12899070169",
  // E.164 for sms: and tel: links.
  phoneNumber: process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "+12899070169",
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? "(289) 907-0169",
  email: process.env.NEXT_PUBLIC_EMAIL ?? "hello@manwithamav.ca",

  serviceAreas: ["Brampton", "Mississauga", "Etobicoke", "Vaughan"] as const,
  region: "Greater Toronto Area",
  province: "ON",
  country: "CA",

  hours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: "08:00",
    closes: "21:00",
  },

  vehicle: "white Ford Maverick",

  defaultMessage:
    "Hi Man with a Mav! I have an item that won't fit in my car. Here's a photo and the pickup / drop-off details:",
} as const;

export type ServiceArea = (typeof siteConfig.serviceAreas)[number];

/** In-page anchors only — each href must match a section `id` on the home page. */
export const navLinks = [
  { label: "How It Works", href: "#how-it-works" }, // Steps
  { label: "Services", href: "#services" }, // What's a Mav job
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;
