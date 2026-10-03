import { useApp } from "../lib/store.jsx";
import { CATEGORIES } from "../data/menu.js";
import Ico from "../lib/icons.jsx";
import { t } from "../lib/i18n.js";

export default function ChipBar() {
  const { ui, counts, data, patchUi, showSavedOnly } = useApp();
  const lang = ui.lang;
  const cats = ["All", ...CATEGORIES];

  return (
    <>
      <div className="chips">
        {cats.map(c => (
          <button key={c} className={`chip${ui.cat === c ? " is-on" : ""}`} onClick={() => patchUi({ cat: c })}>
            {c === "All" ? t(lang, "chip.all") : t(lang, `cat.${c}`)}
            <span className="chip__n">{counts[c] || 0}</span>
          </button>
        ))}
      </div>
      <div className="toolbar__right">
        <label className="sort">
          <span>{t(lang, "chip.sort")}</span>
          <select value={ui.sort} onChange={e => patchUi({ sort: e.target.value })}>
            <option value="featured">{t(lang, "sort.featured")}</option>
            <option value="price-asc">{t(lang, "sort.price_asc")}</option>
            <option value="price-desc">{t(lang, "sort.price_desc")}</option>
            <option value="rating">{t(lang, "sort.rating")}</option>
            <option value="az">{t(lang, "sort.az")}</option>
          </select>
        </label>
        <button className={`chip chip--wish${ui.wishOnly ? " is-on" : ""}`} aria-pressed={ui.wishOnly}
                onClick={() => showSavedOnly(!ui.wishOnly)}>
          <Ico name="heart" />
          {t(lang, "chip.saved")} <span className="chip__n">{data.wish.length}</span>
        </button>
      </div>
    </>
  );
}
