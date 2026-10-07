import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#ffc20e",
          borderRadius: 12,
        }}
      >
        <svg viewBox="0 0 64 40" width="48" height="30" fill="none">
          <path
            d="M4 27V14h22l6-9h14l5 9h7a4 4 0 0 1 4 4v9h-5"
            stroke="#0b0b0c"
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path d="M30 14h16l-3.6-6H33.7z" fill="#0b0b0c" />
          <rect x="4" y="14" width="22" height="13" fill="#0b0b0c" />
          <circle cx="16" cy="29" r="5.5" fill="#ffc20e" stroke="#0b0b0c" strokeWidth="3" />
          <circle cx="49" cy="29" r="5.5" fill="#ffc20e" stroke="#0b0b0c" strokeWidth="3" />
          <path d="M22 29h21" stroke="#0b0b0c" strokeWidth="3" />
        </svg>
      </div>
    ),
    size,
  );
}
