import { clientKey, rateLimit } from "@/lib/rate-limit";
import { suggestAddresses } from "@/lib/routing";

export async function POST(request: Request) {
  if (!rateLimit(clientKey(request, "places"), 60, 10 * 60 * 1000)) {
    return Response.json({ suggestions: [] });
  }
  let input = "";
  try {
    const body = (await request.json()) as { input?: string };
    input = body.input ?? "";
  } catch {
    return Response.json({ suggestions: [] });
  }
  const result = await suggestAddresses(input);
  return Response.json(result);
}
