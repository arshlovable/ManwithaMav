import Image from "next/image";
import {
  Armchair,
  BedDouble,
  Boxes,
  Camera,
  Lamp,
  ShoppingBag,
  Sofa,
  Store,
  Umbrella,
} from "lucide-react";
import { WhatsAppButton } from "@/components/cta-buttons";
import { services, type ServiceIcon } from "@/content/services";
import truckImage from "../../../public/images/truck-bed-loaded.jpg";

const iconMap: Record<ServiceIcon, typeof Sofa> = {
  marketplace: ShoppingBag,
  furniture: Lamp,
  couch: Sofa,
  dresser: Armchair,
  mattress: BedDouble,
  retail: Store,
  patio: Umbrella,
  boxed: Boxes,
};

export function MavJobs() {
  return (
    <section id="services" aria-labelledby="services-heading" className="bg-mav-black">
      <div className="container-mav py-16 md:py-24">
        <div className="max-w-2xl">
          <h2
            id="services-heading"
            className="eyebrow-bar font-heading text-[clamp(2rem,4.5vw,3.25rem)] leading-none text-white"
          >
            What&apos;s a Mav job?
          </h2>
          <p className="mt-4 text-base text-white/70 sm:text-lg">
            We move the things that are too large for a car, but don&apos;t require a full moving
            truck.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {services.map((service) => {
            const Icon = iconMap[service.icon];
            return (
              <li
                key={service.label}
                className="group flex aspect-square flex-col items-center justify-center gap-3 rounded-xl border border-white/15 bg-mav-ink/60 p-3 text-center transition-colors hover:border-mav-yellow/70 hover:bg-mav-ink"
              >
                <Icon className="size-8 text-mav-yellow" strokeWidth={1.75} aria-hidden="true" />
                <span className="text-xs leading-snug font-semibold text-white/90 sm:text-[0.8rem]">
                  {service.label}
                </span>
              </li>
            );
          })}
        </ul>

        <div className="relative mt-10 overflow-hidden rounded-2xl border border-white/10 bg-mav-ink">
          <div className="grid items-center md:grid-cols-[1.2fr_1fr]">
            <div className="flex flex-col gap-5 p-7 sm:flex-row sm:items-center sm:justify-between md:p-10">
              <div>
                <h3 className="font-heading text-2xl text-white sm:text-3xl">
                  Not sure if it&apos;ll fit?
                </h3>
                <p className="mt-2 text-sm text-white/70 sm:text-base">
                  Send us a photo or listing and we&apos;ll confirm.
                </p>
              </div>
              <WhatsAppButton label="Send Us a Photo" size="md" className="shrink-0" />
            </div>
            <div className="relative h-48 md:h-full md:min-h-[180px]">
              <Image
                src={truckImage}
                alt="Armchair wrapped in moving blankets and strapped into a white Ford Maverick bed"
                fill
                placeholder="blur"
                sizes="(min-width: 768px) 40vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-r from-mav-ink via-mav-ink/30 to-transparent"
              />
              <Camera
                aria-hidden="true"
                className="absolute right-5 bottom-5 size-8 rounded-full bg-mav-yellow p-1.5 text-mav-black"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
