import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OwnerFareCalculator } from "@/components/owner-fare-calculator";
import { OwnerLogin } from "@/components/owner-login";
import { isOwnerAuthenticated, ownerAccessConfigured } from "@/lib/owner-auth";

export const metadata: Metadata = {
  title: "Owner calculator",
  robots: { index: false, follow: false },
};

export default async function OwnerCalculatorPage() {
  if (process.env.NODE_ENV === "production" && !ownerAccessConfigured()) {
    notFound();
  }

  if (!ownerAccessConfigured()) {
    return (
      <main className="min-h-screen bg-mav-black px-6 py-20 text-white">
        <div className="mx-auto max-w-lg">
          <h1 className="font-heading text-4xl">Owner calculator is off</h1>
          <p className="mt-4 text-sm text-white/70">
            Set <code className="text-mav-yellow">OWNER_ACCESS_SECRET</code> in the server environment,
            then restart. The calculator stays unavailable until that server-side key is configured.
            A hidden URL is not enough.
          </p>
        </div>
      </main>
    );
  }

  const signedIn = await isOwnerAuthenticated();
  if (!signedIn) return <OwnerLogin />;
  return (
    <main>
      <OwnerFareCalculator />
    </main>
  );
}
