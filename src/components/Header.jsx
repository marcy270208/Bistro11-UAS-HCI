import { useEffect, useRef, useState } from "react";
import { useApp } from "../lib/store.jsx";
import Ico from "../lib/icons.jsx";
import { initial, safeAvatar } from "../lib/format.js";
import { STAFF } from "../data/biz.js";
import AccountPanel from "./modals/AccountPanel.jsx";
import { t } from "../lib/i18n.js";

const NAV = [["menu", "nav.menu"], ["story", "nav.story"], ["gallery", "nav.gallery"], ["reviews", "nav.reviews"], ["visit", "nav.visit"]];

export default function Header() {
  const { ui, data, me, isStaff, signedIn, cartCount, patchUi, setTheme, openModal, openBasket, openWishlist, showAuth, goSection, setLang } = useApp();
  const lang = ui.lang;
  const [stuck, setStuck] = useState(false);
  const [active, setActive] = useState("");
  const cartBtn = useRef(null);
  const prevCount = useRef(cartCount);

  useEffect(() => {
    const on = () => setStuck(window.scrollY > 24);
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);

  useEffect(() => {
    if (ui.view !== "guest") return;
    const secs = NAV.map(([id]) => document.getElementById(id)).filter(Boolean);
    if (!secs.length) return;
    const io = new IntersectionObserver(
      es => es.forEach(en => { if (en.isIntersecting) setActive(en.target.id); }),
      { rootMargin: "-45% 0px -50% 0px" });
    secs.forEach(s => io.observe(s));
    return () => io.disconnect();
  }, [ui.view]);

  useEffect(() => {
    if (cartCount > prevCount.current) {
      cartBtn.current?.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.22) rotate(-8deg)" }, { transform: "scale(1)" }],
        { duration: 420, easing: "cubic-bezier(.22,1,.36,1)" });
    }
    prevCount.current = cartCount;
  }, [cartCount]);

  const pic = safeAvatar(me?.avatar);
  const wishN = data.wish.length;

  const openAccountButton = () => {
    if (isStaff) { patchUi({ view: "admin", adminTab: "dishes" }); window.scrollTo(0, 0); return; }
    openModal(<AccountPanel tab="profile" />, "modal--wide");
  };

  const navTo = (e, id) => {
    e.preventDefault();
    setActive(id);
    goSection(id);
  };

  return (
    <header className={`hdr${stuck ? " is-stuck" : ""}`} id="hdr">
      <a className="brand" href="#top" onClick={e => navTo(e, "top")}>
        <span className="brand__mark">XI</span>
        <span className="brand__text">
          <strong>Bistro Eleven</strong>
          <em>Est. 2015 · Neighbourhood Kitchen</em>
        </span>
      </a>

      {ui.view === "guest" && (
        <nav className="hdr__nav" id="hdr-nav">
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} className={active === id ? "is-active" : ""} onClick={e => navTo(e, id)}>{t(lang, label)}</a>
          ))}
        </nav>
      )}

      <div className="hdr__actions">
        {ui.view !== "auth" && (
          <button className={`icon-btn${ui.search ? " is-on" : ""}`} title="Search dishes" aria-label="Search dishes"
                  onClick={() => patchUi({ search: !ui.search })}>
            <Ico name="search" />
          </button>
        )}

        <button className="icon-btn" id="btn-theme" title="Toggle light / dark" aria-label="Toggle theme"
                onClick={() => setTheme(data.theme === "light" ? "dark" : "light")}>
          <Ico name="sun" className="ico-sun" />
          <Ico name="moon" className="ico-moon" />
        </button>

        <button className="icon-btn" style={{ fontWeight: 600, fontSize: "0.85rem" }} title="Toggle language" aria-label="Toggle language"
                onClick={() => setLang(lang === "en" ? "id" : "en")}>
          {lang.toUpperCase()}
        </button>

        {ui.view !== "auth" && (
          <button className="icon-btn" title="Wishlist" aria-label="Wishlist" onClick={openWishlist}>
            <Ico name="heart" />
            <span className="pip" hidden={wishN === 0}>{wishN}</span>
          </button>
        )}

        {ui.view !== "auth" && (
          <button className="icon-btn icon-btn--cart" ref={cartBtn} title="Open cart" aria-label="Open cart"
                  onClick={() => (ui.drawer ? patchUi({ drawer: false }) : openBasket())}>
            <Ico name="cart" />
            <span className="pip" hidden={cartCount === 0}>{cartCount}</span>
          </button>
        )}

        <button className="account-btn" title="Account settings" hidden={!signedIn}
                data-role={isStaff ? "admin" : "user"} onClick={openAccountButton}>
          <span className="avatar avatar--sm" id="hdr-avatar">
            {pic ? <img src={pic} alt="" />
                 : isStaff ? <Ico name="cart" /> : <Ico name="user" />}
          </span>
          <span className="account-btn__name">{(isStaff ? STAFF.name : me?.name || t(lang, "hdr.guest")).split(" ")[0]}</span>
          <span className="account-btn__tag" hidden={!isStaff}>{t(lang, "hdr.staff")}</span>
        </button>

        <button className="btn btn--primary btn--sm" hidden={signedIn} onClick={() => showAuth("")}>
          <Ico name="login" />
          <span>{t(lang, "hdr.signin")}</span>
        </button>
      </div>
    </header>
  );
}
