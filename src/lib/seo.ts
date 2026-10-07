import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

const areas = siteConfig.serviceAreas;
const areaList = `${areas.slice(0, -1).join(", ")} & ${areas[areas.length - 1]}`;

export const seoTitle = `Furniture & Small-Load Delivery in ${areaList} | ${siteConfig.name}`;

export const seoDescription =
  "Too big for your car? That's a Mav job. Fast, local pickup and delivery for Facebook Marketplace finds, IKEA purchases, couches, dressers and mattresses across Brampton, Mississauga, Etobicoke and Vaughan. From $75. Send a photo for a quote.";

export const seoKeywords = [
  "furniture delivery Brampton",
  "furniture delivery Mississauga",
  "couch delivery Etobicoke",
  "furniture delivery Vaughan",
  "Facebook Marketplace pickup Brampton",
  "Facebook Marketplace delivery Mississauga",
  "IKEA delivery Mississauga",
  "IKEA pickup Etobicoke",
  "small load delivery GTA",
  "single item delivery Toronto",
  "pickup truck delivery service",
  "Man with a Mav",
];

export function buildMetadata(): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: seoTitle,
      template: `%s | ${siteConfig.name}`,
    },
    description: seoDescription,
    keywords: seoKeywords,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    category: "Delivery service",
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: seoTitle,
      description: seoDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: seoTitle,
      description: seoDescription,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    other: {
      "geo.region": `${siteConfig.country}-${siteConfig.province}`,
      "geo.placename": areas.join(", "),
    },
  };
}
