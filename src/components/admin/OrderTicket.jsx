import { useApp } from "../../lib/store.jsx";
import { STATUS_FLOW, STATUS_LABEL } from "../../data/menu.js";
import { SPICE_WORDS, payLabel } from "../../data/biz.js";
import { money } from "../../lib/format.js";
import Ico from "../../lib/icons.jsx";
import Bill from "../modals/Bill.jsx";

export default function OrderTicket({ o }) {
  const app = useApp();
  const at = STATUS_FLOW.indexOf(o.status);
  const next = STATUS_FLOW[Math.min(at + 1, STATUS_FLOW.length - 1)];

  return (
    <article className="ticket" data-t={o.id}>
      <div className="ticket__head">
        <span className="ticket__id">
          {o.id}
          <small>{o.name} · {o.type}{o.type === "table" ? ` #${o.table || "-"}` : ""}</small>
        </span>
        <span className={`pill pill--${o.status}`}>{STATUS_LABEL[o.status] || o.status}</span>
      </div>

      <div className="ticket__body">
        {o.items.map(i => (
          <div className="ticket__line" key={i.id}><span>{i.qty}× {i.name}</span><b>{money(i.price * i.qty)}</b></div>
        ))}
        <div className="ticket__line">
          <span>Heat level</span><b>{(SPICE_WORDS[o.spice] || SPICE_WORDS[0]).split(" ")[0]}</b>
        </div>
        <div className="ticket__line"><span>Payment</span><b>{payLabel(o.pay) || "-"}</b></div>
        {o.contactless && o.type === "delivery" && (
          <div className="ticket__line"><span>Hand-off</span><b>Contactless</b></div>
        )}
        {o.notes && <div className="ticket__note">“{o.notes}”</div>}
      </div>

      <div className="ticket__foot">
        <span className="ticket__total">{money(o.totals.total)} · {o.slot}</span>
        {o.status !== "done" && o.status !== "cancelled" && (
          <div style={{ display: "flex", gap: "0.5rem", marginLeft: "auto" }}>
            <button className="btn btn--ghost btn--sm" onClick={() => app.setOrderStatus(o.id, "cancelled")}>
              Cancel
            </button>
            <button className="btn btn--primary btn--sm" onClick={() => app.setOrderStatus(o.id, "done")}>
              Complete
            </button>
          </div>
        )}
        <button className="da-btn" title="Open receipt" aria-label={`Open the receipt for ${o.id}`}
                onClick={() => app.openModal(<Bill order={o} />, "modal--slim")}
                style={{ marginLeft: o.status === "done" || o.status === "cancelled" ? "auto" : "0" }}>
          <Ico name="receipt" />
        </button>
      </div>
    </article>
  );
}
