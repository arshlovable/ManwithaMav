# Man with a Mav

Single-page marketing site for **Man with a Mav**, a hyper-local small-load, furniture and single-item pickup and delivery service covering Brampton, Mississauga, Etobicoke and Vaughan.

> Too big for your car? That's a Mav job.

The site is a static Next.js app. Every call to action opens a pre-filled WhatsApp or SMS message, so there is no backend, database or form service to run.

## Stack

- [Next.js](https://nextjs.org) (App Router, TypeScript, static export of every route)
- Tailwind CSS v4 and [shadcn/ui](https://ui.shadcn.com) primitives (`Button`, `Dialog`, `Accordion`, `Sheet`, `Select`, ...)
- `lucide-react` icons, `next/font` (Anton + Inter), `next/image`
- SEO: metadata, Open Graph image, `LocalBusiness` + `Offer` + `FAQPage` JSON-LD, `sitemap.xml`, `robots.txt`

## Run it locally

```bash
npm install
npm run dev
```

The dev server listens on [http://localhost:4317](http://localhost:4317).

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build on :4317
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Before going live

All business details live in one file: [`src/config/site.ts`](src/config/site.ts).

| Setting | What to change |
| --- | --- |
| `whatsappNumber` | Digits only, country code first (e.g. `1416...`). Used for `wa.me` links. |
| `phoneNumber` / `phoneDisplay` | E.164 number for `sms:` links, plus the human-readable version. |
| `url` | Canonical site URL, used for metadata, sitemap and structured data. |
| `email`, `hours` | Shown in structured data. |
| `serviceAreas` | The list of cities. It drives the hero copy, service-area section, map pins, footer and SEO. |

Each of these can also be supplied through environment variables (`NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_PHONE_NUMBER`, `NEXT_PUBLIC_PHONE_DISPLAY`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_EMAIL`) without touching the file.

The placeholder numbers in the repo are not real. Replace them before deploying.

## Editing content

- Pricing tiers, surcharges and the acceptance disclaimer: [`src/content/pricing.ts`](src/content/pricing.ts)
- Service tiles: [`src/content/services.ts`](src/content/services.ts)
- The three steps: [`src/content/steps.ts`](src/content/steps.ts)
- FAQ (also feeds the `FAQPage` schema): [`src/content/faq.ts`](src/content/faq.ts)
- "Why Mav" and securement cards: [`src/content/securement.ts`](src/content/securement.ts)

## Swapping in real photos

The images in `public/images/` were generated to match the design reference. Replace them with real photos of the truck using the same filenames and nothing else needs to change:

| File | Where it appears |
| --- | --- |
| `hero-truck-skyline.jpg` | Hero background (16:9) and the Open Graph image |
| `green-sofa-living-room.jpg` | "Now how do you get it home?" section (4:3) |
| `truck-bed-loaded.jpg` | "Not sure if it'll fit?" call-out |
| `securement-straps-blankets.jpg` | "Your stuff isn't riding loose in the bed" section |
| `final-cta-truck-dusk.jpg` | Final call-to-action background (16:9) |

The design reference the site was built from is kept at [`assets/reference.png`](assets/reference.png).

## Project layout

```
src/
  app/              layout, page, globals.css, sitemap, robots, OG image, icon
  components/
    sections/       one file per page section, in page order
    ui/             shadcn/ui primitives
    quote-dialog.tsx  "Get a Quote" dialog that composes the WhatsApp / SMS message
    service-area-map.tsx  hand-drawn SVG map of the service area
  config/site.ts    business details (single source of truth)
  content/          typed copy for each section
  lib/              contact URL builders, SEO metadata
```
