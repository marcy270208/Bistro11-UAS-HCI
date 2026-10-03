import { useMemo } from "react";
import Ico from "../../lib/icons.jsx";
import { useApp } from "../../lib/store.jsx";
import { PAY_ID, PROMO_ID } from "../../lib/i18n.js";
import { payLabel } from "../../data/biz.js";
import { clockTime, money } from "../../lib/format.js";
import TrackOrder from "./TrackOrder.jsx";

const STYLE_LABEL = { delivery: ["Delivery", "Antar"], pickup: ["Pickup", "Ambil sendiri"], table: ["Table", "Meja"] };
const DELIVERY_LABEL = { delivery: ["Delivery", "Ongkos antar"], pickup: ["Pickup tray", "Baki ambil"], table: ["Table service", "Layanan meja"] };

export default function Bill({ order }) {
  const app = useApp();   /* `t` below is the order totals, so copy goes through app.t() */
  const t = order.totals;
  const bars = useMemo(() => Array.from({ length: 42 }, (_, i) => ({
    height: `${28 + ((i * 37) % 60)}%`,
    width: `${1 + ((i * 13) % 3)}px`,
    animationDelay: `${380 + i * 10}ms`
  })), []);

  return (
    <div className="bill">
      <div className="bill__top">
        <div className="bill__ok"><Ico name="check" /></div>
        <h3>{app.t("Order confirmed", "Pesanan dikonfirmasi")}</h3>
        <p>{app.t(`${order.name}, the kitchen has your ticket.`, `${order.name}, dapur sudah menerima tiketmu.`)}</p>
      </div>

      <div className="bill__body">
        <div className="bill__meta">
          <div><span>{app.t("Order", "Pesanan")}</span><b>{order.id}</b></div>
          <div><span>{app.t("Placed", "Dibuat")}</span><b>{clockTime(order.created)}</b></div>
          <div><span>{app.t("Style", "Layanan")}</span><b>{order.type === "table" ? app.t(`Table${order.table ? " " + order.table : ""}`, `Meja${order.table ? " " + order.table : ""}`) : (STYLE_LABEL[order.type] ? app.t(...STYLE_LABEL[order.type]) : order.type)}</b></div>
          <div><span>{app.t("Payment", "Pembayaran")}</span><b>{app.t(payLabel(order.pay), PAY_ID[payLabel(order.pay)]?.[1])}</b></div>
          <div><span>{app.t("Ready", "Siap")}</span><b>{order.slot} · ~{order.eta} {app.t("min", "mnt")}</b></div>
        </div>

        <div className="bill__items">
          {order.items.map(i => (
            <div key={i.id}><span>{app.t(i.name, app.data.menu.find(m => m.id === i.id)?.name_id)} <i>×{i.qty}</i></span><b>{money(i.price * i.qty)}</b></div>
          ))}
        </div>

        <div className="bill__sum">
          <div><span>{app.t("Subtotal", "Subtotal")}</span><span>{money(t.sub)}</span></div>
          <div><span>{app.t("Kitchen tax 8.25%", "Pajak dapur 8,25%")}</span><span>{money(t.tax)}</span></div>
          <div><span>{app.t("Service 5%", "Layanan 5%")}</span><span>{money(t.service)}</span></div>
          <div><span>{DELIVERY_LABEL[order.type] ? app.t(...DELIVERY_LABEL[order.type]) : app.t("Service", "Layanan")}</span><span>{t.delivery === 0 ? app.t("Free", "Gratis") : money(t.delivery)}</span></div>
          {!!t.discount && (
            <div><span className="disc">{app.t(t.promo.label, PROMO_ID[t.promo.label])}</span><span className="disc">−{money(t.discount)}</span></div>
          )}
          <div className="grand"><span>{app.t("Total paid", "Total bayar")}</span><b>{money(t.total)}</b></div>
        </div>

        {order.notes && <div className="ticket__note">{app.t(`“${order.notes}” · passed to the chef.`, `“${order.notes}” · sudah diteruskan ke chef.`)}</div>}
      </div>

      <div className="bill__foot">
        {order.type === "delivery" && (
          <button className="btn btn--ghost" onClick={() => app.openModal(<TrackOrder orderId={order.id} />)}>{app.t("Track the rider", "Lacak kurir")}</button>
        )}
        <button className="btn btn--ghost" onClick={() => app.printOrder(order.id)}>{app.t("Print copy", "Cetak salinan")}</button>
        <button className="btn btn--primary" onClick={app.closeModal}>{app.t("Back to the menu", "Kembali ke menu")}</button>
      </div>

      <div className="barcode">{bars.map((s, i) => <i key={i} style={s} />)}</div>
      <div className="bill__zip">BISTRO · ELEVEN · {order.id}</div>
    </div>
  );
}
