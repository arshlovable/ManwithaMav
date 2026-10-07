import { cn } from "cn";

interface Region {
  name: string;
  points: string;
  label: { x: number; y: number };
  primary: boolean;
}

const regions: Region[] = [
  {
    name: "Vaughan",
    points: "200,60 400,50 420,170 240,190 190,130",
    label: { x: 318, y: 118 },
    primary: true,
  },
  {
    name: "Brampton",
    points: "40,150 210,120 240,250 90,290 30,230",
    label: { x: 128, y: 210 },
    primary: true,
  },
  {
    name: "Mississauga",
    points: "90,290 235,255 300,290 305,370 230,405 130,375",
    label: { x: 200, y: 338 },
    primary: true,
  },
  {
    name: "Etobicoke",
    points: "240,190 330,195 345,335 305,370 300,290 235,255",
    label: { x: 296, y: 262 },
    primary: true,
  },
  {
    name: "Toronto",
    points: "330,195 520,185 560,300 345,335",
    label: { x: 450, y: 250 },
    primary: false,
  },
];

const lakePath =
  "M0 440 L130 375 L230 405 L305 370 L345 335 L560 300 L600 290 L600 480 L0 480 Z";

export function ServiceAreaMap({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 600 480"
      role="img"
      aria-labelledby="map-title map-desc"
      className={cn("h-auto w-full", className)}
    >
      <title id="map-title">Service area map</title>
      <desc id="map-desc">
        Stylized map of the west Greater Toronto Area highlighting Brampton, Mississauga, Etobicoke
        and Vaughan in yellow, with Toronto and Lake Ontario shown for reference.
      </desc>
      <defs>
        <pattern id="map-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
        </pattern>
        <linearGradient id="lake" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1d2733" />
          <stop offset="1" stopColor="#0f141b" />
        </linearGradient>
      </defs>

      <rect width="600" height="480" rx="24" fill="#141416" />
      <rect width="600" height="480" rx="24" fill="url(#map-grid)" />

      {/* Major corridors suggesting the 401 / 427 / 400 */}
      <g stroke="rgba(255,255,255,0.14)" strokeWidth="3" strokeLinecap="round" fill="none">
        <path d="M20 300 C 150 270, 300 265, 590 230" />
        <path d="M300 40 C 300 160, 320 260, 350 340" />
        <path d="M60 90 C 160 140, 220 300, 240 410" />
      </g>

      <path d={lakePath} fill="url(#lake)" />
      <path d={lakePath} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />

      {regions.map((region) => (
        <polygon
          key={region.name}
          points={region.points}
          fill={region.primary ? "#ffc20e" : "rgba(255,255,255,0.05)"}
          fillOpacity={region.primary ? 0.85 : 1}
          stroke={region.primary ? "#ffd75e" : "rgba(255,255,255,0.25)"}
          strokeWidth={region.primary ? 2.5 : 1.5}
          strokeLinejoin="round"
        />
      ))}

      {regions.map((region) => {
        const w = region.name.length * 9.5 + 34;
        const { x, y } = region.label;
        if (!region.primary) {
          return (
            <text
              key={region.name}
              x={x}
              y={y}
              textAnchor="middle"
              fill="rgba(255,255,255,0.7)"
              fontSize="16"
              fontWeight={600}
              fontFamily="var(--font-inter), system-ui, sans-serif"
            >
              {region.name}
            </text>
          );
        }
        return (
          <g key={region.name} transform={`translate(${x} ${y})`}>
            <circle r="6" fill="#0b0b0c" />
            <circle r="3" fill="#ffc20e" />
            <rect x={-w / 2} y={-40} width={w} height={28} rx="14" fill="#ffffff" />
            <path d="M-6 -12 L0 -4 L6 -12 Z" fill="#ffffff" />
            <circle cx={-w / 2 + 14} cy={-26} r="4" fill="#ffc20e" stroke="#0b0b0c" strokeWidth="2" />
            <text
              x={-w / 2 + 26}
              y={-21}
              fill="#0b0b0c"
              fontSize="15"
              fontWeight={700}
              fontFamily="var(--font-inter), system-ui, sans-serif"
            >
              {region.name}
            </text>
          </g>
        );
      })}

      <text
        x="470"
        y="430"
        textAnchor="middle"
        fill="rgba(255,255,255,0.5)"
        fontSize="15"
        fontStyle="italic"
        fontFamily="var(--font-inter), system-ui, sans-serif"
      >
        Lake Ontario
      </text>
    </svg>
  );
}
