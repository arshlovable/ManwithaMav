import { analyzeOwnerJob, type TierId } from "@/lib/pricing";
import { businessConfig } from "@/lib/business-config";
import { isOwnerAuthenticated, ownerAccessConfigured } from "@/lib/owner-auth";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { drivingRoute, routingMode } from "@/lib/routing";

const tiers = new Set<TierId>(["express", "full-service"]);

export async function POST(request: Request) {
  if (!ownerAccessConfigured()) {
    return Response.json({ error: "Not found." }, { status: 404 });
  }
  if (!(await isOwnerAuthenticated())) {
    return Response.json({ error: "Sign in required." }, { status: 401 });
  }
  if (!rateLimit(clientKey(request, "owner-route"), 40, 60 * 60 * 1000)) {
    return Response.json({ error: "Too many route checks. Wait a few minutes." }, { status: 429 });
  }

  let body: {
    start?: string;
    pickup?: string;
    dropoff?: string;
    returnTo?: string;
    tier?: string;
    date?: string;
    time?: string;
    handlingMinutes?: number;
    costPerKmCad?: number;
    targetHourlyCad?: number;
  };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const start = body.start?.trim() ?? "";
  const pickup = body.pickup?.trim() ?? "";
  const dropoff = body.dropoff?.trim() ?? "";
  const returnTo = body.returnTo?.trim() ?? "";
  const tier = body.tier as TierId;
  if (start.length < 5 || pickup.length < 5 || dropoff.length < 5) {
    return Response.json(
      { error: "Enter the driver's start, the pickup, and the drop-off." },
      { status: 400 },
    );
  }
  if (!tiers.has(tier)) {
    return Response.json({ error: "Choose a service tier." }, { status: 400 });
  }
  if (routingMode() === "unavailable") {
    return Response.json({ error: "Routing is not configured." }, { status: 503 });
  }

  const handlingMinutes = Number.isFinite(body.handlingMinutes)
    ? Number(body.handlingMinutes)
    : businessConfig.tiers[tier].handlingMinutes;
  const costPerKmCad = Number.isFinite(body.costPerKmCad)
    ? Number(body.costPerKmCad)
    : businessConfig.defaultOperatingCostPerKmCad;
  const targetHourlyCad = Number.isFinite(body.targetHourlyCad)
    ? Number(body.targetHourlyCad)
    : businessConfig.defaultTargetHourlyCad;

  try {
    const stops = returnTo ? [start, pickup, dropoff, returnTo] : [start, pickup, dropoff];
    const route = await drivingRoute(stops);
    const [positioning, customerLeg, returnLeg] = route.legs;
    if (!positioning || !customerLeg) {
      return Response.json({ error: "No driving route was found." }, { status: 422 });
    }
    const analysis = analyzeOwnerJob({
      tier,
      positioning: { meters: positioning.meters, durationSeconds: positioning.durationSeconds },
      customerLeg: { meters: customerLeg.meters, durationSeconds: customerLeg.durationSeconds },
      returnLeg: returnTo && returnLeg ? { meters: returnLeg.meters, durationSeconds: returnLeg.durationSeconds } : null,
      date: body.date || undefined,
      time: body.time || undefined,
      handlingMinutes,
      costPerKmCad,
      targetHourlyCad,
    });
    return Response.json({ analysis, mock: route.mock, addresses: { start, pickup, dropoff, returnTo } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not calculate that route.";
    return Response.json({ error: message }, { status: 422 });
  }
}
