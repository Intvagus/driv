import { test } from "node:test";
import assert from "node:assert/strict";
import { appliedType, calculateBill, energyCharge, fixedCharge } from "./tariff";
import { project, validateReading, crossingCost, type TrackerSetup } from "./tracker";

test("protected: first 100 units at the lower rate (one-slab benefit)", () => {
  assert.equal(energyCharge("protected", 100).amount, 100 * 10.54);
  assert.equal(energyCharge("protected", 150).amount, 100 * 10.54 + 50 * 13.01);
});

test("unprotected: whole month at the slab reached, no previous-slab benefit", () => {
  assert.equal(energyCharge("unprotected", 250).amount, 250 * 33.1);
  assert.equal(energyCharge("unprotected", 701).amount, 701 * 47.2);
});

test("protected household over 200 units is billed as unprotected", () => {
  assert.equal(appliedType("protected", 200), "protected");
  assert.equal(appliedType("protected", 201), "unprotected");
});

test("lifeline: within 100 stays lifeline, then protected, then unprotected", () => {
  assert.equal(appliedType("lifeline", 100), "lifeline");
  assert.equal(appliedType("lifeline", 150), "protected");
  assert.equal(appliedType("lifeline", 250), "unprotected");
  assert.equal(calculateBill({ units: 40, type: "lifeline", sanctionedKw: 1, electricityDutyPercent: 1.5 }).lines.find((l) => l.key === "fca")!.amount, 0);
});

test("fixed charge only for unprotected, per started kW", () => {
  assert.equal(fixedCharge("protected", 150, 3), 0);
  assert.equal(fixedCharge("unprotected", 250, 2), 700);
  assert.equal(fixedCharge("unprotected", 250, 2.2), 1050);
});

test("bill total adds energy, fixed, adjustments, duty and GST", () => {
  const b = calculateBill({ units: 150, type: "protected", sanctionedKw: 2, electricityDutyPercent: 1.5, fcaPerUnit: 2, qtaPerUnit: 0.5, gstPercent: 18 });
  const energy = 100 * 10.54 + 50 * 13.01; // 1704.5
  const fca = 300, qta = 75;
  const duty = energy * 0.015;
  const gst = (energy + fca + qta) * 0.18;
  assert.equal(b.total, Math.round(energy + fca + qta + duty + gst));
});

test("crossing 200 units costs a lot more than staying at 200", () => {
  const setup: TrackerSetup = { disco: "lesco", type: "protected", sanctionedKw: 2, start: { date: "2026-10-01", value: 1000 }, cycleDays: 30 };
  const c = crossingCost(setup, 1.5);
  assert.equal(c.limit, 200);
  assert.ok(c.extra > 3000, `extra was ${c.extra}`);
});

const setup: TrackerSetup = { disco: "lesco", type: "protected", sanctionedKw: 2, start: { date: "2026-10-01", value: 5000 }, cycleDays: 30 };

test("projection: steady use over 10 days", () => {
  const p = project(setup, [{ date: "2026-10-11", value: 5050 }], "2026-10-11");
  assert.equal(p.usedSoFar, 50);
  assert.equal(p.projectedUnits, 150);
  assert.equal(p.level, "safe");
  assert.equal(p.dailyBudget, 150 / 20);
  assert.equal(p.nextReadingDate, "2026-10-31");
});

test("projection: heading over 200 is flagged", () => {
  const p = project(setup, [{ date: "2026-10-11", value: 5075 }], "2026-10-11");
  assert.equal(p.projectedUnits, 225);
  assert.equal(p.level, "over");
});

test("projection: close to the limit", () => {
  const p = project(setup, [{ date: "2026-10-16", value: 5095 }], "2026-10-16");
  assert.equal(p.projectedUnits, 190);
  assert.equal(p.level, "close");
});

test("projection: needs a day of data", () => {
  const p = project(setup, [], "2026-10-01");
  assert.equal(p.projectedUnits, null);
  assert.equal(p.level, "unknown");
});

test("unprotected guards the top of the current slab", () => {
  const p = project({ ...setup, type: "unprotected" }, [{ date: "2026-10-11", value: 5120 }], "2026-10-11");
  assert.equal(p.limit, 200);
  assert.equal(p.level, "over");
});

test("reading validation", () => {
  const r = [{ date: "2026-10-11", value: 5050 }];
  assert.equal(validateReading(setup, r, { date: "2026-10-12", value: 5049 }), "lowerThanBefore");
  assert.equal(validateReading(setup, r, { date: "2026-10-05", value: 5060 }), "higherThanAfter");
  assert.equal(validateReading(setup, r, { date: "2026-09-30", value: 4990 }), "beforeStart");
  assert.equal(validateReading(setup, r, { date: "2026-10-12", value: 5060 }), null);
});

test("crossing cost uses the slab boundary being guarded", () => {
  const unprot: TrackerSetup = { ...setup, type: "unprotected" };
  const c = crossingCost(unprot, 1.5, 300);
  assert.equal(c.limit, 300);
  assert.ok(c.extra > 0);
});
