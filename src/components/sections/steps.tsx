import { ArrowRight, MessageSquareQuote, Send, Truck } from "lucide-react";
import { steps } from "@/content/steps";

const iconMap = {
  send: Send,
  quote: MessageSquareQuote,
  truck: Truck,
} as const;

export function Steps() {
  return (
    <section id="how-it-works" aria-labelledby="steps-heading" className="bg-mav-cream text-mav-black">
      <div className="container-mav py-16 md:py-24">
        <h2
          id="steps-heading"
          className="eyebrow-bar font-heading text-[clamp(2rem,4.5vw,3.25rem)] leading-none"
        >
          3 steps. That&apos;s it.
        </h2>

        <ol className="mt-10 grid gap-4 md:grid-cols-3 md:gap-6">
          {steps.map((step, index) => {
            const Icon = iconMap[step.icon];
            const isLast = index === steps.length - 1;
            return (
              <li
                key={step.number}
                className="relative flex gap-5 rounded-2xl border border-mav-black/10 bg-white p-6 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.35)]"
              >
                <span className="font-heading flex size-12 shrink-0 items-center justify-center rounded-full bg-mav-yellow text-lg text-mav-black">
                  {step.number}
                </span>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-heading text-2xl leading-none">{step.title}</h3>
                    <Icon className="size-7 shrink-0 text-mav-black/70" aria-hidden="true" />
                  </div>
                  <p className="mt-3 text-sm text-mav-black/70 sm:text-base">{step.description}</p>
                </div>
                {!isLast ? (
                  <ArrowRight
                    aria-hidden="true"
                    className="absolute top-1/2 -right-5 hidden size-6 -translate-y-1/2 text-mav-black/40 md:block"
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
