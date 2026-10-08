import { businessConfig, type TierId } from "./business-config";

export type { TierId };

export function roundCad(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100;
}

export function formatCad(amount: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
  }).format(roundCad(amount));
}

export function formatDistanceKm(meters: number): string {
  const km = meters / 1000;
  const rounded = Math.round(km * 10) / 10;
  return `${rounded.toFixed(1)} km`;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.max(0, Math.round(seconds / 60));
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return remainder === 0 ? `${hours} hr` : `${hours} hr ${remainder} min`;
}

/** Weekday check from a YYYY-MM-DD string, independent of the server timezone. */
export function isWeekdayIso(isoDate: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate);
  if (!match) return false;
  const date = new Date(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])));
  if (Number.isNaN(date.getTime())) return false;
  const day = date.getUTCDay();
  return day !== 0 && day !== 6;
}

export function parseTimeToMinutes(time: string): number | null {
  const match = /^(\d{2}):(\d{2})$/.exec(time);
  if (!match) return null;
  const hours = Number(match[1]);
  const minutes = Number(match[2]);
  if (hours > 23 || minutes > 59) return null;
  return hours * 60 + minutes;
}

export type RushReason = "applied" | "no-time" | "outside-window" | "weekend" | "date-required" | "invalid-time";

/** Rush surcharge applies only on weekdays, and only when both date and time are known. Endpoints are inclusive. */
export function rushStatus(time?: string, isoDate?: string): { applied: boolean; reason: RushReason } {
  if (!time) return { applied: false, reason: "no-time" };
  const minutes = parseTimeToMinutes(time);
  if (minutes == null) return { applied: false, reason: "invalid-time" };
  const inWindow = businessConfig.rushWindows.some(
    (window) => minutes >= window.startMinute && minutes <= window.endMinute,
  );
  if (!inWindow) return { applied: false, reason: "outside-window" };
  if (!isoDate) return { applied: false, reason: "date-required" };
  if (!isWeekdayIso(isoDate)) return { applied: false, reason: "weekend" };
  return { applied: true, reason: "applied" };
}

export interface FareBreakdown {
  tier: TierId;
  tierName: string;
  baseCad: number;
  distanceMeters: number;
  includedMeters: number;
  extraMeters: number;
  distanceSurchargeCad: number;
  rushSurchargeCad: number;
  rushApplied: boolean;
  rushReason: RushReason;
  totalCad: number;
}

export function customerFare(input: {
  tier: TierId;
  distanceMeters: number;
  date?: string;
  time?: string;
}): FareBreakdown {
  if (!Number.isFinite(input.distanceMeters) || input.distanceMeters < 0) {
    throw new Error("Distance must be a non-negative number of metres.");
  }
  const tier = businessConfig.tiers[input.tier];
  if (!tier) throw new Error("Unknown service tier.");

  const extraMeters = Math.max(0, input.distanceMeters - businessConfig.includedMeters);
  const distanceSurchargeCad = roundCad((extraMeters / 1000) * businessConfig.extraKmRateCad);
  const rush = rushStatus(input.time, input.date);
  const rushSurchargeCad = rush.applied ? businessConfig.rushSurchargeCad : 0;
  const totalCad = roundCad(tier.baseCad + distanceSurchargeCad + rushSurchargeCad);

  return {
    tier: input.tier,
    tierName: tier.name,
    baseCad: tier.baseCad,
    distanceMeters: input.distanceMeters,
    includedMeters: businessConfig.includedMeters,
    extraMeters,
    distanceSurchargeCad,
    rushSurchargeCad,
    rushApplied: rush.applied,
    rushReason: rush.reason,
    totalCad,
  };
}

export interface RouteLegInput {
  meters: number;
  durationSeconds: number;
}

export type ProfitIndicator = "meets-target" | "below-target" | "manual-review";

export interface OwnerAnalysis {
  fare: FareBreakdown;
  positioning: RouteLegInput | null;
  customerLeg: RouteLegInput;
  returnLeg: RouteLegInput | null;
  returnMissing: boolean;
  operatingMeters: number;
  drivingSeconds: number;
  handlingMinutes: number;
  standardHandlingMinutes: number;
  totalJobMinutes: number;
  operatingCostCad: number;
  contributionCad: number;
  earningsPerHourCad: number | null;
  indicator: ProfitIndicator;
  reasons: string[];
  incomplete: boolean;
}

/**
 * Internal decision support. Customer fare uses only pickup → drop-off.
 * Driver positioning and the return leg are operating kilometres, not part of the included 30 km.
 * A missing return leg is incomplete — it is never treated as zero kilometres.
 */
export function analyzeOwnerJob(input: {
  tier: TierId;
  customerLeg: RouteLegInput;
  positioning: RouteLegInput | null;
  returnLeg: RouteLegInput | null;
  date?: string;
  time?: string;
  handlingMinutes: number;
  costPerKmCad: number;
  targetHourlyCad: number;
}): OwnerAnalysis {
  const fare = customerFare({
    tier: input.tier,
    distanceMeters: input.customerLeg.meters,
    date: input.date,
    time: input.time,
  });
  const standardHandlingMinutes = businessConfig.tiers[input.tier].handlingMinutes;
  const returnMissing = input.returnLeg == null;
  const knownLegs = [input.positioning, input.customerLeg, input.returnLeg].filter(
    (leg): leg is RouteLegInput => leg != null,
  );
  const operatingMeters = knownLegs.reduce((sum, leg) => sum + leg.meters, 0);
  const drivingSeconds = knownLegs.reduce((sum, leg) => sum + leg.durationSeconds, 0);
  const totalJobMinutes = drivingSeconds / 60 + input.handlingMinutes;
  const operatingCostCad = roundCad((operatingMeters / 1000) * input.costPerKmCad);
  const contributionCad = roundCad(fare.totalCad - operatingCostCad);
  const earningsPerHourCad =
    totalJobMinutes > 0 ? roundCad(contributionCad / (totalJobMinutes / 60)) : null;

  const reasons: string[] = [];
  if (returnMissing) {
    reasons.push("Return or repositioning leg was not entered, so operating distance is incomplete.");
  }
  if (!input.positioning) {
    reasons.push("Driver starting leg was not included.");
  }
  if (input.handlingMinutes > standardHandlingMinutes) {
    reasons.push(
      `Handling time is above the ${standardHandlingMinutes}-minute allowance for this tier. Longer waits need a manual review.`,
    );
  }
  if (input.costPerKmCad < 0 || input.targetHourlyCad < 0) {
    reasons.push("Operating cost and target hourly earnings must be zero or greater.");
  }

  const incomplete = returnMissing || !input.positioning;
  let indicator: ProfitIndicator = "manual-review";
  if (!incomplete && input.handlingMinutes <= standardHandlingMinutes && earningsPerHourCad != null) {
    indicator = earningsPerHourCad >= input.targetHourlyCad ? "meets-target" : "below-target";
  }

  return {
    fare,
    positioning: input.positioning,
    customerLeg: input.customerLeg,
    returnLeg: input.returnLeg,
    returnMissing,
    operatingMeters,
    drivingSeconds,
    handlingMinutes: input.handlingMinutes,
    standardHandlingMinutes,
    totalJobMinutes,
    operatingCostCad,
    contributionCad,
    earningsPerHourCad,
    indicator,
    reasons,
    incomplete,
  };
}

export function buildEstimateMessage(input: {
  tierName: string;
  pickup: string;
  dropoff: string;
  distanceLabel: string;
  totalLabel: string;
  when?: string;
}): string {
  const lines = [
    "Hi Man with a Mav! I'd like to confirm this estimate.",
    `Service: ${input.tierName}`,
    `Pickup: ${input.pickup}`,
    `Drop-off: ${input.dropoff}`,
    `Pickup-to-drop-off distance: ${input.distanceLabel}`,
    `Estimated fare: ${input.totalLabel}`,
  ];
  if (input.when) lines.push(`Preferred time: ${input.when}`);
  lines.push(
    "This is an estimate, not a confirmed booking.",
    "I'll attach a photo or the Marketplace listing in this chat.",
  );
  return lines.join("\n");
}
