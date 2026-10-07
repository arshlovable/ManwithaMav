import Image from "next/image";
import sofaImage from "../../../public/images/green-sofa-living-room.jpg";

export function Problem() {
  return (
    <section aria-labelledby="problem-heading" className="bg-mav-cream text-mav-black">
      <div className="container-mav grid items-center gap-10 py-16 md:grid-cols-2 md:gap-14 md:py-24">
        <div>
          <p className="eyebrow-bar text-xs font-bold tracking-[0.2em] text-mav-black/70 uppercase">
            Found the perfect item.
          </p>
          <h2
            id="problem-heading"
            className="font-heading mt-4 text-[clamp(2.25rem,5vw,3.75rem)] leading-[0.95]"
          >
            Now how do you
            <br />
            get it home?
          </h2>
          <div className="mt-6 space-y-4 text-base text-mav-black/75 sm:text-lg">
            <p>
              Bought a couch on Facebook Marketplace? A dresser from Kijiji? Something at IKEA that
              won&apos;t fit in your car?
            </p>
            <p>
              You shouldn&apos;t need to rent a truck or hire a full moving crew just to move one
              item.
            </p>
          </div>
          <div className="font-heading mt-8 text-[clamp(1.75rem,3.5vw,2.5rem)] leading-[1.05]">
            <p>Too big for the car.</p>
            <p>Too small for a moving truck.</p>
            <p className="text-mav-amber">Perfect for the Mav.</p>
          </div>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-[0_30px_60px_-30px_rgba(0,0,0,0.5)]">
          <Image
            src={sofaImage}
            alt="Olive green sofa in a bright living room, the kind of Marketplace find that won't fit in a car"
            fill
            placeholder="blur"
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
