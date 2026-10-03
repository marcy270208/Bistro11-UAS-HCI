import { useState } from "react";
import { useApp } from "../../lib/store.jsx";
import { PAY_METHODS, PROMOS, SPICE_WORDS, payLabel } from "../../data/biz.js";
import { money, okEmail, plural, uid } from "../../lib/format.js";
import ModalHead from "../ModalHead.jsx";
import { t } from "../../lib/i18n.js";

const SLOTS = ["18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];
const TYPES = [
  ["delivery", "🛵", "Delivery", "22-35 min"],
  ["pickup", "🥡", "Pickup", "15 min"],
  ["table", "🍷", "At the table", "now"]
];

export default function Checkout() {
  const app = useApp();
  const lang = app.ui.lang;
  const who = app.me;
  const [type, setType] = useState("delivery");
  const [pay, setPay] = useState(PAY_METHODS[0][0]);
  const [spice, setSpice] = useState(2);
  const [promo, setPromo] = useState("");
  const [code, setCode] = useState("");
  const [contactless, setContactless] = useState(true);
  const [errs, setErrs] = useState({});
  const [f, setF] = useState({
    name: who?.name || "", phone: who?.phone || "", address: who?.address || "",
    slot: "19:00", table: "4", notes: "", email: who?.email || ""
  });

  const calculatedTotals = app.totals(type, promo);
  const set = (k, v) => { setF(s => ({ ...s, [k]: v })); setErrs(e => ({ ...e, [k]: false })); };
  const feeName = type === "table" ? "Table service" : type === "pickup" ? "Pickup tray" : "Delivery";

  const applyPromo = () => {
    const c = code.trim().toUpperCase();
    if (!c) { setPromo(""); return; }
    if (!PROMOS[c]) { app.toast(`“${c}” isn't a code we know`, "🎟️"); return; }
    setPromo(c);
    app.toast(`${PROMOS[c].label} applied`, "🎉");
  };

  const send = () => {
    const bad = {
      name: f.name.trim().length < 2,
      phone: f.phone.replace(/\D/g, "").length < 7,
      address: type === "delivery" && f.address.trim().length < 6,
      email: !!f.email.trim() && !okEmail(f.email.trim())
    };
    setErrs(bad);
    if (Object.values(bad).some(Boolean)) { app.toast("A couple of fields still need you", "✍️"); return; }

    app.placeOrder({
      id: uid("BE-"), email: who?.email || "",
      name: f.name.trim(), phone: f.phone.trim(),
      address: type === "delivery" ? f.address.trim() : "-",
      type, slot: f.slot, table: type === "table" ? f.table : "",
      spice, notes: f.notes.trim(), contactless, promo, pay,
      items: app.cartList.map(({ d, q }) => ({ id: d.id, name: d.name, price: d.price, qty: q, cat: d.cat })),
      totals: calculatedTotals, status: "new", created: Date.now(), eta: 22 + Math.floor(Math.random() * 12)
    });
    app.closeModal();
  };

  return (
    <>
      <ModalHead title="Set your order" sub="The last few things the kitchen needs before it fires your ticket." />
      <div className="co">
        <div className="co__form">
          <div className="field">
            <label>How are we getting this to you?</label>
            <div className="seg">
              {TYPES.map(([v, ico, title, sub]) => (
                <label key={v}>
                  <input type="radio" name="otype" value={v} checked={type === v} onChange={() => setType(v)} />
                  <span>{ico}</span><b>{title}</b><small>{sub}</small>
                </label>
              ))}
            </div>
          </div>

          <div className="row2">
            <div className={`field${errs.name ? " err" : ""}`}>
              <label htmlFor="co-name">Name on the ticket</label>
              <input id="co-name" value={f.name} placeholder="e.g. Nadia" autoFocus
                     onChange={e => set("name", e.target.value)} />
              <small className="field__err">We need a name to call out.</small>
            </div>
            <div className={`field${errs.phone ? " err" : ""}`}>
              <label htmlFor="co-phone">{t(lang, "checkout.phone")}</label>
              <input id="co-phone" inputMode="tel" value={f.phone} placeholder="+62 811 2233 4455"
                     onChange={e => set("phone", e.target.value)} />
              <small className="field__err">At least 7 digits, so the rider can reach you.</small>
            </div>
          </div>

          <div className={`field${errs.address ? " err" : ""}`} hidden={type !== "delivery"}>
            <label htmlFor="co-addr">Delivery address</label>
            <input id="co-addr" value={f.address} placeholder="Street, unit, postcode"
                   onChange={e => set("address", e.target.value)} />
            <small className="field__err">Where is the door?</small>
          </div>

          <div className="row2">
            <div className="field">
              <label htmlFor="co-slot">{type === "table" ? "Sitting time" : "Ready at"}</label>
              <select id="co-slot" value={f.slot} onChange={e => set("slot", e.target.value)}>
                {SLOTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="field" hidden={type !== "table"}>
              <label htmlFor="co-table">{t(lang, "checkout.table_no")}</label>
              <input id="co-table" type="number" min="1" max="11" value={f.table}
                     onChange={e => set("table", e.target.value)} />
              <small>Eleven tables, no more.</small>
            </div>
          </div>

          <div className="field">
            <label htmlFor="co-spice">Heat dial - how much chilli on the pass?</label>
            <div className="range">
              <input id="co-spice" type="range" min="0" max="4" step="1" value={spice}
                     onChange={e => setSpice(+e.target.value)} />
              <div className="range__labels"><span>None</span><span>Warm</span><span>Medium</span><span>Hot</span><span>Fire</span></div>
              <span className="range__now">{SPICE_WORDS[spice]}</span>
            </div>
          </div>

          <label className="switch" htmlFor="co-contact">
            <span><b>Contactless hand-off</b><small>Rider leaves it at the door and steps back.</small></span>
            <input type="checkbox" id="co-contact" checked={contactless} onChange={e => setContactless(e.target.checked)} />
            <span className="track" />
          </label>

          <div className="field">
            <label htmlFor="co-notes">Notes for the kitchen</label>
            <textarea id="co-notes" value={f.notes} placeholder="Allergies, well-done, no onion, ring the bell twice…"
                      onChange={e => set("notes", e.target.value)} />
          </div>

          <div className="field">
            <label>How are you paying?</label>
            <div className="pay">
              {PAY_METHODS.map(([v, ico, title, hint]) => (
                <label key={v}>
                  <input type="radio" name="opay" value={v} checked={pay === v} onChange={() => setPay(v)} />
                  <span>{ico}</span><b>{title}</b><small>{hint}</small>
                </label>
              ))}
            </div>
          </div>

          <div className={`field${errs.email ? " err" : ""}`}>
            <label htmlFor="co-email">Receipt email (optional)</label>
            <input id="co-email" type="email" value={f.email} placeholder="you@example.com"
                   onChange={e => set("email", e.target.value)} />
            <small className="field__err">That email doesn't look right.</small>
          </div>
        </div>

        <aside className="co__side">
          <h4>Your basket</h4>
          <div className="co-list">
            {app.cartList.map(({ d, q }) => <div key={d.id}><span>{q}× {d.name}</span><b>{money(d.price * q)}</b></div>)}
          </div>

          <h4>Promo</h4>
          <div className="promo">
            <input value={code} placeholder="BISTRO11" onChange={e => setCode(e.target.value)}
                   onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); applyPromo(); } }} />
            <button type="button" onClick={applyPromo}>{t(lang, "checkout.apply")}</button>
          </div>

          <div className="co-totals">
            <div className="line"><span>Subtotal</span><b>{money(calculatedTotals.sub)}</b></div>
            <div className="line line--muted"><span>Kitchen tax 8.25%</span><span>{money(calculatedTotals.tax)}</span></div>
            <div className="line line--muted"><span>Service 5%</span><span>{money(calculatedTotals.service)}</span></div>
            <div className="line line--muted"><span>{t(lang, "checkout.fee")}</span><span>{calculatedTotals.delivery === 0 ? "Free" : money(calculatedTotals.delivery)}</span></div>
            {calculatedTotals.discount > 0 && (
              <div className="line line--muted"><span className="disc">{calculatedTotals.promo.label}</span><span className="disc">−{money(calculatedTotals.discount)}</span></div>
            )}
            <div className="line grand"><span>Total</span><b>{money(calculatedTotals.total)}</b></div>
            <div className="line line--muted"><span>You pay with</span><b>{payLabel(pay)}</b></div>
          </div>

          <p className="muted" style={{ fontSize: ".76rem" }}>
            {plural(app.cartCount, "item")} · {feeName.toLowerCase()} · code BISTRO11 · FIRSTBITE · LATEPASS
          </p>
          <button className="btn btn--primary btn--block" onClick={send}>Send to the kitchen</button>
        </aside>
      </div>
    </>
  );
}
