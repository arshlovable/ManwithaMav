import type { SVGProps } from "react";

/** Simple speech-bubble-with-handset glyph standing in for the WhatsApp mark. */
export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3.5 20.5 5 16.2A8.5 8.5 0 1 1 8 19.2z" />
      <path d="M9.2 8.6c0 3 2.4 5.5 5.4 5.9l1.1-1.4-1.8-.9-.8.8c-1-.4-1.9-1.3-2.3-2.3l.8-.8-.9-1.8z" />
    </svg>
  );
}

/** Small pickup-truck silhouette used in the logo lockup. */
export function TruckMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 40" fill="none" aria-hidden="true" {...props}>
      <path
        d="M4 27V14h22l6-9h14l5 9h7a4 4 0 0 1 4 4v9h-5"
        stroke="currentColor"
        strokeWidth={3}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path d="M30 14h16l-3.6-6H33.7z" fill="currentColor" />
      <rect x="4" y="14" width="22" height="13" fill="currentColor" opacity={0.95} />
      <path d="M26 27H4" stroke="currentColor" strokeWidth={3} strokeLinecap="round" />
      <circle cx="16" cy="29" r="5.5" fill="#0b0b0c" stroke="currentColor" strokeWidth={3} />
      <circle cx="49" cy="29" r="5.5" fill="#0b0b0c" stroke="currentColor" strokeWidth={3} />
      <path d="M22 29h21" stroke="currentColor" strokeWidth={3} />
    </svg>
  );
}
