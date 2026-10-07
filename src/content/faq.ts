export interface FaqItem {
  question: string;
  answer: string;
}

export const faqs: FaqItem[] = [
  {
    question: "What should I send for a quote?",
    answer:
      "A photo or the Marketplace listing, the pickup and drop-off locations, and when you'd like it moved. From that we can confirm the item fits, check availability and send you a price, usually within a few minutes.",
  },
  {
    question: "Can you pick up Facebook Marketplace purchases?",
    answer:
      "Yes. That's most of what we do. Send us the listing and the seller's address once you've agreed on the purchase. We'll coordinate the pickup window, load it safely and bring it to your door.",
  },
  {
    question: "Do you move whole homes?",
    answer:
      "No. Man with a Mav is built for single items and small loads: a couch, a dresser, a mattress, an IKEA haul. If you're moving an entire apartment or house, a traditional moving company is the right fit.",
  },
  {
    question: "Do you handle stairs?",
    answer:
      "Not on either tier. Pickup and drop-off need driveway, garage, loading dock or ground-floor access. Elevator buildings are fine on Full-Service Solo. If stairs are unavoidable, mention it when you send your photo and we'll let you know if it's workable.",
  },
  {
    question: "What's the difference between the two services?",
    answer:
      "Curb-to-Curb Express ($75) is transport only. You and the seller or a helper handle lifting at both ends. Full-Service Solo ($120) adds the driver's help with loading, unloading and carrying inside to a ground-floor or elevator-access location, plus moving blankets. Both include up to 15 km.",
  },
  {
    question: "Can you move heavy appliances?",
    answer:
      "Generally no. Full-Service Solo has a 75 lb per item limit for safe one-person handling. Compact appliances like a mini-fridge or microwave are usually fine. Full-size fridges, stoves and washers aren't a Mav job.",
  },
  {
    question: "What areas do you serve?",
    answer:
      "Brampton, Mississauga, Etobicoke and Vaughan, with up to 15 km included in the base price. Trips beyond that are welcome at $1.50 per additional km, so a pickup elsewhere in the GTA is often still straightforward.",
  },
  {
    question: "Can I book same-day?",
    answer:
      "Often, yes. Same-day availability depends on the schedule, so send your photo and details as early as you can. Weekday pickups during rush hour (7:30–9:30 AM and 3:30–6:30 PM) carry a $30 surcharge.",
  },
  {
    question: "Do I need to help lift the item?",
    answer:
      "On Curb-to-Curb Express, yes. You or someone at each location provides lifting help. On Full-Service Solo the driver does the lifting for items up to 75 lb. For anything that genuinely needs two people, one capable helper must be available at both ends.",
  },
  {
    question: "How do I pay?",
    answer:
      "E-transfer or cash on completion. The price is confirmed in writing before pickup, so there are no surprises when the item arrives.",
  },
];
