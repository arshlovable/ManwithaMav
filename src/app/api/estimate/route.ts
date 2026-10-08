import { customerFare, type TierId } from "@/lib/pricing";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { drivingRoute, routingMode } from "@/lib/routing";

const tiers = new Set<TierId>(["express", "full-service"]);

export async function POST(request: Request) {
  if (!rateLimit(clientKey(request, "estimate"), 20, 60 * 60 * 1000)) {
    return Response.json({ error: "Too many estimates. Wait a few minutes and try again." }, { status: 429 });
  }

  let body: { pickup?: string; dropoff?: string; tier?: string; date?: string; time?: string };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Send pickup, drop-off, and a service." }, { status: 400 });
  }

  const pickup = body.pickup?.trim() ?? "";
  const dropoff = body.dropoff?.trim() ?? "";
  const tier = body.tier as TierId;
  if (pickup.length < 5 || dropoff.length < 5) {
    return Response.json({ error: "Enter a full pickup address and a full drop-off address." }, { status: 400 });
  }
  if (!tiers.has(tier)) {
    return Response.json({ error: "Choose Curb-to-Curb Express or Full-Service Solo." }, { status: 400 });
  }

  if (routingMode() === "unavailable") {
    return Response.json(
      { error: "Route estimates are unavailable right now. Send a photo and we'll price the job manually." },
      { status: 503 },
    );
  }

  try {
    const route = await drivingRoute([pickup, dropoff]);
    const leg = route.legs[0];
    if (!leg) {
      return Response.json({ error: "No driving route was found between those addresses." }, { status: 422 });
    }
    const fare = customerFare({
      tier,
      distanceMeters: leg.meters,
      date: body.date || undefined,
      time: body.time || undefined,
    });
    return Response.json({
      ...fare,
      durationSeconds: leg.durationSeconds,
      mock: route.mock,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not calculate that route.";
    return Response.json({ error: message }, { status: 422 });
  }
}
