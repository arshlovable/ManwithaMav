import Image from "next/image";
import { CloudRain, Grip, Layers, PackageOpen } from "lucide-react";
import { securementItems } from "@/content/securement";
import securementImage from "../../../public/images/securement-straps-blankets.jpg";

const iconMap = {
  straps: Grip,
  blankets: Layers,
  dolly: PackageOpen,
  cover: CloudRain,
} as const;

export function Securement() {
  return (
    <section aria-labelledby="securement-heading" className="bg-mav-sand text-mav-black">
      <div className="container-mav py-16 md:py-24">
        <h2
          id="securement-heading"
          className="eyebrow-bar font-heading text-[clamp(2rem,4.5vw,3.25rem)] leading-none"
        >
          Your stuff isn&apos;t riding loose in the bed.
        </h2>
        <p className="mt-4 max-w-2xl text-base text-mav-black/70 sm:text-lg">
          Every accepted load is evaluated for fit and safe transport before pickup.
        </p>

        <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-[1.1fr_1fr]">
          <ul className="grid gap-4 sm:grid-cols-2">
            {securementItems.map((item) => {
              const Icon = iconMap[item.icon];
              return (
                <li
                  key={item.title}
                  className="flex flex-col gap-3 rounded-2xl border border-mav-black/10 bg-white p-5"
                >
                  <span className="flex size-11 items-center justify-center rounded-lg bg-mav-yellow text-mav-black">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="font-heading text-lg leading-tight">{item.title}</h3>
                  <p className="text-sm text-mav-black/70">{item.description}</p>
                </li>
              );
            })}
          </ul>
          <div className="relative min-h-72 overflow-hidden rounded-2xl">
            <Image
              src={securementImage}
              alt="Dresser and rolled mattress wrapped in moving blankets and tied down with yellow ratchet straps in a pickup bed"
              fill
              placeholder="blur"
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
