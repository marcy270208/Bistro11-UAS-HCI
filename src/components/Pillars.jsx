import { useApp } from "../lib/store.jsx";
import { t } from "../lib/i18n.js";

export default function Pillars() {
  const app = useApp();
  const lang = app.ui.lang;

  return (
    <section className="pillars" id="pillars">
      <div className="wrap">
        <div className="pillar-grid">
          <article className="pillar reveal" data-reveal>
            <span className="pillar__ico">🔥</span>
            <h3>{t(lang, "pillars.mains.title")}</h3>
            <p>{t(lang, "pillars.mains.desc")}</p>
            <button className="link-btn" onClick={() => app.jumpCat("Mains")}>{t(lang, "pillars.mains.link")}</button>
          </article>
          <article className="pillar reveal" data-reveal>
            <span className="pillar__ico">🥐</span>
            <h3>{t(lang, "pillars.bakery.title")}</h3>
            <p>{t(lang, "pillars.bakery.desc")}</p>
            <button className="link-btn" onClick={() => app.jumpCat("Bakery")}>{t(lang, "pillars.bakery.link")}</button>
          </article>
          <article className="pillar reveal" data-reveal>
            <span className="pillar__ico">🍹</span>
            <h3>{t(lang, "pillars.drinks.title")}</h3>
            <p>{t(lang, "pillars.drinks.desc")}</p>
            <button className="link-btn" onClick={() => app.jumpCat("Drinks")}>{t(lang, "pillars.drinks.link")}</button>
          </article>
        </div>
      </div>
    </section>
  );
}
