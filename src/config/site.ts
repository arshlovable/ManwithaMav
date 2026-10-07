/**
 * Single source of truth for business details.
 * Replace the placeholder phone numbers and URL before going live.
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

  // E.164 format, digits only for WhatsApp. Replace with the real number.
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "14165550123",
  // Used for sms: and tel: links. Replace with the real number.
  phoneNumber: process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "+14165550123",
  phoneDisplay: process.env.NEXT_PUBLIC_PHONE_DISPLAY ?? "(416) 555-0123",
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

export const navLinks = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
] as const;
