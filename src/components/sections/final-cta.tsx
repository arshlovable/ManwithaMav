import Image from "next/image";
import { CtaButtons } from "@/components/cta-buttons";
import ctaImage from "../../../public/images/final-cta-truck-dusk.jpg";

export function FinalCta() {
  return (
    <section
      id="contact"
      aria-labelledby="final-cta-heading"
      className="relative isolate overflow-hidden bg-mav-black"
    >
      <Image
        src={ctaImage}
        alt="White Ford Maverick driving toward the Toronto skyline at dusk"
        fill
        placeholder="blur"
        sizes="100vw"
        className="object-cover object-[65%_center]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-mav-black via-mav-black/75 to-mav-black/20"
      />
      <div className="container-mav relative flex min-h-[380px] flex-col justify-center py-16 md:py-24">
        <h2
          id="final-cta-heading"
          className="font-heading max-w-2xl text-[clamp(2.25rem,6vw,4.25rem)] leading-[0.95] text-white"
        >
          Got something
          <br />
          that won&apos;t fit?
        </h2>
        <p className="mt-4 max-w-md text-base text-white/80 sm:text-lg">
          Send us the item. We&apos;ll tell you if it&apos;s a Mav job.
        </p>
        <CtaButtons className="mt-8" smsLabel="Text for a Quick Quote" />
      </div>
    </section>
  );
}
