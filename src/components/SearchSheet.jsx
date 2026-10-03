import { useEffect, useRef } from "react";
import { useApp, searchDishes } from "../lib/store.jsx";
import Ico from "../lib/icons.jsx";

export default function SearchSheet() {
  const app = useApp();
  const { ui, patchUi, results, goSection } = app;
  const input = useRef(null);

  useEffect(() => {
    if (!ui.search) return;
    const t = setTimeout(() => input.current?.focus(), 60);
    return () => clearTimeout(t);
  }, [ui.search]);

  const close = () => patchUi({ search: false });
  const q = ui.query.trim().toLowerCase();
  const onConsole = app.isStaff && ui.view === "admin";
  const chefN = onConsole ? searchDishes(app.data.menu, q).list.length : 0;
  const n = onConsole ? chefN : results.list.length;

  const type = v => patchUi(onConsole && v.trim() ? { query: v, adminTab: "dishes" } : { query: v });

  return (
    <div className="search-sheet" hidden={!ui.search}>
      <div className="search-sheet__inner">
        <Ico name="search" className="search-sheet__ico" />
        <input
          ref={input}
          id="search-input"
          type="text"
          value={ui.query}
          placeholder={onConsole
            ? "Search the chef board - names, tags, categories…"
            : "Search the menu - try “p” for Penne, Pesto, Pan-Seared…"}
          autoComplete="off"
          spellCheck="false"
          aria-label={onConsole ? "Search the chef board" : "Search the menu"}
          onChange={e => type(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Escape") close();
            if (e.key === "Enter") { close(); goSection("menu"); }
          }}
        />
        <kbd>Esc</kbd>
        <button className="text-btn" onClick={() => type("")}>Clear</button>
      </div>
      <p className="search-sheet__hint">
        {!q
          ? onConsole
            ? "Filters the Menu tab below - hidden dishes included."
            : "Prefix search - one letter is enough. Press / anywhere to jump here."
          : n === 0
            ? <>Nothing on the {onConsole ? "chef board" : "board"} matches “{q}”.</>
            : onConsole
              ? <>
                  <b>{n}</b> of {app.data.menu.length} dishes match “{q}”
                  {" - showing them on the Menu tab"}
                </>
              : <>
                  <b>{n}</b> {n === 1 ? "dish" : "dishes"} match “{q}”
                  {results.exact === false ? " - none start with it, so we widened to contains" : ""}
                </>}
      </p>
    </div>
  );
}
