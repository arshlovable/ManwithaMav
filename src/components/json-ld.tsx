import { siteConfig } from "@/config/site";
import { faqs } from "@/content/faq";
import { pricingTiers } from "@/content/pricing";
import { seoDescription } from "@/lib/seo";

function buildLocalBusiness() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
    description: seoDescription,
    url: siteConfig.url,
    telephone: siteConfig.phoneNumber,
    email: siteConfig.email,
    image: `${siteConfig.url}/opengraph-image`,
    logo: `${siteConfig.url}/icon`,
    slogan: siteConfig.slogan,
    priceRange: "$75 - $120+",
    currenciesAccepted: "CAD",
    paymentAccepted: "Cash, Interac e-Transfer",
    areaServed: siteConfig.serviceAreas.map((area) => ({
      "@type": "City",
      name: area,
      containedInPlace: { "@type": "AdministrativeArea", name: "Ontario" },
    })),
    address: {
      "@type": "PostalAddress",
      addressRegion: siteConfig.province,
      addressCountry: siteConfig.country,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: siteConfig.hours.days,
        opens: siteConfig.hours.opens,
        closes: siteConfig.hours.closes,
      },
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer service",
        telephone: siteConfig.phoneNumber,
        availableLanguage: ["English"],
        contactOption: "TollFree",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Delivery services",
      itemListElement: pricingTiers.map((tier) => ({
        "@type": "Offer",
        name: tier.name,
        description: tier.tagline,
        price: tier.price,
        priceCurrency: "CAD",
        url: `${siteConfig.url}/#pricing`,
        itemOffered: {
          "@type": "Service",
          name: tier.name,
          serviceType: "Furniture and small-load delivery",
          provider: { "@id": `${siteConfig.url}/#business` },
          areaServed: siteConfig.serviceAreas.map((area) => ({ "@type": "City", name: area })),
        },
      })),
    },
  };
}

function buildFaqPage() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

function serialize(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function JsonLd() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(buildLocalBusiness()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serialize(buildFaqPage()) }}
      />
    </>
  );
}
