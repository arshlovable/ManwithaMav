import assert from "node:assert/strict";
import test from "node:test";
import { buildWhatsAppUrl } from "./contact";
import { analyzeOwnerJob, buildEstimateMessage, customerFare } from "./pricing";

const weekday = "2026-10-07";
const saturday = "2026-10-10";

test("base fares are $75 and $120 inside 30 km", () => {
  const express = customerFare({ tier: "express", distanceMeters: 12_000, date: weekday, time: "11:00" });
  const solo = customerFare({ tier: "full-service", distanceMeters: 12_000, date: weekday, time: "11:00" });
  assert.equal(express.baseCad, 75);
  assert.equal(express.totalCad, 75);
  assert.equal(express.distanceSurchargeCad, 0);
  assert.equal(solo.baseCad, 120);
  assert.equal(solo.totalCad, 120);
});

test("exactly 30 km has no distance surcharge", () => {
  const fare = customerFare({ tier: "express", distanceMeters: 30_000 });
  assert.equal(fare.extraMeters, 0);
  assert.equal(fare.distanceSurchargeCad, 0);
  assert.equal(fare.totalCad, 75);
});

test("distance beyond 30 km is $1.50 per km using unrounded metres", () => {
  const fare = customerFare({ tier: "express", distanceMeters: 40_000 });
  assert.equal(fare.distanceSurchargeCad, 15);
  assert.equal(fare.totalCad, 90);

  const partial = customerFare({ tier: "full-service", distanceMeters: 30_400 });
  assert.equal(partial.distanceSurchargeCad, 0.6);
  assert.equal(partial.totalCad, 120.6);
});

test("rush-hour boundaries are inclusive on weekdays only", () => {
  for (const time of ["07:30", "09:30", "15:30", "18:30"]) {
    const fare = customerFare({ tier: "express", distanceMeters: 1000, date: weekday, time });
    assert.equal(fare.rushApplied, true, time);
    assert.equal(fare.rushSurchargeCad, 30);
    assert.equal(fare.totalCad, 105);
  }
  for (const time of ["07:29", "09:31", "15:29", "18:31", "12:00"]) {
    const fare = customerFare({ tier: "express", distanceMeters: 1000, date: weekday, time });
    assert.equal(fare.rushApplied, false, time);
    assert.equal(fare.totalCad, 75);
  }
  const weekend = customerFare({ tier: "express", distanceMeters: 1000, date: saturday, time: "08:00" });
  assert.equal(weekend.rushApplied, false);
  const noDate = customerFare({ tier: "express", distanceMeters: 1000, time: "08:00" });
  assert.equal(noDate.rushApplied, false);
  assert.equal(noDate.rushReason, "date-required");
});

test("owner calculator does not treat a missing return leg as zero", () => {
  const analysis = analyzeOwnerJob({
    tier: "express",
    positioning: { meters: 5_000, durationSeconds: 600 },
    customerLeg: { meters: 10_000, durationSeconds: 900 },
    returnLeg: null,
    handlingMinutes: 15,
    costPerKmCad: 0.5,
    targetHourlyCad: 40,
  });
  assert.equal(analysis.incomplete, true);
  assert.equal(analysis.returnMissing, true);
  assert.equal(analysis.indicator, "manual-review");
  assert.equal(analysis.operatingMeters, 15_000);
  assert.match(analysis.reasons.join(" "), /not assumed to be zero|incomplete/i);
});

test("owner indicator meets or falls short of the hourly target when the job is complete", () => {
  const shared = {
    tier: "express" as const,
    positioning: { meters: 2_000, durationSeconds: 300 },
    customerLeg: { meters: 10_000, durationSeconds: 900 },
    returnLeg: { meters: 2_000, durationSeconds: 300 },
    handlingMinutes: 15,
    costPerKmCad: 0.5,
    date: weekday,
    time: "11:00",
  };
  const meets = analyzeOwnerJob({ ...shared, targetHourlyCad: 20 });
  const below = analyzeOwnerJob({ ...shared, targetHourlyCad: 500 });
  assert.equal(meets.incomplete, false);
  assert.equal(meets.indicator, "meets-target");
  assert.equal(below.indicator, "below-target");
  assert.equal(meets.fare.totalCad, 75);
});

test("WhatsApp confirmation encodes the estimate and does not claim a photo is attached", () => {
  const message = buildEstimateMessage({
    tierName: "Curb-to-Curb Express",
    pickup: "1 Main St, Brampton",
    dropoff: "2 Queen St, Mississauga",
    distanceLabel: "32.4 km",
    totalLabel: "$78.60",
    when: "2026-10-07 16:00",
  });
  const url = buildWhatsAppUrl(message);
  assert.match(url, /^https:\/\/wa\.me\/12899070169\?text=/);
  assert.equal(decodeURIComponent(url.split("text=")[1] ?? ""), message);
  assert.match(message, /I'll attach a photo/);
  assert.doesNotMatch(message, /photo has been attached|already attached/i);
});
