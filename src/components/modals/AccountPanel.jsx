import { useEffect, useRef, useState } from "react";
import Ico from "../../lib/icons.jsx";
import ModalHead from "../ModalHead.jsx";
import Bill from "./Bill.jsx";
import TrackOrder from "./TrackOrder.jsx";
import Photo from "../Photo.jsx";
import { useApp } from "../../lib/store.jsx";
import { initial, money, okEmail, plural, readAndShrink, safeAvatar } from "../../lib/format.js";
import { STATUS_LABEL } from "../../data/menu.js";
import { thumbPic } from "../../data/photos.js";

const TABS = [["profile", "Profile"], ["orders", "Orders"], ["saved", "Saved"]];

export default function AccountPanel({ tab = "profile" }) {
  const app = useApp();
  const { me, data, myOrders, findAccount } = app;
  const fileRef = useRef(null);
  const [pane, setPane] = useState(tab);
  const [err, setErr] = useState({});
  const [form, setForm] = useState(() => ({
    name: me?.name || "", email: me?.email || "", phone: me?.phone || "", address: me?.address || ""
  }));

  useEffect(() => {
    if (!me) app.closeModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!me) return null;

  const avatar = safeAvatar(me.avatar);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const clash = form.email && form.email.toLowerCase() !== me.email.toLowerCase() && findAccount(form.email);

  const saveProfile = () => {
    const okName = form.name.trim().length >= 2;
    const okMail = !form.email || (!clash && okEmail(form.email));
    const okPhone = !form.phone || form.phone.replace(/\D/g, "").length >= 7;
    setErr({ name: !okName, email: !okMail, phone: !okPhone, addr: false });
    if (!okName || !okMail || !okPhone) {
      app.toast(clash ? "Another account already uses that email" : "Check the highlighted fields", clash ? "🔒" : "✍️");
      return;
    }
    app.updateMe({
      name: form.name.trim(), email: form.email.trim() || me.email,
      phone: form.phone.trim(), address: form.address.trim()
    });
    app.closeModal();
    app.toast(`Saved. Welcome back, ${form.name.trim().split(" ")[0]}`, "👤");
  };

  const pickPhoto = async e => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const url = await readAndShrink(file, 220);
      app.updateMe({ avatar: url });
      app.toast("Profile photo updated", "📸");
    } catch {
      app.toast("Couldn't read that image", "⚠️");
    }
  };

  const savedDishes = data.wish.map(id => data.menu.find(d => d.id === id)).filter(Boolean);

  return (
    <>
      <ModalHead title="Account settings" sub="Your details, your saved plates and everything you've ordered here." />
      <div className="modal__body">
        <div className="acc__top">
          <div className="acc__pic">
            <span className="avatar">{avatar ? <img src={avatar} alt="" /> : initial(me.name)}</span>
            <input ref={fileRef} type="file" accept="image/*" onChange={pickPhoto} aria-label="Choose a profile photo" />
            <button type="button" aria-label="Change photo" onClick={() => fileRef.current?.click()}>
              <Ico name="pen" />
            </button>
          </div>
          <div className="acc__who">
            <b>{me.name}</b>
            <span>{me.email || "no email yet"} · {plural(data.wish.length, "saved dish")}</span>
          </div>
          <button type="button" className="link-btn acc__out"
                  onClick={() => { app.closeModal(); app.endSession(); }}>Sign out</button>
        </div>

        <div className="acc__tabs" role="tablist">
          {TABS.map(([k, label]) => (
            <button key={k} type="button" className={pane === k ? "is-on" : ""}
                    aria-selected={pane === k} onClick={() => setPane(k)}>{label}</button>
          ))}
        </div>

        {pane === "profile" && (
          <>
            <div className={`field${err.name ? " err" : ""}`}>
              <label htmlFor="ac-name">Full name</label>
              <input id="ac-name" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your name" />
              <small className="field__err">Name is required.</small>
            </div>
            <div className="row2">
              <div className={`field${err.email ? " err" : ""}`}>
                <label htmlFor="ac-email">Email</label>
                <input id="ac-email" type="email" value={form.email} onChange={e => set("email", e.target.value)} placeholder="you@example.com" />
                <small className="field__err">{clash ? "That email belongs to another account." : "Check that email."}</small>
              </div>
              <div className={`field${err.phone ? " err" : ""}`}>
                <label htmlFor="ac-phone">Phone</label>
                <input id="ac-phone" inputMode="tel" value={form.phone} onChange={e => set("phone", e.target.value)} placeholder="+1 555 000 0000" />
                <small className="field__err">At least 7 digits.</small>
              </div>
            </div>
            <div className="field">
              <label htmlFor="ac-addr">Delivery address</label>
              <textarea id="ac-addr" rows="2" value={form.address} onChange={e => set("address", e.target.value)} placeholder="Street, unit, postcode" />
            </div>
          </>
        )}

        {pane === "orders" && (myOrders.length ? (
          <>{myOrders.map(o => {
            const first = data.menu.find(d => d.id === o.items[0]?.id);
            return (
              <div className="mini-order" key={o.id} role="button" tabIndex={0} onClick={() => app.openModal(<Bill order={o} />, "modal--slim")} onKeyDown={e => e.key === "Enter" && app.openModal(<Bill order={o} />, "modal--slim")} style={{ cursor: "pointer" }}>
                <Photo src={first?.imgs?.[0] ? thumbPic(first.imgs[0]) : ""} alt={first?.name || o.id} cat={first?.cat} />
                <div>
                  <b>{o.id} · {o.type}</b>
                  <small>{plural(o.items.reduce((n, i) => n + i.qty, 0), "item")} · {new Date(o.created).toLocaleDateString()}</small>
                </div>
                <span className={`pill pill--${o.status}`}>{STATUS_LABEL[o.status] || o.status}</span>
              </div>
            );
          })}</>
        ) : <p className="muted">No orders yet. The first ticket is waiting.</p>)}

        {pane === "saved" && (savedDishes.length ? (
          <>
            <div className="co-list">
              {savedDishes.map(d => <div key={d.id}><span>{d.name}</span><b>{money(d.price)}</b></div>)}
            </div>
            <button type="button" className="btn btn--ghost btn--sm" onClick={app.clearWish}>Clear wishlist</button>
          </>
        ) : <p className="muted">Tap the ♥ on any dish and it lands here.</p>)}
      </div>

      {pane === "profile" && (
        <div className="modal__foot">
          <button className="btn btn--ghost" onClick={app.closeModal}>Cancel</button>
          <button className="btn btn--primary" onClick={saveProfile}>Save changes</button>
        </div>
      )}
    </>
  );
}
