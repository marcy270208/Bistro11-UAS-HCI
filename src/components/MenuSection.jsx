import { useApp } from "../lib/store.jsx";
import ChipBar from "./ChipBar.jsx";
import DishGrid from "./DishGrid.jsx";
import { t } from "../lib/i18n.js";

export default function MenuSection() {
  const { ui, results, onSale, resetFilters } = useApp();
  const lang = ui.lang;
  const list = results.list;
  const label = ui.wishOnly ? t(lang, "menu.saved_dishes") : ui.cat === "All" ? t(lang, "menu.full_board") : ui.cat;
  const query = ui.query.trim().toLowerCase();

  return (
    <section className="menu" id="menu">
      <div className="wrap">
        <header className="sec-head">
          <div>
            <span className="eyebrow reveal" data-reveal><i className="eyebrow__dot" /> {t(lang, "menu.board")}</span>
            <h2 className="reveal" data-reveal>{t(lang, "menu.title")}</h2>
          </div>
        </header>

        <div className="toolbar reveal" data-reveal>
          <ChipBar />
        </div>

        {list.length > 0 && (
          <p className="result-meta">
            {t(lang, "menu.showing")} <b>{list.length}</b> {t(lang, "menu.of")} {onSale.length} · {label}
            {query && <> · {t(lang, "menu.matching")} “<b>{query}</b>”</>}
            {results.exact === false && <small> {t(lang, "menu.widened")}</small>}
          </p>
        )}

        {list.length > 0 ? <DishGrid /> : (
          <div className="empty">
            <span>🍽️</span>
            <h4>{t(lang, "menu.empty.title")}</h4>
            <p>{query ? `${t(lang, "menu.empty.starts")} “${query}”.`
              : ui.wishOnly ? t(lang, "menu.empty.saved") : t(lang, "menu.empty.section")}</p>
            <button className="btn btn--ghost" onClick={resetFilters}>{t(lang, "menu.empty.btn")}</button>
          </div>
        )}
      </div>
    </section>
  );
}
