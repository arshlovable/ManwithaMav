import Image from "next/image";
import { CtaButtons } from "@/components/cta-buttons";
import heroImage from "../../../public/images/hero-truck-skyline.jpg";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-mav-black"
    >
      <Image
        src={heroImage}
        alt="White Ford Maverick pickup parked on the waterfront in front of the Toronto skyline at sunset"
        fill
        priority
        placeholder="blur"
        sizes="100vw"
        className="object-cover object-[70%_center] md:object-right"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-mav-black via-mav-black/80 to-mav-black/10 md:via-mav-black/60"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-mav-black to-transparent"
      />

      <div className="container-mav relative flex min-h-[560px] flex-col justify-center py-16 md:min-h-[600px] md:py-20">
        <p className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.7rem] font-bold tracking-[0.22em] text-mav-yellow uppercase sm:text-xs">
          <span>Furniture Delivery</span>
          <span aria-hidden="true" className="size-1 rounded-full bg-mav-yellow" />
          <span>Small-Load Delivery</span>
          <span aria-hidden="true" className="size-1 rounded-full bg-mav-yellow" />
          <span>GTA</span>
        </p>

        <h1
          id="hero-heading"
          className="font-heading max-w-3xl text-[clamp(2.75rem,8vw,5.25rem)] leading-[0.92] text-white"
        >
          Too big for
          <br />
          your car?
          <br />
          <span className="text-mav-yellow">That&apos;s a Mav job.</span>
        </h1>

        <p className="mt-6 max-w-xl text-base text-white/85 sm:text-lg">
          Fast, local furniture pickup and delivery for Facebook Marketplace finds, IKEA purchases,
          couches, dressers and other bulky items across Brampton, Mississauga, Etobicoke and
          Vaughan.
        </p>

        <CtaButtons className="mt-8" />

        <p className="mt-5 text-sm text-white/70">
          Send a photo <span aria-hidden="true">•</span> pickup <span aria-hidden="true">•</span>{" "}
          drop-off.
          <br className="sm:hidden" /> We&apos;ll tell you if it fits and what it&apos;ll cost.
        </p>
      </div>

      <p
        aria-hidden="true"
        className="font-heading pointer-events-none absolute top-10 right-6 hidden w-44 -rotate-6 text-right text-xl leading-tight text-mav-yellow drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] lg:block xl:right-16 xl:w-56 xl:text-2xl"
      >
        Furniture, Marketplace, IKEA pickups and more.
      </p>
    </section>
  );
}
