import { useRef, useState } from "react";
import ModalHead from "../ModalHead.jsx";
import Photo from "../Photo.jsx";
import { useApp } from "../../lib/store.jsx";
import { parseIngredients, readAndShrink, safeSrc } from "../../lib/format.js";

export default function EditDishForm({ dish }) {
  const app = useApp();
  const [price, setPrice] = useState(String(dish.price));
  const [mins, setMins] = useState(String(dish.mins));
  const [desc, setDesc] = useState(dish.desc);
  const [ingText, setIngText] = useState(dish.ing.map(x => `${x[0]} ${x[1]}`.trim()).join("\n"));
  const [shots, setShots] = useState(() => [0, 1, 2].map(i => dish.imgs?.[i] || ""));
  const [err, setErr] = useState({});
  const fileRefs = [useRef(null), useRef(null), useRef(null)];

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
    const p = parseFloat(price), m = parseInt(mins, 10);
    const imgs = shots.map(s => safeSrc(s)).filter(Boolean);
    const okPrice = isFinite(p) && p >= 0, okDesc = desc.trim().length >= 8;
    setErr({ price: !okPrice, desc: !okDesc, photo: !imgs.length });
    if (!okPrice || !okDesc || !imgs.length) {
      app.toast("Price, description and one photo are needed", "✍️");
      return;
    }
    const ing = parseIngredients(ingText);
    app.patchDish(dish.id, {
      price: Math.round(p),
      mins: m > 0 ? m : dish.mins,
      desc: desc.trim(),
      ing: ing.length ? ing : dish.ing,
      imgs
    });
    app.closeModal();
    app.toast(`${dish.name} updated on the board`, "👨‍🍳");
  };

  return (
    <>
      <ModalHead title={`Edit ${dish.name}`} sub="Change the price, rewrite the details or swap the angles guests swipe through." />
      <div className="modal__body">
        <div className="row2">
          <div className={`field${err.price ? " err" : ""}`}>
            <label htmlFor="ed-price">Price (Rp)</label>
            <input id="ed-price" type="number" step="1000" min="0" value={price} onChange={e => setPrice(e.target.value)} />
            <small className="field__err">Enter a price of zero or more.</small>
          </div>
          <div className="field">
            <label htmlFor="ed-mins">Prep minutes</label>
            <input id="ed-mins" type="number" min="1" value={mins} onChange={e => setMins(e.target.value)} />
          </div>
        </div>

        <div className={`field${err.desc ? " err" : ""}`}>
          <label htmlFor="ed-desc">Description</label>
          <textarea id="ed-desc" rows="2" value={desc} onChange={e => setDesc(e.target.value)} />
          <small className="field__err">Keep at least a line of description.</small>
        </div>

        <div className="field">
          <label htmlFor="ed-ing">Ingredients - one per line, emoji then text</label>
          <textarea id="ed-ing" rows="8" value={ingText} onChange={e => setIngText(e.target.value)} />
          <small>Format: <code>🧈 French butter</code>. The emoji is optional.</small>
        </div>

        <div className={`field${err.photo ? " err" : ""}`}>
          <label>Swipe angles</label>
          <small>The first photo is the one on the card.</small>
          <small className="field__err">A dish needs at least one photo.</small>
        </div>

        <div className="nd-shots">
          {shots.map((shot, i) => (
            <div className="nd-shot" key={i}>
              <div className="nd-shot__frame">
                {shot
                  ? <Photo src={shot} alt={`${dish.name} - angle ${i + 1}`} cat={dish.cat} />
                  : <span className="nd-shot__empty">{i + 1}</span>}
              </div>
              <input className="nd-shot__url" type="url" value={shot.startsWith("data:") ? "" : shot}
                     onChange={e => pastePhoto(i, e.target.value)} placeholder="https://images.unsplash.com/photo-…"
                     aria-label={`Photo ${i + 1} link`} />
              <button type="button" className="link-btn" onClick={() => fileRefs[i].current?.click()}>
                {shot ? "replace" : "upload"}
              </button>
              {!!shot && (
                <button type="button" className="link-btn" onClick={() => setShot(i, "")}>remove</button>
              )}
              <input ref={fileRefs[i]} type="file" accept="image/*" tabIndex={-1}
                     onChange={e => { uploadPhoto(i, e.target.files?.[0]); e.target.value = ""; }} />
            </div>
          ))}
        </div>
      </div>

      <div className="modal__foot">
        <button className="btn btn--ghost" onClick={app.closeModal}>Cancel</button>
        <button className="btn btn--primary" onClick={submit}>Save dish</button>
      </div>
    </>
  );
}
