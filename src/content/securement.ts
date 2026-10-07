export interface SecurementItem {
  icon: "straps" | "blankets" | "dolly" | "cover";
  title: string;
  description: string;
}

export const securementItems: SecurementItem[] = [
  {
    icon: "straps",
    title: "Heavy-Duty Ratchet Straps",
    description: "Every load is tied down to anchor points before the truck moves.",
  },
  {
    icon: "blankets",
    title: "Protective Moving Blankets",
    description: "Quilted pads between items and the bed to prevent scuffs and scratches.",
  },
  {
    icon: "dolly",
    title: "Heavy-Duty Dolly",
    description: "Rolls heavier pieces across driveways and lobbies without dragging.",
  },
  {
    icon: "cover",
    title: "Weatherproof Bed Cover",
    description: "Keeps rain, snow and road spray off your item in transit.",
  },
];

export const whyMav = [
  {
    icon: "right-sized",
    title: "Right-Sized",
    description: "Built specifically for small loads and single-item deliveries.",
  },
  {
    icon: "pricing",
    title: "Straightforward Pricing",
    description: "Know the basic pricing structure before booking.",
  },
  {
    icon: "protected",
    title: "Protected & Secured",
    description: "Items transported using proper straps and moving blankets.",
  },
  {
    icon: "local",
    title: "Local",
    description: "Focused on Brampton, Mississauga, Etobicoke and Vaughan.",
  },
] as const;
