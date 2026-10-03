import { useRef, useState } from "react";
import ModalHead from "../ModalHead.jsx";
import Photo from "../Photo.jsx";
import { useApp } from "../../lib/store.jsx";
import { parseIngredients, readAndShrink, safeSrc, uid } from "../../lib/format.js";
import { CATEGORIES } from "../../data/menu.js";

const BADGE_OPTS = [["", "None"], ["new", "New"], ["chef", "Chef's pick"], ["hot", "Spicy"], ["veg", "Veggie"]];
const SLOT_HINTS = ["Angle 1 - the plate straight on", "Angle 2 - close on the toppings", "Angle 3 - the wider table shot"];

const emptyForm = {
  name: "", cat: CATEGORIES[0], price: "", badge: "", mins: "18", kcal: "520",
  desc: "", ing: "", alg: ""
};

export default function NewDishForm() {
  const app = useApp();
  const [f, setF] = useState(emptyForm);
  const [shots, setShots] = useState(["", "", ""]);
  const [err, setErr] = useState({});
  const fileRefs = [useRef(null), useRef(null), useRef(null)];

  const set = (k, v) => setF(s => ({ ...s, [k]: v }));
  const setShot = (i, v) => setShots(s => s.map((x, n) => (n === i ? v : x)));

  const pastePhoto = (i, raw) => {
    const value = String(raw || "").trim();
    if (!value) { setShot(i, ""); return; }
    const ok = safeSrc(value);
    setShot(i, ok);
    if (!ok) app.toast("Only a full https:// image link can be used", "🔗");
  };

  const uploadPhoto = async (i, file) => {
    if (!file) return;
    try {
      setShot(i, await readAndShrink(file, 900));
    } catch {
      app.toast("That file isn't a readable image", "🖼️");
    }
  };

  const submit = () => {
    const name = f.name.trim(), desc = f.desc.trim();
    const price = parseFloat(f.price), mins = parseInt(f.mins, 10), kcal = parseInt(f.kcal, 10);
    const imgs = shots.map(s => safeSrc(s)).filter(Boolean);
    const okName = name.length >= 2, okPrice = isFinite(price) && price > 0, okDesc = desc.length >= 8;
    setErr({ name: !okName, price: !okPrice, desc: !okDesc, photo: !imgs.length });
    if (!okName || !okPrice || !okDesc || !imgs.length) {
      app.toast("Name, price, description and at least one photo are needed", "✍️");
      return;
    }
    const ing = parseIngredients(f.ing);
    const cat = f.cat;
    app.addDish({
      id: uid("X"), name, cat, price: Math.round(price),
      badge: f.badge || null, rating: 5, reviews: 0,
      mins: mins > 0 ? mins : 18, kcal: kcal > 0 ? kcal : 520,
      desc,
      ing: ing.length ? ing : [["•", "Made to the chef's recipe"]],
      alg: f.alg.split(",").map(s => s.trim()).filter(Boolean),
      tags: `${cat} ${name}`.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean),
      imgs, available: true
    });
    app.closeModal();
  };

  return (
    <>
      <ModalHead title="Add a dish" sub="Fill the ticket and it goes straight onto the guest board." />
      <div className="modal__body">
        <div className="row2">
          <div className={`field${err.name ? " err" : ""}`}>
            <label htmlFor="nd-name">Dish name</label>
            <input id="nd-name" value={f.name} onChange={e => set("name", e.target.value)} placeholder="e.g. Miso Butter Ramen" />
            <small className="field__err">Give the dish a name.</small>
          </div>
          <div className="field">
            <label htmlFor="nd-cat">Category</label>
            <select id="nd-cat" value={f.cat} onChange={e => set("cat", e.target.value)}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="row2">
          <div className={`field${err.price ? " err" : ""}`}>
            <label htmlFor="nd-price">Price (Rp)</label>
            <input id="nd-price" type="number" step="1000" min="0" value={f.price}
                   onChange={e => set("price", e.target.value)} placeholder="85000" />
            <small className="field__err">Enter a price above zero.</small>
          </div>
          <div className="field">
            <label htmlFor="nd-badge">Badge on the card</label>
            <select id="nd-badge" value={f.badge} onChange={e => set("badge", e.target.value)}>
              {BADGE_OPTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
        </div>

        <div className="row2">
          <div className="field">
            <label htmlFor="nd-mins">Minutes from the pass</label>
            <input id="nd-mins" type="number" min="1" value={f.mins} onChange={e => set("mins", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="nd-kcal">kcal per serving</label>
            <input id="nd-kcal" type="number" min="1" value={f.kcal} onChange={e => set("kcal", e.target.value)} />
          </div>
        </div>

        <div className={`field${err.desc ? " err" : ""}`}>
          <label htmlFor="nd-desc">What the guest reads</label>
          <textarea id="nd-desc" rows="2" value={f.desc} onChange={e => set("desc", e.target.value)}
                    placeholder="Two lines on what it is and how we cook it." />
          <small className="field__err">A short description, please.</small>
        </div>

        <div className="field">
          <label htmlFor="nd-ing">Ingredients - one per line, emoji then text</label>
          <textarea id="nd-ing" rows="5" value={f.ing} onChange={e => set("ing", e.target.value)}
                    placeholder={"🍜 Hand-pulled noodles\n🥚 Soft egg"} />
          <small>Format: <code>🧈 French butter</code>. The emoji is optional.</small>
        </div>

        <div className="field">
          <label htmlFor="nd-alg">Allergens, comma separated</label>
          <input id="nd-alg" value={f.alg} onChange={e => set("alg", e.target.value)} placeholder="Gluten, Egg" />
        </div>

        <div className={`field${err.photo ? " err" : ""}`}>
          <label>Photos guests can swipe through</label>
          <small>Angle 1 is the card photo. Add two more so the guest can swipe for a different view.</small>
          <small className="field__err">Add at least one photo.</small>
        </div>

        <div className="nd-shots">
          {SLOT_HINTS.map((hint, i) => (
            <div className="nd-shot" key={hint}>
              <div className="nd-shot__frame">
                {shots[i]
                  ? <Photo src={shots[i]} alt={`${f.name || "New dish"} - angle ${i + 1}`} cat={f.cat} />
                  : <span className="nd-shot__empty">{i + 1}</span>}
              </div>
              <input className="nd-shot__url" type="url" value={shots[i].startsWith("data:") ? "" : shots[i]}
                     onChange={e => pastePhoto(i, e.target.value)} placeholder="https://images.unsplash.com/photo-…"
                     aria-label={`Photo ${i + 1} link`} />
              <button type="button" className="link-btn" onClick={() => fileRefs[i].current?.click()}>
                {i === 0 ? "upload from this device" : "upload"}
              </button>
              <input ref={fileRefs[i]} type="file" accept="image/*" tabIndex={-1}
                     onChange={e => { uploadPhoto(i, e.target.files?.[0]); e.target.value = ""; }} />
              <small className="muted">{hint}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="modal__foot">
        <button className="btn btn--ghost" onClick={app.closeModal}>Cancel</button>
        <button className="btn btn--primary" onClick={submit}>Put it on the board</button>
      </div>
    </>
  );
}
