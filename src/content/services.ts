export type ServiceIcon =
  | "marketplace"
  | "furniture"
  | "couch"
  | "dresser"
  | "mattress"
  | "retail"
  | "patio"
  | "boxed";

export interface ServiceItem {
  icon: ServiceIcon;
  label: string;
}

export const services: ServiceItem[] = [
  { icon: "marketplace", label: "Marketplace Finds" },
  { icon: "furniture", label: "Furniture Delivery" },
  { icon: "couch", label: "Couches & Chairs" },
  { icon: "dresser", label: "Dressers & Desks" },
  { icon: "mattress", label: "Mattresses & Bed Frames" },
  { icon: "retail", label: "IKEA / Retail Pickups" },
  { icon: "patio", label: "Patio Furniture" },
  { icon: "boxed", label: "Boxed / Bulky Purchases" },
];
