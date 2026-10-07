import { ServiceAreaMap } from "@/components/service-area-map";
import { siteConfig } from "@/config/site";

export function ServiceArea() {
  return (
    <section id="service-area" aria-labelledby="area-heading" className="bg-mav-black">
      <div className="container-mav grid items-center gap-10 py-16 md:grid-cols-2 md:gap-14 md:py-24">
        <div>
          <p className="eyebrow-bar text-xs font-bold tracking-[0.2em] text-white/70 uppercase">
            Your local Mav
          </p>
          <h2 id="area-heading" className="sr-only">
            Service area: {siteConfig.serviceAreas.join(", ")}
          </h2>
          <ul aria-hidden="true" className="font-heading mt-4 text-[clamp(3rem,7vw,5.5rem)] leading-[0.9] text-mav-yellow">
            {siteConfig.serviceAreas.map((area) => (
              <li key={area}>{area}</li>
            ))}
          </ul>
          <p className="mt-6 max-w-md text-base text-white/70 sm:text-lg">
            Local furniture delivery, Marketplace pickups, IKEA pickups and small-load delivery
            throughout our core GTA service area. Up to 15 km is included; longer trips are welcome
            at $1.50 per extra km.
          </p>
        </div>
        <div className="relative">
          <ServiceAreaMap className="rounded-3xl border border-white/10 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.8)]" />
        </div>
      </div>
    </section>
  );
}
