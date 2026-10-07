import { BadgeDollarSign, MapPin, Ruler, ShieldCheck } from "lucide-react";
import { whyMav } from "@/content/securement";

const iconMap = {
  "right-sized": Ruler,
  pricing: BadgeDollarSign,
  protected: ShieldCheck,
  local: MapPin,
} as const;

export function WhyMav() {
  return (
    <section aria-labelledby="why-heading" className="bg-mav-cream text-mav-black">
      <div className="container-mav py-16 md:py-24">
        <h2
          id="why-heading"
          className="eyebrow-bar font-heading text-[clamp(2rem,4.5vw,3.25rem)] leading-none"
        >
          Why Man with a Mav?
        </h2>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {whyMav.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <li key={item.title} className="flex gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-mav-black text-mav-yellow">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-heading text-xl leading-none">{item.title}</h3>
                  <p className="mt-2 text-sm text-mav-black/70">{item.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
