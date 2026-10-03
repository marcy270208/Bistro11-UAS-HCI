import { useState } from "react";
import { useApp } from "../lib/store.jsx";
import { badEmail } from "../lib/format.js";
import { STAFF } from "../data/biz.js";
import { AMBIENCE, BANNER, pic } from "../data/photos.js";
import Photo from "../components/Photo.jsx";
import { t } from "../lib/i18n.js";

const TABS = [["in", "auth.tab.in"], ["up", "auth.tab.up"], ["staff", "auth.tab.staff"]];

const POINTS = [
  ["🧺", "auth.points.0.b", "auth.points.0.s"],
  ["❤️", "auth.points.1.b", "auth.points.1.s"],
  ["🧾", "auth.points.2.b", "auth.points.2.s"],
  ["⭐", "auth.points.3.b", "auth.points.3.s"]
];

function fieldErr(k, err) { return `field${err[k] ? " err" : ""}`; }

export default function LoginPage() {
  const app = useApp();
  const { ui, patchUi, data, findAccount, beginSession, createAccount, toast } = app;
  const lang = ui.lang;

  const [in_, setIn] = useState({ email: "", pass: "" });
  const [up, setUp] = useState({ name: "", email: "", pass: "", phone: "", addr: "" });
  const [sf, setSf] = useState({ user: "", pass: "" });
  const [err, setErr] = useState({});
  const [msg, setMsg] = useState({});

  const tab = ui.authTab;
  const setTab = t => { setErr({}); setMsg({}); patchUi({ authTab: t }); };

  /* ── customer sign in ── */
  const doSignIn = e => {
    e.preventDefault();
    const email = in_.email.trim(), acc = findAccount(email);
    const okMail = !badEmail(email);
    const wrongPass = okMail && !!acc && acc.pass !== in_.pass;
    setErr({ inEmail: !okMail, inPass: okMail && wrongPass });
    setMsg({ inEmail: okMail ? "" : "That doesn’t look like an email address." });
    if (!okMail) return;
    if (!acc) {
      setUp(s => ({ ...s, email }));
      setTab("up");
      toast("No account uses that email yet - create one.", "📝");
      return;
    }
    if (wrongPass) { setErr({ inEmail: false, inPass: true }); setMsg({ inPass: "That password doesn’t match this account." }); return; }
    beginSession("user", acc.email);
    toast("Welcome back, " + acc.name.split(" ")[0], "🍽️");
  };

  /* ── customer sign up ── */
  const doSignUp = e => {
    e.preventDefault();
    const name = up.name.trim(), email = up.email.trim(), pass = up.pass;
    const taken = !badEmail(email) && findAccount(email);
    const okName = name.length >= 2, okMail = !badEmail(email) && !taken, okPass = pass.length >= 6;
    setErr({ upName: !okName, upEmail: !okMail, upPass: !okPass });
    if (!(okName && okMail && okPass)) {
      setMsg({ upPass: taken ? "That email already has an account - sign in instead."
        : "Check your name, a valid email and a password of 6 or more characters." });
      return;
    }
    createAccount({ name, email, pass, phone: up.phone.trim(), address: up.addr.trim(), avatar: "" });
    beginSession("user", email);
    toast("Account created - welcome to Bistro Eleven, " + name.split(" ")[0], "🎉");
  };

  /* ── kitchen sign in ── */
  const doStaff = e => {
    e.preventDefault();
    const ok = sf.user.trim().toLowerCase() === STAFF.user && sf.pass === STAFF.pass;
    setErr({ sfUser: !ok, sfPass: !ok });
    if (!ok) { setMsg({ sfPass: "Those credentials don’t match the kitchen." }); return; }
    beginSession("staff", STAFF.user);
    toast("Chef console open - signed in as " + STAFF.name, "👨‍🍳");
  };

  const fillDemo = () => {
    const a = data.accounts[0];
    if (!a) return;
    setIn({ email: a.email, pass: a.pass });
    setErr({}); setMsg({});
    toast("Demo details filled in - press Sign in.", "✨");
  };

  return (
    <section className="auth">
      <div className="wrap auth__grid">

        <aside className="auth__side">
          <span className="eyebrow"><i className="eyebrow__dot" /> {t(lang, "auth.welcome")}</span>
          <h2>{t(lang, "auth.seats")}<br /><em>{t(lang, "auth.ticket")}</em></h2>
          <p>{t(lang, "auth.desc")}</p>
          <ul className="auth__points">
            {POINTS.map(([ico, b, s]) => (
              <li key={b}><span>{ico}</span><div><b>{t(lang, b)}</b><small>{t(lang, s)}</small></div></li>
            ))}
          </ul>
          <figure className="auth__shot">
            <Photo src={pic(AMBIENCE.room, ...BANNER)} alt="The dining room at Bistro Eleven" cat="Mains" />
          </figure>
        </aside>

        <div className="auth__panel">
          <div className="auth__tabs" role="tablist">
            {TABS.map(([k, label]) => (
              <button key={k} type="button" className={tab === k ? "is-on" : ""} onClick={() => setTab(k)}>{t(lang, label)}</button>
            ))}
          </div>

          {!!ui.authReason && <p className="auth__note">{ui.authReason}</p>}

          {tab === "in" && (
            <form className="auth__form" onSubmit={doSignIn} noValidate>
              <div className={fieldErr("inEmail", err)}>
                <label htmlFor="in-email">{t(lang, "auth.in.email")}</label>
                <input id="in-email" type="email" value={in_.email} placeholder="you@example.com"
                       autoComplete="email" onChange={e => setIn(s => ({ ...s, email: e.target.value }))} />
                <span className="field__err">{msg.inEmail || "Check your email and password."}</span>
              </div>
              <div className={fieldErr("inPass", err)}>
                <label htmlFor="in-pass">{t(lang, "auth.in.pass")}</label>
                <input id="in-pass" type="password" value={in_.pass} placeholder="Your password"
                       autoComplete="current-password" onChange={e => setIn(s => ({ ...s, pass: e.target.value }))} />
                <span className="field__err">{msg.inPass || "Check your email and password."}</span>
              </div>
              <button className="btn btn--primary btn--block" type="submit">{t(lang, "auth.in.btn")}</button>
              <button className="text-btn" type="button" onClick={fillDemo}>{t(lang, "auth.in.demo")}</button>
            </form>
          )}

          {tab === "up" && (
            <form className="auth__form" onSubmit={doSignUp} noValidate>
              <div className={fieldErr("upName", err)}>
                <label htmlFor="up-name">Full name</label>
                <input id="up-name" value={up.name} placeholder="Rania Putri" autoComplete="name"
                       onChange={e => setUp(s => ({ ...s, name: e.target.value }))} />
                <span className="field__err">A name, please.</span>
              </div>
              <div className={fieldErr("upEmail", err)}>
                <label htmlFor="up-email">Email</label>
                <input id="up-email" type="email" value={up.email} placeholder="you@example.com" autoComplete="email"
                       onChange={e => setUp(s => ({ ...s, email: e.target.value }))} />
                <span className="field__err">A valid email that isn’t registered yet.</span>
              </div>
              <div className={fieldErr("upPass", err)}>
                <label htmlFor="up-pass">Password</label>
                <input id="up-pass" type="password" value={up.pass} placeholder="At least 6 characters"
                       autoComplete="new-password" onChange={e => setUp(s => ({ ...s, pass: e.target.value }))} />
                <span className="field__err">Pick a password with 6 or more characters.</span>
              </div>
              <div className="field">
                <label htmlFor="up-phone">Phone <em>optional</em></label>
                <input id="up-phone" type="tel" value={up.phone} placeholder="0811 2233 4455" autoComplete="tel"
                       onChange={e => setUp(s => ({ ...s, phone: e.target.value }))} />
              </div>
              <div className="field">
                <label htmlFor="up-addr">Delivery address <em>optional</em></label>
                <input id="up-addr" value={up.addr} placeholder="Street, no., city" autoComplete="street-address"
                       onChange={e => setUp(s => ({ ...s, addr: e.target.value }))} />
              </div>
              <button className="btn btn--primary btn--block" type="submit">Create account &amp; sign in</button>
              <small className="muted">Saved only in this browser - no server, no email sent.</small>
            </form>
          )}

          {tab === "staff" && (
            <form className="auth__form" onSubmit={doStaff} noValidate>
              <div className={fieldErr("sfUser", err)}>
                <label htmlFor="sf-user">Staff username</label>
                <input id="sf-user" value={sf.user} placeholder="chef" autoComplete="username"
                       onChange={e => setSf(s => ({ ...s, user: e.target.value }))} />
              </div>
              <div className={fieldErr("sfPass", err)}>
                <label htmlFor="sf-pass">Password</label>
                <input id="sf-pass" type="password" value={sf.pass} placeholder="Kitchen password"
                       autoComplete="current-password" onChange={e => setSf(s => ({ ...s, pass: e.target.value }))} />
                <span className="field__err">{msg.sfPass || "Those credentials don’t match the kitchen."}</span>
              </div>
              <button className="btn btn--primary btn--block" type="submit">Open the service board</button>
              <p className="auth__hint">Demo kitchen login - user <b>{STAFF.user}</b> · password <b>{STAFF.pass}</b>.
                Change it in <code>src/data/biz.js</code>.</p>
            </form>
          )}

          <p className="auth__back">
            <button className="text-btn" type="button" onClick={app.leaveAuth}>{t(lang, "auth.back")}</button>
          </p>
        </div>

      </div>
    </section>
  );
}
