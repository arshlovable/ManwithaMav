"use client";

import * as React from "react";
import { AddressField } from "@/components/address-field";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { businessConfig, type TierId } from "@/lib/business-config";
import { buildWhatsAppUrl, buildSmsUrl } from "@/lib/contact";
import {
  buildEstimateMessage,
  formatCad,
  formatDistanceKm,
  formatDuration,
  type FareBreakdown,
  type RushReason,
} from "@/lib/pricing";

interface EstimateResponse extends FareBreakdown {
  durationSeconds: number;
  mock: boolean;
  error?: string;
}

const rushNote: Partial<Record<RushReason, string>> = {
  "date-required": "Add a delivery date to check the weekday rush-hour surcharge.",
  weekend: "Weekend windows are not charged the weekday rush-hour rate.",
  "outside-window": "That time is outside the 7:30–9:30 AM and 3:30–6:30 PM rush windows.",
};

export function CustomerFareCalculator() {
  const [pickup, setPickup] = React.useState("");
  const [dropoff, setDropoff] = React.useState("");
  const [tier, setTier] = React.useState<TierId>("express");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [acknowledged, setAcknowledged] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [result, setResult] = React.useState<EstimateResponse | null>(null);

  function selectTier(next: TierId) {
    setTier(next);
    setAcknowledged(false);
    setResult(null);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pickup,
          dropoff,
          tier,
          date: date || undefined,
          time: time || undefined,
        }),
      });
      const payload = (await response.json()) as EstimateResponse;
      if (!response.ok) {
        setResult(null);
        setError(payload.error ?? "Could not calculate that estimate.");
        return;
      }
      setResult(payload);
    } catch {
      setResult(null);
      setError("Could not reach the estimator. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const when = [date, time].filter(Boolean).join(" ");
  const message = result
    ? buildEstimateMessage({
        tierName: result.tierName,
        pickup,
        dropoff,
        distanceLabel: formatDistanceKm(result.distanceMeters),
        totalLabel: formatCad(result.totalCad),
        when: when || undefined,
      })
    : "";

  return (
    <section id="estimate" aria-labelledby="estimate-heading" className="bg-mav-ink text-white">
      <div className="container-mav py-16 md:py-24">
        <h2
          id="estimate-heading"
          className="eyebrow-bar font-heading text-[clamp(2rem,4.5vw,3.25rem)] leading-none"
        >
          Get your Mav estimate
        </h2>
        <p className="mt-4 max-w-2xl text-base text-white/70 sm:text-lg">
          Know what your delivery could cost before you book. This uses the driving route from
          pickup to drop-off across Brampton, Mississauga, Etobicoke and Vaughan — furniture
          pickup, couch delivery, Marketplace finds and other small loads.
        </p>

        <form onSubmit={onSubmit} className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="grid gap-4 rounded-2xl border border-white/10 bg-mav-black p-5 sm:p-6">
            <AddressField
              id="estimate-pickup"
              label="Pickup address"
              required
              value={pickup}
              onChange={setPickup}
              placeholder="Seller's address"
            />
            <AddressField
              id="estimate-dropoff"
              label="Drop-off address"
              required
              value={dropoff}
              onChange={setDropoff}
              placeholder="Where it needs to go"
            />
            <fieldset className="grid gap-2">
              <legend className="text-sm font-semibold">Service</legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {(Object.keys(businessConfig.tiers) as TierId[]).map((id) => {
                  const option = businessConfig.tiers[id];
                  const selected = tier === id;
                  return (
                    <label
                      key={id}
                      className={`cursor-pointer rounded-xl border p-3 text-sm ${
                        selected ? "border-mav-yellow bg-mav-yellow/10" : "border-white/15"
                      }`}
                    >
                      <input
                        type="radio"
                        name="tier"
                        value={id}
                        checked={selected}
                        onChange={() => selectTier(id)}
                        className="sr-only"
                      />
                      <span className="block font-semibold">{option.name}</span>
                      <span className="text-white/70">Starting at {formatCad(option.baseCad)}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="estimate-date">Preferred date</Label>
                <input
                  id="estimate-date"
                  type="date"
                  value={date}
                  onChange={(event) => {
                    setDate(event.target.value);
                    setResult(null);
                  }}
                  className="h-11 rounded-lg border border-white/15 bg-white/5 px-3 text-sm"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="estimate-time">Preferred time</Label>
                <input
                  id="estimate-time"
                  type="time"
                  value={time}
                  onChange={(event) => {
                    setTime(event.target.value);
                    setResult(null);
                  }}
                  className="h-11 rounded-lg border border-white/15 bg-white/5 px-3 text-sm"
                />
              </div>
            </div>
            <p className="text-sm text-white/60">{businessConfig.tiers[tier].loadingAcknowledgement}</p>
            <Button
              type="submit"
              disabled={loading}
              className="h-12 rounded-full bg-mav-yellow text-base font-semibold text-mav-black hover:bg-mav-yellow-dark"
            >
              {loading ? "Calculating…" : "Calculate my estimate"}
            </Button>
            {error ? (
              <p role="alert" className="rounded-lg bg-mav-red/15 px-3 py-2 text-sm text-red-100">
                {error}
              </p>
            ) : null}
          </div>

          <div className="rounded-2xl border border-white/10 bg-mav-black p-5 sm:p-6" aria-live="polite">
            {!result ? (
              <div className="flex h-full min-h-48 flex-col justify-center text-sm text-white/60">
                <p className="font-heading text-2xl text-white">Your estimate</p>
                <p className="mt-2">
                  Up to {businessConfig.includedKm} km of driving from pickup to drop-off is included.
                  Extra kilometres are {formatCad(businessConfig.extraKmRateCad)} each. The
                  driver&apos;s trip to the pickup is not part of that allowance.
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {result.mock ? (
                  <p className="rounded-lg border border-mav-yellow/40 bg-mav-yellow/10 px-3 py-2 text-sm text-mav-yellow">
                    Development estimate only. This is not a real driving route. Add a Google Maps
                    API key before using this in production.
                  </p>
                ) : null}
                <dl className="grid gap-2 text-sm">
                  <Row label="Service" value={result.tierName} />
                  <Row label="Pickup to drop-off" value={formatDistanceKm(result.distanceMeters)} />
                  <Row label="Driving time" value={formatDuration(result.durationSeconds)} />
                  <Row label="Base price" value={formatCad(result.baseCad)} />
                  <Row label="Distance beyond 30 km" value={formatCad(result.distanceSurchargeCad)} />
                  <Row label="Rush hour" value={formatCad(result.rushSurchargeCad)} />
                  <div className="mt-2 flex items-baseline justify-between border-t border-white/10 pt-3">
                    <dt className="font-semibold">Estimated total</dt>
                    <dd className="font-heading text-4xl text-mav-yellow">{formatCad(result.totalCad)}</dd>
                  </div>
                </dl>
                {rushNote[result.rushReason] ? (
                  <p className="text-xs text-white/55">{rushNote[result.rushReason]}</p>
                ) : null}
                <p className="text-sm text-white/70">
                  Final pricing and availability are confirmed after reviewing your item, access
                  requirements and pickup details.
                </p>
                <label className="flex items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={acknowledged}
                    onChange={(event) => setAcknowledged(event.target.checked)}
                    className="mt-1 size-4 accent-[#ffc20e]"
                  />
                  <span>{businessConfig.tiers[tier].loadingAcknowledgement}</span>
                </label>
                <a
                  href={acknowledged ? buildWhatsAppUrl(message) : undefined}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={!acknowledged}
                  className={`inline-flex h-12 items-center justify-center rounded-full text-center text-sm font-semibold ${
                    acknowledged
                      ? "bg-mav-yellow text-mav-black"
                      : "pointer-events-none bg-white/10 text-white/40"
                  }`}
                >
                  WhatsApp a photo to confirm
                </a>
                <a
                  href={acknowledged ? buildSmsUrl(message) : undefined}
                  aria-disabled={!acknowledged}
                  className={`text-center text-sm underline ${acknowledged ? "text-white/80" : "pointer-events-none text-white/30"}`}
                >
                  Or text the same details
                </a>
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-white/60">{label}</dt>
      <dd className="text-right font-medium">{value}</dd>
    </div>
  );
}
