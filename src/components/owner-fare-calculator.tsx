"use client";

import * as React from "react";
import { AddressField } from "@/components/address-field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ownerLogout } from "@/app/owner/actions";
import { businessConfig, type TierId } from "@/lib/business-config";
import { buildWhatsAppUrl } from "@/lib/contact";
import {
  buildEstimateMessage,
  formatCad,
  formatDistanceKm,
  formatDuration,
  type OwnerAnalysis,
} from "@/lib/pricing";

interface OwnerResponse {
  analysis: OwnerAnalysis;
  mock: boolean;
  addresses: { start: string; pickup: string; dropoff: string; returnTo: string };
  error?: string;
}

const indicatorLabel = {
  "meets-target": "Meets target",
  "below-target": "Below target",
  "manual-review": "Manual review needed",
} as const;

export function OwnerFareCalculator() {
  const [start, setStart] = React.useState("");
  const [pickup, setPickup] = React.useState("");
  const [dropoff, setDropoff] = React.useState("");
  const [returnTo, setReturnTo] = React.useState("");
  const [tier, setTier] = React.useState<TierId>("express");
  const [date, setDate] = React.useState("");
  const [time, setTime] = React.useState("");
  const [handlingMinutes, setHandlingMinutes] = React.useState<number>(
    businessConfig.tiers.express.handlingMinutes,
  );
  const [costPerKm, setCostPerKm] = React.useState<number>(businessConfig.defaultOperatingCostPerKmCad);
  const [targetHourly, setTargetHourly] = React.useState<number>(businessConfig.defaultTargetHourlyCad);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [copied, setCopied] = React.useState(false);
  const [result, setResult] = React.useState<OwnerResponse | null>(null);

  function changeTier(next: TierId) {
    setTier(next);
    setHandlingMinutes(businessConfig.tiers[next].handlingMinutes);
    setResult(null);
  }

  async function calculate(event?: React.FormEvent) {
    event?.preventDefault();
    setLoading(true);
    setError(null);
    setCopied(false);
    try {
      const response = await fetch("/owner/route-api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start,
          pickup,
          dropoff,
          returnTo: returnTo || undefined,
          tier,
          date: date || undefined,
          time: time || undefined,
          handlingMinutes,
          costPerKmCad: costPerKm,
          targetHourlyCad: targetHourly,
        }),
      });
      const payload = (await response.json()) as OwnerResponse;
      if (!response.ok) {
        setResult(null);
        setError(payload.error ?? "Could not calculate that job.");
        return;
      }
      setResult(payload);
    } catch {
      setError("Could not reach the routing service.");
    } finally {
      setLoading(false);
    }
  }

  const analysis = result?.analysis;
  const quote = analysis
    ? buildEstimateMessage({
        tierName: analysis.fare.tierName,
        pickup,
        dropoff,
        distanceLabel: formatDistanceKm(analysis.customerLeg.meters),
        totalLabel: formatCad(analysis.fare.totalCad),
        when: [date, time].filter(Boolean).join(" ") || undefined,
      })
    : "";

  return (
    <div className="min-h-screen bg-mav-black text-white">
      <div className="container-mav py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-mav-yellow uppercase">Internal</p>
            <h1 className="font-heading text-4xl">Owner calculator</h1>
            <p className="mt-2 max-w-2xl text-sm text-white/65">
              Decision support only. This is not a guarantee of profit. Customer fare uses pickup to
              drop-off. Your drive to the pickup and any return trip are operating kilometres.
            </p>
          </div>
          <form action={ownerLogout}>
            <Button type="submit" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Sign out
            </Button>
          </form>
        </div>

        <form onSubmit={calculate} className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="grid gap-4 rounded-2xl border border-white/10 p-5">
            <AddressField id="owner-start" label="Driver's starting address" required value={start} onChange={setStart} placeholder="Where the truck is now" />
            <AddressField id="owner-pickup" label="Customer pickup" required value={pickup} onChange={setPickup} placeholder="Pickup address" />
            <AddressField id="owner-dropoff" label="Customer drop-off" required value={dropoff} onChange={setDropoff} placeholder="Drop-off address" />
            <AddressField id="owner-return" label="Return / repositioning (optional)" value={returnTo} onChange={setReturnTo} placeholder="Leave blank if you have not decided" />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="grid gap-2 text-sm">
                Service
                <select
                  value={tier}
                  onChange={(event) => changeTier(event.target.value as TierId)}
                  className="h-11 rounded-lg border border-white/15 bg-mav-ink px-3"
                >
                  {(Object.keys(businessConfig.tiers) as TierId[]).map((id) => (
                    <option key={id} value={id}>
                      {businessConfig.tiers[id].name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm">
                Handling minutes
                <Input
                  type="number"
                  min={0}
                  value={handlingMinutes}
                  onChange={(event) => setHandlingMinutes(Number(event.target.value))}
                  className="h-11 bg-white/5"
                />
              </label>
              <label className="grid gap-2 text-sm">
                Date
                <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="h-11 bg-white/5" />
              </label>
              <label className="grid gap-2 text-sm">
                Time
                <Input type="time" value={time} onChange={(event) => setTime(event.target.value)} className="h-11 bg-white/5" />
              </label>
              <label className="grid gap-2 text-sm">
                Operating cost / km (CAD)
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={costPerKm}
                  onChange={(event) => setCostPerKm(Number(event.target.value))}
                  className="h-11 bg-white/5"
                />
              </label>
              <label className="grid gap-2 text-sm">
                Target hourly earnings (CAD)
                <Input
                  type="number"
                  min={0}
                  step="1"
                  value={targetHourly}
                  onChange={(event) => setTargetHourly(Number(event.target.value))}
                  className="h-11 bg-white/5"
                />
              </label>
            </div>
            <Button type="submit" disabled={loading} className="h-12 rounded-full bg-mav-yellow font-semibold text-mav-black">
              {loading ? "Calculating…" : "Recalculate"}
            </Button>
            {error ? <p className="text-sm text-red-200">{error}</p> : null}
          </div>

          <div className="rounded-2xl border border-white/10 p-5" aria-live="polite">
            {!analysis ? (
              <p className="text-sm text-white/60">Run a calculation to see operating distance, time, and estimated contribution.</p>
            ) : (
              <OwnerResults
                analysis={analysis}
                mock={result?.mock ?? false}
                quote={quote}
                copied={copied}
                onCopy={async () => {
                  await navigator.clipboard.writeText(quote);
                  setCopied(true);
                }}
              />
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

function OwnerResults({
  analysis,
  mock,
  quote,
  copied,
  onCopy,
}: {
  analysis: OwnerAnalysis;
  mock: boolean;
  quote: string;
  copied: boolean;
  onCopy: () => void;
}) {
  const tone =
    analysis.indicator === "meets-target"
      ? "text-mav-yellow"
      : analysis.indicator === "below-target"
        ? "text-red-300"
        : "text-white";

  return (
    <div className="grid gap-3 text-sm">
      {mock ? (
        <p className="rounded-lg bg-mav-yellow/10 px-3 py-2 text-mav-yellow">
          Development routes only. Not a real drive.
        </p>
      ) : null}
      {analysis.incomplete ? (
        <p className="rounded-lg border border-white/20 px-3 py-2">
          Incomplete calculation. {analysis.returnMissing ? "No return destination was entered, so return travel is not assumed to be zero." : "A required leg is missing."}
        </p>
      ) : null}
      <p className={`font-heading text-3xl ${tone}`}>{indicatorLabel[analysis.indicator]}</p>
      <Row label="Customer fare" value={formatCad(analysis.fare.totalCad)} />
      <Row label="Pickup to drop-off" value={formatDistanceKm(analysis.customerLeg.meters)} />
      <Row
        label="Start to pickup"
        value={analysis.positioning ? formatDistanceKm(analysis.positioning.meters) : "Missing"}
      />
      <Row
        label="Drop-off to return"
        value={analysis.returnLeg ? formatDistanceKm(analysis.returnLeg.meters) : "Not entered"}
      />
      <Row label="Operating kilometres" value={formatDistanceKm(analysis.operatingMeters)} />
      <Row label="Driving time" value={formatDuration(analysis.drivingSeconds)} />
      <Row label="Loading / unloading" value={`${analysis.handlingMinutes} min`} />
      <Row label="Total job time" value={`${Math.round(analysis.totalJobMinutes)} min`} />
      <Row label="Distance-based operating cost" value={formatCad(analysis.operatingCostCad)} />
      <Row label="Contribution before overhead and tax" value={formatCad(analysis.contributionCad)} />
      <Row
        label="Earnings per operating hour"
        value={analysis.earningsPerHourCad == null ? "—" : formatCad(analysis.earningsPerHourCad)}
      />
      {analysis.reasons.length > 0 ? (
        <ul className="list-disc pl-5 text-white/70">
          {analysis.reasons.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
      ) : null}
      <p className="text-xs text-white/50">
        Excludes insurance, truck payments, tax, and time that is not on this job. Use it to decide,
        then confirm the customer price yourself.
      </p>
      <div className="mt-2 flex flex-col gap-2 sm:flex-row">
        <Button type="button" onClick={onCopy} className="rounded-full bg-white text-mav-black">
          {copied ? "Copied" : "Copy customer quote"}
        </Button>
        <a
          href={buildWhatsAppUrl(quote)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-9 items-center justify-center rounded-full bg-mav-yellow px-4 text-sm font-semibold text-mav-black"
        >
          Open WhatsApp
        </a>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/10 py-1">
      <span className="text-white/60">{label}</span>
      <span className="text-right">{value}</span>
    </div>
  );
}
