export interface DrivingLeg {
  origin: string;
  destination: string;
  meters: number;
  durationSeconds: number;
}

export interface DrivingRoute {
  legs: DrivingLeg[];
  meters: number;
  durationSeconds: number;
  mock: boolean;
}

type RoutingMode = "live" | "mock" | "unavailable";

export function routingMode(): RoutingMode {
  if (process.env.GOOGLE_MAPS_API_KEY) return "live";
  if (process.env.NODE_ENV === "production") return "unavailable";
  return "mock";
}

const cache = new Map<string, { at: number; route: DrivingRoute }>();
const CACHE_MS = 10 * 60 * 1000;

function cacheKey(addresses: string[]): string {
  return addresses.map((address) => address.trim().toLowerCase().replace(/\s+/g, " ")).join(">");
}

function readCache(key: string): DrivingRoute | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_MS) {
    cache.delete(key);
    return null;
  }
  return hit.route;
}

/** Deterministic stand-in used only outside production when no API key is configured. */
function mockLeg(origin: string, destination: string): DrivingLeg {
  const seed = `${origin}|${destination}`.toLowerCase();
  let hash = 0;
  for (const char of seed) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  const meters = 8_000 + (hash % 40_000);
  const durationSeconds = Math.round((meters / 1000 / 35) * 3600);
  return { origin, destination, meters, durationSeconds };
}

interface GoogleRoute {
  distanceMeters?: number;
  duration?: string;
  legs?: { distanceMeters?: number; duration?: string }[];
}

function parseDuration(value: string | undefined): number {
  const match = /^(\d+(?:\.\d+)?)s$/.exec(value ?? "");
  if (!match) throw new Error("Google Routes returned an unreadable duration.");
  return Number(match[1]);
}

async function fetchGoogleRoute(addresses: string[]): Promise<DrivingRoute> {
  const key = process.env.GOOGLE_MAPS_API_KEY;
  if (!key) throw new Error("Google Maps API key is not configured.");

  const [origin, ...rest] = addresses;
  const destination = rest[rest.length - 1];
  const intermediates = rest.slice(0, -1).map((address) => ({ address }));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);
  try {
    const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
      method: "POST",
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": key,
        "X-Goog-FieldMask":
          "routes.duration,routes.distanceMeters,routes.legs.duration,routes.legs.distanceMeters",
      },
      body: JSON.stringify({
        origin: { address: origin },
        destination: { address: destination },
        intermediates,
        travelMode: "DRIVE",
        routingPreference: "TRAFFIC_UNAWARE",
        units: "METRIC",
      }),
    });

    if (!response.ok) {
      throw new Error("Google Routes could not calculate that drive.");
    }

    const payload = (await response.json()) as { routes?: GoogleRoute[] };
    const route = payload.routes?.[0];
    const googleLegs = route?.legs;
    if (!route || !googleLegs || googleLegs.length !== addresses.length - 1) {
      throw new Error("No driving route was found between those addresses.");
    }

    const legs: DrivingLeg[] = googleLegs.map((leg, index) => ({
      origin: addresses[index] ?? "",
      destination: addresses[index + 1] ?? "",
      meters: leg.distanceMeters ?? 0,
      durationSeconds: parseDuration(leg.duration),
    }));

    return {
      legs,
      meters: legs.reduce((sum, leg) => sum + leg.meters, 0),
      durationSeconds: legs.reduce((sum, leg) => sum + leg.durationSeconds, 0),
      mock: false,
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("The routing service timed out. Try again in a moment.");
    }
    throw error instanceof Error ? error : new Error("Routing failed.");
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Driving distance along the road network, never straight-line.
 * `addresses` is an ordered list of at least two stops.
 */
export async function drivingRoute(addresses: string[]): Promise<DrivingRoute> {
  const stops = addresses.map((address) => address.trim()).filter(Boolean);
  if (stops.length < 2) throw new Error("At least two addresses are required.");

  const key = cacheKey(stops);
  const cached = readCache(key);
  if (cached) return cached;

  const mode = routingMode();
  if (mode === "unavailable") {
    throw new Error("Route estimates are unavailable right now. Send a photo and we'll price the job manually.");
  }

  const route =
    mode === "mock"
      ? {
          legs: stops.slice(0, -1).map((origin, index) => mockLeg(origin, stops[index + 1] ?? "")),
          meters: 0,
          durationSeconds: 0,
          mock: true,
        }
      : await fetchGoogleRoute(stops);

  if (route.mock) {
    route.meters = route.legs.reduce((sum, leg) => sum + leg.meters, 0);
    route.durationSeconds = route.legs.reduce((sum, leg) => sum + leg.durationSeconds, 0);
  }

  cache.set(key, { at: Date.now(), route });
  return route;
}

export async function suggestAddresses(input: string): Promise<{ suggestions: string[]; mock: boolean }> {
  const query = input.trim();
  if (query.length < 3) return { suggestions: [], mock: false };

  const mode = routingMode();
  if (mode === "unavailable") return { suggestions: [], mock: false };
  if (mode === "mock") {
    return {
      mock: true,
      suggestions: [`${query}, Ontario, Canada`],
    };
  }

  const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": process.env.GOOGLE_MAPS_API_KEY ?? "",
      "X-Goog-FieldMask": "suggestions.placePrediction.text.text",
    },
    body: JSON.stringify({
      input: query,
      includedRegionCodes: ["ca"],
      languageCode: "en",
      locationBias: {
        circle: {
          center: { latitude: 43.65, longitude: -79.62 },
          radius: 60000,
        },
      },
    }),
  });

  if (!response.ok) return { suggestions: [], mock: false };
  const payload = (await response.json()) as {
    suggestions?: { placePrediction?: { text?: { text?: string } } }[];
  };
  const suggestions = (payload.suggestions ?? [])
    .map((item) => item.placePrediction?.text?.text)
    .filter((value): value is string => Boolean(value))
    .slice(0, 5);
  return { suggestions, mock: false };
}
