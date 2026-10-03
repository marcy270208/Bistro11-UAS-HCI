import { useApp } from "../lib/store.jsx";
import Ico from "../lib/icons.jsx";
import { pic } from "../data/photos.js";
import Photo from "./Photo.jsx";
import { t } from "../lib/i18n.js";

/* .hero__plates is pinned to 542x560 in hero.css and each card is %-sized off it,
   so card a ≈ 309x336, b ≈ 222x213, c ≈ 195x174. Each photo is requested at that
   ratio at ~2x pixels - matching the ratio is what keeps the browser from cropping. */
const PLATES = [
  { cls: "float-card float-card--a", slug: "1504674900247-0877df9cc836", w: 618, h: 672,
    alt: "Three plates of grilled seasonal mains", name: "Beef Tasting Trio", tag: "Chef’s pick" },
  { cls: "float-card float-card--b", slug: "1568901346375-23c9450c58cd", w: 444, h: 425,
    alt: "Signature cheeseburger", name: "Eleven Burger", tag: "1.2k saved" },
  { cls: "float-card float-card--c", slug: "1578985545062-69928b1d9587", w: 390, h: 347,
    alt: "Dark chocolate drip cake", name: "Drip Cake", tag: "Bakery" }
];

export default function Hero() {
  const app = useApp();
  const lang = app.ui.lang;

  return (
    <section className="hero">
      <div className="hero__bg" aria-hidden="true" />
      <div className="hero__grain" aria-hidden="true" />

      <div className="hero__inner">
        <div className="hero__copy">
          <span className="eyebrow reveal" data-reveal>
            <i className="eyebrow__dot" /> {t(lang, "hero.eyebrow")}
          </span>
          <h1 className="reveal" data-reveal>
            {t(lang, "hero.title")}<br /><em>{t(lang, "hero.subtitle")}</em>
          </h1>
          <p className="lede reveal" data-reveal>
            {t(lang, "hero.desc")}
          </p>
          <div className="hero__cta reveal" data-reveal>
            <a className="btn btn--primary" href="#menu"
               onClick={e => { e.preventDefault(); app.goSection("menu"); }}>
              {t(lang, "hero.explore")}
              <Ico name="arrow" />
            </a>
          </div>
          <dl className="hero__stats reveal" data-reveal>
            <div><dt>{t(lang, "hero.stat1.val")}</dt><dd>{t(lang, "hero.stat1.lbl")}</dd></div>
            <div><dt>{t(lang, "hero.stat2.val")}</dt><dd>{t(lang, "hero.stat2.lbl")}</dd></div>
            <div><dt>{t(lang, "hero.stat3.val")}<span>{t(lang, "hero.stat3.unit")}</span></dt><dd>{t(lang, "hero.stat3.lbl")}</dd></div>
          </dl>
        </div>

        <div className="hero__plates">
          {PLATES.map(p => (
            <figure className={p.cls} key={p.slug}>
              <Photo src={pic(p.slug, p.w, p.h)} alt={p.alt} cat="Mains" eager />
              <figcaption><b>{p.name}</b><span>{p.tag}</span></figcaption>
            </figure>
          ))}
          <div className="hero__ring" aria-hidden="true" />
        </div>
      </div>

      <a className="scroll-cue" href="#pillars" aria-label="Scroll down"
         onClick={e => { e.preventDefault(); app.goSection("pillars"); }}>
        <span />
        <em>{t(lang, "hero.scroll")}</em>
      </a>
    </section>
  );
}
