import { useState } from "react";
import { useApp } from "../lib/store.jsx";
import { BADGES } from "../data/menu.js";
import { money } from "../lib/format.js";
import Ico from "../lib/icons.jsx";
import PhotoGallery from "./PhotoGallery.jsx";
import DishDetail from "./modals/DishDetail.jsx";
import { t } from "../lib/i18n.js";

export default function DishCard({ d }) {
  const app = useApp();
  const lang = app.ui.lang;
  const q = app.data.cart[d.id] || 0;
  const saved = app.data.wish.includes(d.id);
  const badge = d.badge ? BADGES[d.badge] : null;
  const [burst, setBurst] = useState(false);

  const fav = () => {
    if (app.toggleWish(d.id) === false) return;
    setBurst(true);
    setTimeout(() => setBurst(false), 620);
  };

  return (
    <article className="dish" data-id={d.id}>
      <div className="dish__media">
        <PhotoGallery photos={d.imgs} name={t(lang, `dish.${d.id}.name`, d.name)} cat={d.cat} size="card" />
        <div className="dish__scrim" />
        <div className="dish__badge">
          {badge && <span className={badge[1]}>{t(lang, `badge.${d.badge}`)}</span>}
          <span className="tag">{t(lang, `cat.${d.cat}`)}</span>
        </div>
        <button className={`heart${saved ? " is-on" : ""}${burst ? " burst" : ""}`}
                onClick={fav} aria-label={`Save ${d.name} to wishlist`} aria-pressed={saved}>
          <Ico name="heart" />
        </button>
      </div>

      <div className="dish__body">
        <div className="dish__top">
          <h3 className="dish__name">{t(lang, `dish.${d.id}.name`, d.name)}</h3>
          <span className="dish__price">{money(d.price)}</span>
        </div>
        <p className="dish__desc">{t(lang, `dish.${d.id}.desc`, d.desc)}</p>
        <div className="dish__meta">
          <span className="star">★ {Number(d.rating).toFixed(1)}</span>
          <span>⏱ {d.mins} min</span>
          <span>🔥 {d.kcal} kcal</span>
        </div>
        <div className="dish__foot">
          <button className="dish__details" onClick={() => app.openModal(<DishDetail dish={d} />, "modal--wide")}>
            {t(lang, "dish.details")} <Ico name="arrow" />
          </button>
          {q ? (
            <div className="dish__qty">
              <button onClick={() => app.setQty(d.id, -1)} aria-label="One less">−</button>
              <b>{q}</b>
              <button onClick={() => app.setQty(d.id, 1)} aria-label="One more">+</button>
            </div>
          ) : (
            <button className="dish__add" onClick={() => app.setQty(d.id, 1)}>
              <Ico name="plus" /> {t(lang, "dish.add")}
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
