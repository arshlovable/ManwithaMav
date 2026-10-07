export interface Step {
  number: string;
  title: string;
  description: string;
  icon: "send" | "quote" | "truck";
}

export const steps: Step[] = [
  {
    number: "01",
    title: "Send It",
    description: "Text or WhatsApp us a photo or Marketplace listing.",
    icon: "send",
  },
  {
    number: "02",
    title: "Get Your Quote",
    description:
      "Send your pickup location, destination and preferred time. We'll confirm fit, availability and price.",
    icon: "quote",
  },
  {
    number: "03",
    title: "We Mav It",
    description: "We pick it up, secure it properly and get it where it needs to go.",
    icon: "truck",
  },
];
