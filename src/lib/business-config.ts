/**
 * Pricing constants for Man with a Mav.
 * Customer kilometres are pickup → drop-off driving distance only.
 */
export const businessConfig = {
  currency: "CAD" as const,
  includedKm: 30,
  includedMeters: 30_000,
  extraKmRateCad: 1.5,
  rushSurchargeCad: 30,
  /** Inclusive weekday windows, minutes from midnight. */
  rushWindows: [
    { label: "7:30–9:30 AM", startMinute: 7 * 60 + 30, endMinute: 9 * 60 + 30 },
    { label: "3:30–6:30 PM", startMinute: 15 * 60 + 30, endMinute: 18 * 60 + 30 },
  ],
  tiers: {
    express: {
      id: "express" as const,
      name: "Curb-to-Curb Express",
      baseCad: 75,
      handlingMinutes: 15,
      loadingAcknowledgement:
        "I understand Curb-to-Curb Express means I (or someone at each stop) provide all lifting and loading help at both pickup and drop-off. There are no or minimal stairs and no inside carrying.",
    },
    "full-service": {
      id: "full-service" as const,
      name: "Full-Service Solo",
      baseCad: 120,
      handlingMinutes: 30,
      loadingAcknowledgement:
        "I understand Full-Service Solo is one driver, 75 lb per item, ground floor or elevator only, and no or minimal stairs. If an item needs two people, a capable helper must be at both pickup and drop-off.",
    },
  },
  /** Internal defaults. The owner calculator can override these per estimate. */
  defaultOperatingCostPerKmCad: 0.55,
  defaultTargetHourlyCad: 45,
} as const;

export type TierId = keyof typeof businessConfig.tiers;
