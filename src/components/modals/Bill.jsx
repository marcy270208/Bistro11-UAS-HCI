import { useMemo } from "react";
import Ico from "../../lib/icons.jsx";
import { useApp } from "../../lib/store.jsx";
import { payLabel } from "../../data/biz.js";
import { clockTime, money } from "../../lib/format.js";
import { t } from "../../lib/i18n.js";

const STYLE_LABEL = { delivery: "Delivery", pickup: "Pickup", table: "Table" };
const DELIVERY_LABEL = { delivery: "Delivery", pickup: "Pickup tray", table: "Table service" };

export default function Bill({ order }) {
  const app = useApp();
  const lang = app.ui.lang;
  const totals = order.totals;
  const bars = useMemo(() => Array.from({ length: 42 }, (_, i) => ({
    height: `${28 + ((i * 37) % 60)}%`,
    animationDelay: `${i * 12}ms`
  })), []);

  return (
    <div className="bill">
      <div className="bill__top">
        <div className="bill__ok"><Ico name="check" /></div>
        <h3>{t(lang, "bill.title", "Order confirmed")}</h3>
        <p>{order.name} - the kitchen has your ticket.</p>
      </div>

      <div className="bill__body">
        <div className="bill__meta">
          <div><span>Order</span><b>{order.id}</b></div>
          <div><span>Placed</span><b>{clockTime(order.created)}</b></div>
          <div><span>Style</span><b>{order.type === "table" ? `Table ${order.table || "-"}` : STYLE_LABEL[order.type] || order.type}</b></div>
          <div><span>Payment</span><b>{payLabel(order.pay) || "-"}</b></div>
          <div><span>Ready</span><b>{order.slot} · ~{order.eta} min</b></div>
        </div>

        <div className="bill__items">
          {order.items.map(i => (
            <div key={i.id}><span>{i.name} <i>×{i.qty}</i></span><b>{money(i.price * i.qty)}</b></div>
          ))}
        </div>

        <div className="bill__sum">
          <div><span>Subtotal</span><span>{money(totals.sub)}</span></div>
          <div><span>Kitchen tax 8.25%</span><span>{money(totals.tax)}</span></div>
          <div><span>Service 5%</span><span>{money(totals.service)}</span></div>
          <div><span>{DELIVERY_LABEL[order.type] || "Service"}</span><span>{totals.delivery === 0 ? "Free" : money(totals.delivery)}</span></div>
          {!!totals.discount && (
            <div><span className="disc">{totals.promo.label}</span><span className="disc">−{money(totals.discount)}</span></div>
          )}
          <div className="grand"><span>Total paid</span><b>{money(totals.total)}</b></div>
        </div>

        {order.notes && <div className="ticket__note">“{order.notes}” - passed to the chef.</div>}
      </div>

      <div className="bill__foot">
        <button className="btn btn--ghost" onClick={() => app.emailOrder(order.id)}>{t(lang, "bill.email", "Email receipt")}</button>
        <button className="btn btn--primary" onClick={app.closeModal}>{t(lang, "bill.back", "Back to the menu")}</button>
      </div>

      <div className="barcode">{bars.map((s, i) => <i key={i} style={s} />)}</div>
      <div className="bill__zip">BISTRO · ELEVEN · {order.id}</div>
    </div>
  );
}
