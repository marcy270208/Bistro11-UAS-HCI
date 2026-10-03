import { useApp } from "../lib/store.jsx";
import { money, plural } from "../lib/format.js";
import { thumbPic } from "../data/photos.js";
import Ico from "../lib/icons.jsx";
import Photo from "./Photo.jsx";
import Checkout from "./modals/Checkout.jsx";
import { t } from "../lib/i18n.js";

export default function CartDrawer() {
  const { ui, cartList, cartCount, setQty, closeDrawer, patchUi, openModal, goSection, asCustomer } = useApp();
  const lang = ui.lang;
  const sub = cartList.reduce((t, x) => t + x.d.price * x.q, 0);

  const toCheckout = () => {
    if (!asCustomer("Sign in so we know who this order belongs to.")) return;
    closeDrawer();
    openModal(<Checkout />, "modal--wide");
  };

  return (
    <>
      <div className="backdrop" hidden={!ui.drawer} onClick={closeDrawer} />
      <aside className={`drawer${ui.drawerOut ? " is-out" : ""}`} aria-label="Your order" hidden={!ui.drawer}>
        <header className="drawer__head">
          <div>
            <h3>Your table order</h3>
            <small>{plural(cartCount, "item")} on the table</small>
          </div>
          <button className="icon-btn" aria-label="Close cart" onClick={closeDrawer}><Ico name="close" /></button>
        </header>

        <div className="drawer__body" hidden={cartList.length === 0}>
          {cartList.map(({ d, q }) => (
            <div className="ci" key={d.id}>
              <Photo src={thumbPic(d.imgs?.[0])} alt={d.name} cat={d.cat} />
              <div className="ci__info">
                <b>{d.name}</b>
                <span>{d.cat} · {money(d.price)} each</span>
              </div>
              <div className="ci__right">
                <span className="ci__price">{money(d.price * q)}</span>
                <div className="stepper">
                  <button onClick={() => setQty(d.id, -1)} aria-label="One less">−</button>
                  <b>{q}</b>
                  <button onClick={() => setQty(d.id, 1)} aria-label="One more">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="drawer__empty" hidden={cartList.length > 0}>
          <span>🧺</span>
          <p>Nothing in the basket yet.</p>
          <button className="btn btn--ghost" onClick={() => { closeDrawer(); goSection("menu"); }}>Browse the menu</button>
        </div>

        <footer className="drawer__foot">
          <div className="line"><span>{t(lang, "cart.subtotal")}</span><b>{money(sub)}</b></div>
          <div className="line line--muted"><small>Taxes &amp; service calculated at checkout</small></div>
          <button className="btn btn--primary btn--block" disabled={!cartList.length} onClick={toCheckout}>
            Checkout <span>{money(sub)}</span>
          </button>
        </footer>
      </aside>
    </>
  );
}
