import { useApp } from "../lib/store.jsx";
import { t } from "../lib/i18n.js";
import Ico from "../lib/icons.jsx";
import { BIZ } from "../data/biz.js";
import AccountPanel from "./modals/AccountPanel.jsx";

const NAV = [["menu", "Full menu"], ["story", "Our story"], ["gallery", "From the pass"],
  ["reviews", "Guest book"], ["visit", "Visit us"]];

const SOCIALS = [
  ["ig", "Instagram", BIZ.socials.instagram, "@" + BIZ.socials.instagram.split("/").pop()],
  ["fb", "Facebook", BIZ.socials.facebook, "Bistro Eleven"],
  ["xs", "X", BIZ.socials.x, "@" + BIZ.socials.x.split("/").pop()],
  ["tt", "TikTok", BIZ.socials.tiktok, "@" + BIZ.socials.tiktok.split("/").pop()]
];

export default function Footer() {
  const app = useApp();
  const lang = app.ui.lang;
  const openAccount = () => {
    if (app.me) app.openModal(<AccountPanel tab="profile" />, "modal--wide");
    else app.showAuth("Sign in to open your account.");
  };

  return (
    <footer className="ftr">
      <div className="wrap ftr__main">

        <div className="ftr__brand">
          <a className="brand" href="#top" onClick={e => { e.preventDefault(); app.goSection("top"); }}>
            <span className="brand__mark">XI</span>
            <span className="brand__text"><strong>Bistro Eleven</strong><em>Est. 2015 · Neighbourhood Kitchen</em></span>
          </a>
          <p className="ftr__tag">{BIZ.tagline}</p>
          <h6>Follow the kitchen</h6>
          <div className="ftr__social">
            {SOCIALS.map(([ico, label, href, handle]) => (
              <a key={ico} href={href} target="_blank" rel="noopener" title={handle} aria-label={label}>
                <Ico name={ico} />
              </a>
            ))}
          </div>
        </div>

        <nav className="ftr__col">
          <h5>Explore</h5>
          {NAV.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); app.goSection(id); }}>{label}</a>
          ))}
          <button className="link-btn" onClick={openAccount}>{t(lang, "footer.account")}</button>
        </nav>

        <div className="ftr__col">
          <h5>Talk to us</h5>
          <div className="ftr__rows">
            <div className="ftr__row">
              <Ico name="mail" />
              <div><b>{t(lang, "footer.email")}</b><a href={`mailto:${BIZ.email}`}>{BIZ.email}</a><small>{t(lang, "footer.email.desc")}</small></div>
            </div>
            <div className="ftr__row">
              <Ico name="tel" />
              <div><b>{t(lang, "footer.phone")}</b><a href={`tel:${BIZ.phoneTel}`}>{BIZ.phoneShow}</a><small>{t(lang, "footer.phone.desc")}</small></div>
            </div>
            <div className="ftr__row">
              <Ico name="wa" />
              <div><b>{t(lang, "footer.wa")}</b><a href={`https://wa.me/${BIZ.wa}`} target="_blank" rel="noopener">{t(lang, "footer.wa.desc")}</a><small>{"+" + BIZ.wa}</small></div>
            </div>
          </div>
        </div>

        <div className="ftr__col">
          <h5>Find us</h5>
          <div className="ftr__rows">
            <div className="ftr__row">
              <Ico name="pin" />
              <div>
                <b>{t(lang, "footer.address")}</b>
                {BIZ.street[0]}<br />
                {BIZ.street[1]}
                <small><a href={BIZ.mapQuery} target="_blank" rel="noopener">{t(lang, "footer.map")}</a></small>
              </div>
            </div>
            <div className="ftr__row">
              <Ico name="dir" />
              <div><b>{t(lang, "footer.getting_here")}</b>Arrival station, 4 min walk<small>Riverside car park, lane B</small></div>
            </div>
          </div>
        </div>

        <div className="ftr__col">
          <h5>Kitchen hours</h5>
          <div className="ftr__rows ftr__rows--hours">
            {BIZ.hours.map(([day, time]) => <div key={day}><span>{day}</span><b>{time}</b></div>)}
          </div>
          <small className="muted">{t(lang, "footer.last_order")}</small>
        </div>

      </div>
      <div className="wrap ftr__bar">
        <small>{`© ${new Date().getFullYear()} ${BIZ.name} · All rights reserved · Made on Lantern Lane`}</small>
        <div className="ftr__pay">
          {BIZ.payments.map(p => <span key={p}>{p}</span>)}
        </div>
      </div>
    </footer>
  );
}
