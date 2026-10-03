import { useApp } from "../lib/store.jsx";
import { t } from "../lib/i18n.js";
import { pic } from "../data/photos.js";
import Photo from "./Photo.jsx";

/* .story__media is a fixed 537:600 box and the shots are %-sized off it, so each
   frame keeps one shape at every breakpoint: 0.98:1, 1.02:1, 1.03:1. Requesting
   the photos at those ratios (2x for retina) means the browser never crops. */
const SHOTS = [
  { cls: "shot shot--1", slug: "1414235077428-338989a2e8c0", w: 752, h: 768, alt: "Candlelit table being served at Bistro Eleven" },
  { cls: "shot shot--2", slug: "1543007630-9710e4a00a20", w: 504, h: 492, alt: "The amber-lit bar" },
  { cls: "shot shot--3", slug: "1442512595331-e89e73853f31", w: 408, h: 396, alt: "Barista pouring a slow brew" }
];

export default function Story() {
  const { ui } = useApp();
  const lang = ui.lang;
  return (
    <section className="story" id="story">
      <div className="wrap story__grid">
        <div className="story__media">
          {SHOTS.map(s => (
            <figure className={s.cls} key={s.slug}>
              <Photo src={pic(s.slug, s.w, s.h)} alt={s.alt} cat="Mains" />
            </figure>
          ))}
        </div>
        <div className="story__copy">
          <span className="eyebrow reveal" data-reveal><i className="eyebrow__dot" /> Our story</span>
          <h2 className="reveal" data-reveal>{t(lang, "story.title").split("\\n").map((line, i) => <span key={i}>{line}<br/></span>)}</h2>
          <p className="reveal" data-reveal>We opened in a narrow corner unit with eleven stools and a second-hand wood oven that
            leaked smoke for the first three weeks. Nobody left. Turns out people will wait for a
            thing that is actually being cooked.</p>
          <p className="reveal" data-reveal>Everything still follows that rule - the bread is laminated before sunrise, the
            cordials are pressed by hand, and nothing on the board has been sitting since yesterday.
            When you order, the ticket prints on the pass and the clock starts.</p>
          <ul className="story__list reveal" data-reveal>
            <li><b>{t(lang, "story.li1.b")}</b> {t(lang, "story.li1.s")}</li>
            <li><b>{t(lang, "story.li2.b")}</b> {t(lang, "story.li2.s")}</li>
            <li><b>{t(lang, "story.li3.b")}</b> {t(lang, "story.li3.s")}</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
