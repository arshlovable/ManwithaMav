export type TierId = "express" | "full-service";

export interface PricingTier {
  id: TierId;
  name: string;
  price: number;
  tagline: string;
  popular?: boolean;
  includes: string[];
  excludes: string[];
  notice: { tone: "warning" | "info"; text: string };
  cta: string;
}

export const pricingTiers: PricingTier[] = [
  {
    id: "express",
    name: "Curb-to-Curb Express",
    price: 75,
    tagline: "For straightforward local pickups.",
    includes: [
      "Up to 15 km included",
      "Driveway / garage / loading dock pickup",
      "Driveway / garage / loading dock drop-off",
      "Secure transport",
    ],
    excludes: ["No stairs", "No inside carrying"],
    notice: {
      tone: "warning",
      text: "Customer provides lifting help at both pickup and drop-off.",
    },
    cta: "Get a $75 Quote",
  },
  {
    id: "full-service",
    name: "Full-Service Solo",
    price: 120,
    tagline: "Delivery + one-person moving assistance.",
    popular: true,
    includes: [
      "Up to 15 km included",
      "Driver assists with loading & unloading",
      "Carry inside (ground floor or elevator access)",
      "Moving blankets & secure transport",
      "Maximum 75 lb per item",
    ],
    excludes: ["No stairs", "No items over 75 lb", "No unsafe solo handling"],
    notice: {
      tone: "info",
      text: "For items that require two people, one capable helper must be available at both pickup and drop-off.",
    },
    cta: "Get a $120 Quote",
  },
];

export const surcharges = [
  {
    id: "distance",
    title: "Longer Trip?",
    detail: "Distance beyond 15 km: +$1.50/km",
    icon: "route",
  },
  {
    id: "rush",
    title: "Rush Hour?",
    detail: "7:30–9:30 AM or 3:30–6:30 PM: +$30",
    icon: "clock",
  },
] as const;

export const pricingDisclaimer =
  "Final acceptance depends on item dimensions, weight, access conditions, vehicle capacity and safe loading requirements.";
