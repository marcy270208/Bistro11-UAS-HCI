import { useApp } from "../../lib/store.jsx";
import { money } from "../../lib/format.js";
import ModalHead from "../ModalHead.jsx";
import Stars from "../Stars.jsx";
import PhotoGallery from "../PhotoGallery.jsx";
import { t } from "../../lib/i18n.js";

function kitchenNote(d, lang) {
  if (d.cat === "Drinks") return t(lang, "note.drinks", "Made to order at the bar. Tell us the ice level in your notes and we will honour it.");
  if (d.cat === "Bakery") return t(lang, "note.bakery", "Baked at 06:00. Anything left after 19:00 goes to the shelter on Lantern Lane, never back in the case.");
  if (d.cat === "Desserts") return t(lang, "note.desserts", "Held chilled and finished at the pass. Can be made for the table in about ten minutes.");
  if (d.alg.length) return t(lang, "note.alg", `Contains ${d.alg.map(a => t(lang, `alg.${a}`, a)).join(", ").toLowerCase()}. Swap any element out - the kitchen is happy to adapt, just say the word in your notes.`);
  return t(lang, "note.default", "Cooked strictly to order. Nothing on this plate has been sitting under a lamp.");
}

export default function DishDetail({ dish: d }) {
  const app = useApp();
  const lang = app.ui.lang;
  const q = app.data.cart[d.id] || 0;
  const saved = app.data.wish.includes(d.id);
  const reviewCount = d.reviews || 0;

  return (
    <>
      <div className="dd__hero">
        <PhotoGallery photos={d.imgs} name={t(lang, `dish.${d.id}.name`, d.name)} cat={d.cat} size="wide"
                      label={`${t(lang, `dish.${d.id}.name`, d.name)} - ${t(lang, "detail.drag")}`} />
        <span className="dd__price-tag">{money(d.price)}</span>
      </div>

      <ModalHead
        title={t(lang, `dish.${d.id}.name`, d.name)}
        sub={<>
          <Stars value={Number(d.rating)} /> {Number(d.rating).toFixed(1)} · {reviewCount} {t(lang, "detail.reviews")} · {d.mins} {t(lang, "detail.pass")}
        </>}
      />

      <div className="modal__body">
        <p className="dd__lead">{t(lang, `dish.${d.id}.desc`, d.desc)}</p>

        <div className="dd__sec">
          <h4>{t(lang, "detail.ing")}</h4>
          <ul className="ing">
            {d.ing.map(([emoji, label], i) => (
              <li key={i} style={{ animationDelay: `${i * 45}ms` }}><i>{emoji || "•"}</i>{label}</li>
            ))}
          </ul>
        </div>

        {d.alg.length > 0 && (
          <div className="dd__sec">
            <h4>{t(lang, "detail.alg")}</h4>
            <div className="allergens">{d.alg.map(a => <span className="allergen" key={a}>⚠ {a}</span>)}</div>
          </div>
        )}

        <div className="dd__sec">
          <h4>{t(lang, "detail.nutri")}</h4>
          <div className="nutri">
            <div><b>{d.kcal}</b><span>kcal</span></div>
            <div><b>{Math.round(d.kcal * 0.045)}g</b><span>{t(lang, "detail.protein")}</span></div>
            <div><b>{Math.round(d.kcal * 0.09)}g</b><span>{t(lang, "detail.carbs")}</span></div>
            <div><b>{Math.round(d.kcal * 0.038)}g</b><span>{t(lang, "detail.fat")}</span></div>
          </div>
        </div>

        <div className="dd__sec">
          <h4>{t(lang, "detail.note")}</h4>
          <p className="dd__lead" style={{ margin: 0 }}>{kitchenNote(d, lang)}</p>
        </div>
      </div>

      <div className="modal__foot">
        <button className="btn btn--ghost" onClick={() => app.toggleWish(d.id)}>
          {saved ? "❤️ " + t(lang, "detail.saved") : "🤍 " + t(lang, "detail.save")}
        </button>
        <button className="btn btn--primary" onClick={() => { app.setQty(d.id, 1); app.closeModal(); }}>
          {q ? `Add another · ${money(d.price)}` : `Add to cart · ${money(d.price)}`}
        </button>
      </div>
    </>
  );
}
