import { businessConfig } from "@/lib/business-config";

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

const included = `Up to ${businessConfig.includedKm} km from pickup to drop-off`;

export const pricingTiers: PricingTier[] = [
  {
    id: "express",
    name: businessConfig.tiers.express.name,
    price: businessConfig.tiers.express.baseCad,
    tagline: "Transport only. You handle the lifting.",
    includes: [
      included,
      "Driver secures and protects the load",
      "Driveway, garage, or loading-dock pickup and drop-off",
      `${businessConfig.tiers.express.handlingMinutes} minutes handling included`,
    ],
    excludes: ["No or minimal stairs", "No inside carrying"],
    notice: {
      tone: "warning",
      text: "Customer provides all lifting and loading help at both pickup and drop-off.",
    },
    cta: "Get a $75 Quote",
  },
  {
    id: "full-service",
    name: businessConfig.tiers["full-service"].name,
    price: businessConfig.tiers["full-service"].baseCad,
    tagline: "Delivery plus one-person help.",
    popular: true,
    includes: [
      included,
      "Driver assists with loading and unloading",
      "Carry inside on the ground floor or by elevator (no or minimal stairs)",
      "Moving blankets and secure transport",
      "Maximum 75 lb per item",
      `${businessConfig.tiers["full-service"].handlingMinutes} minutes handling included`,
    ],
    excludes: ["No or minimal stairs", "No items over 75 lb", "No unsafe solo handling"],
    notice: {
      tone: "info",
      text: "If an item needs two people, one capable helper must be available at both pickup and drop-off.",
    },
    cta: "Get a $120 Quote",
  },
];

export const surcharges = [
  {
    id: "distance",
    title: "Longer Trip?",
    detail: `Beyond ${businessConfig.includedKm} km: +$${businessConfig.extraKmRateCad.toFixed(2)}/km`,
    icon: "route",
  },
  {
    id: "rush",
    title: "Rush Hour?",
    detail: "Weekdays 7:30–9:30 AM or 3:30–6:30 PM: +$30",
    icon: "clock",
  },
] as const;

export const pricingDisclaimer =
  "The included 30 km is the driving route from your pickup to your drop-off. It does not include the driver's trip to the pickup or back home. Longer waits, difficult access, remote positioning, or a complex route need a manual review. No undisclosed fees. Every final price is confirmed before booking.";
