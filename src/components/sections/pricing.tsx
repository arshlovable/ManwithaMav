import { Check, CircleAlert, Clock, Info, Route, X } from "lucide-react";
import { cn } from "cn";
import { QuoteButton } from "@/components/quote-dialog";
import { pricingDisclaimer, pricingTiers, surcharges } from "@/content/pricing";
import { siteConfig } from "@/config/site";

const surchargeIcons = { route: Route, clock: Clock } as const;

export function Pricing() {
  const areas = siteConfig.serviceAreas;
  const areaList = `${areas.slice(0, -1).join(", ")} and ${areas[areas.length - 1]}`;

  return (
    <section id="pricing" aria-labelledby="pricing-heading" className="bg-mav-black">
      <div className="container-mav py-16 md:py-24">
        <h2
          id="pricing-heading"
          className="eyebrow-bar font-heading text-[clamp(2rem,4.5vw,3.25rem)] leading-none text-white"
        >
          Simple, local pricing
        </h2>
        <p className="mt-4 max-w-2xl text-base text-white/70 sm:text-lg">
          Clear pricing for furniture pickup and delivery in {areaList}.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {pricingTiers.map((tier) => (
            <article
              key={tier.id}
              aria-labelledby={`tier-${tier.id}`}
              className={cn(
                "relative flex flex-col rounded-2xl border p-7 sm:p-8",
                tier.popular
                  ? "order-first border-mav-yellow bg-mav-ink shadow-[0_0_0_1px_rgba(255,194,14,0.25),0_30px_80px_-40px_rgba(255,194,14,0.35)] lg:order-none"
                  : "border-white/15 bg-mav-ink/70",
              )}
            >
              {tier.popular ? (
                <span className="font-heading absolute -top-3.5 right-6 rounded-full bg-mav-yellow px-3 py-1 text-xs tracking-[0.15em] text-mav-black">
                  Most popular
                </span>
              ) : null}

              <h3 id={`tier-${tier.id}`} className="font-heading text-2xl text-white sm:text-3xl">
                {tier.name}
              </h3>
              <p className="font-heading mt-4 text-5xl leading-none text-mav-yellow sm:text-6xl">
                ${tier.price}
              </p>
              <p className="mt-3 text-sm text-white/70 sm:text-base">{tier.tagline}</p>

              <ul className="mt-6 space-y-2.5 text-sm text-white/90 sm:text-base">
                {tier.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <Check className="mt-0.5 size-5 shrink-0 text-mav-yellow" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div
                className={cn(
                  "mt-6 flex items-start gap-3 rounded-xl p-4 text-sm",
                  tier.notice.tone === "warning"
                    ? "bg-mav-rose text-[#5b1a1e]"
                    : "bg-mav-yellow/15 text-mav-yellow",
                )}
              >
                {tier.notice.tone === "warning" ? (
                  <CircleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                ) : (
                  <Info className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
                )}
                <p>{tier.notice.text}</p>
              </div>

              <ul className="mt-5 space-y-2 text-sm text-white/70">
                {tier.excludes.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <X className="mt-0.5 size-5 shrink-0 text-mav-red" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex-1" />
              <QuoteButton
                tier={tier.id}
                className={cn(
                  "h-12 w-full rounded-full text-base font-semibold",
                  tier.popular
                    ? "bg-mav-yellow text-mav-black hover:bg-mav-yellow-dark"
                    : "border border-white/40 bg-transparent text-white hover:bg-white/10",
                )}
              >
                {tier.cta}
              </QuoteButton>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-4 rounded-2xl border border-white/10 bg-mav-ink/60 p-5 sm:grid-cols-3 sm:p-6">
          {surcharges.map((s) => {
            const Icon = surchargeIcons[s.icon];
            return (
              <div key={s.id} className="flex items-start gap-3">
                <Icon className="mt-0.5 size-6 shrink-0 text-mav-yellow" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-white">{s.title}</p>
                  <p className="text-sm text-white/70">{s.detail}</p>
                </div>
              </div>
            );
          })}
          <div className="flex items-start gap-3 sm:border-l sm:border-white/10 sm:pl-6">
            <Info className="mt-0.5 size-6 shrink-0 text-white/60" aria-hidden="true" />
            <p className="text-xs leading-relaxed text-white/60 sm:text-sm">{pricingDisclaimer}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
