import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name}: ${siteConfig.slogan}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [anton, hero] = await Promise.all([
    readFile(join(process.cwd(), "src/assets/fonts/anton.ttf")),
    readFile(join(process.cwd(), "public/images/hero-truck-skyline.jpg"), "base64"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: "#0b0b0c",
          fontFamily: "Anton",
        }}
      >
        <img
          src={`data:image/jpeg;base64,${hero}`}
          alt=""
          width={1200}
          height={675}
          style={{ position: "absolute", top: -22, left: 0, objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "linear-gradient(90deg, rgba(11,11,12,1) 0%, rgba(11,11,12,0.9) 40%, rgba(11,11,12,0.15) 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 72px",
            color: "white",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              letterSpacing: 6,
              color: "#ffc20e",
              textTransform: "uppercase",
              fontFamily: "sans-serif",
              fontWeight: 700,
            }}
          >
            Furniture delivery • Small-load delivery • GTA
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 24,
              fontSize: 104,
              lineHeight: 0.92,
              textTransform: "uppercase",
            }}
          >
            <span>Too big for your car?</span>
            <span style={{ color: "#ffc20e" }}>That&apos;s a Mav job.</span>
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 32,
              fontSize: 28,
              fontFamily: "sans-serif",
              color: "rgba(255,255,255,0.85)",
            }}
          >
            {siteConfig.serviceAreas.join("  •  ")}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: "Anton", data: anton, style: "normal", weight: 400 }],
    },
  );
}
