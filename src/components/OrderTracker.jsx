import { useEffect, useRef, useState } from "react";
import { useApp } from "../lib/store.jsx";
import { money, plural } from "../lib/format.js";
import Bill from "./modals/Bill.jsx";

const CIRC = 2 * Math.PI * 52;

/* stage labels + copy ported verbatim from the vanilla runTracker() */
const stepsFor = order => ({
  delivery: ["Ticket on the pass", "In the kitchen", "Plating & boxing", "Rider on the way"],
  pickup: ["Ticket on the pass", "In the kitchen", "Plating & boxing", "Waiting at the counter"],
  table: ["Ticket on the pass", "In the kitchen", "Plating at the pass", "Being set at table " + (order.table || "-")]
}[order.type] || []);

const titlesFor = order => [
  ["Sending your ticket to the pass…", "The kitchen printer just woke up."],
  ["Fire!", "Your dishes are on the burners now."],
  ["Plating and boxing", "Sauce goes in last so nothing sails."],
  [order.type === "delivery" ? "The rider just left" : order.type === "pickup" ? "Ready at the counter" : "On its way to your table",
    `Estimated ${order.eta} minutes from the first ticket.`]
];

const PER = 1750;   /* ms between stage ticks, first tick after 700ms */

export default function OrderTracker() {
  const app = useApp();
  const order = app.tracker;
  const [step, setStep] = useState(-1);       /* -1 = ticket sent, no stage ticked yet */
  const [doneAll, setDoneAll] = useState(false);
  const [out, setOut] = useState(false);
  const timers = useRef([]);

  useEffect(() => {
    setStep(-1); setDoneAll(false); setOut(false);
    if (!order) return undefined;

    const n = stepsFor(order).length || 1;

    const push = (fn, ms) => timers.current.push(setTimeout(fn, ms));
    for (let i = 0; i < n; i++) push(() => setStep(i), 700 + i * PER);
    const tEnd = 700 + (n - 1) * PER;
    push(() => setDoneAll(true), tEnd + 900);
    push(() => setOut(true), tEnd + 900 + 700);
    push(() => {
      app.setTracker(null);
      app.openModal(<Bill order={order} />, "modal--slim");
    }, tEnd + 900 + 700 + 460);

    return () => { timers.current.forEach(clearTimeout); timers.current = []; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  if (!order) return null;

  const steps = stepsFor(order);
  const len = steps.length || 1;
  const frac = step < 0 ? 0 : (step + 1) / len;
  const pct = Math.round(frac * 100);
  const offset = CIRC * (1 - frac);
  const pair = step < 0
    ? ["Sending your ticket to the pass…",
       `Order ${order.id} · ${plural(order.items.reduce((q, i) => q + i.qty, 0), "item")} · ${money(order.totals.total)}`]
    : titlesFor(order)[Math.min(step, 3)];

  return (
    <div className={`tracker${out ? " is-out" : ""}`} id="tracker">
      <div className="tracker__card">
        <div className="tracker__pan">
          <span className="steam s1" /><span className="steam s2" /><span className="steam s3" />
          <div className="pan">🍳</div>
          <div className="tracker__ring">
            <svg viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" className="ring-bg" />
              <circle cx="60" cy="60" r="52" className="ring-fg"
                      style={{ strokeDasharray: CIRC, strokeDashoffset: offset }} />
            </svg>
            <b id="ring-pct">{pct}%</b>
          </div>
        </div>
        <h3 id="tracker-title">{pair[0]}</h3>
        <p id="tracker-sub">{pair[1]}</p>
        <ol className="tracker__steps" id="tracker-steps">
          {steps.map((s, i) => {
            const done = doneAll || i < step;
            const active = !doneAll && i === step;
            return (
              <li key={i} data-i={i} className={`${done ? "is-done" : ""} ${active ? "is-active" : ""}`.trim()}>
                <i>{done ? "✓" : i + 1}</i>{s}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
