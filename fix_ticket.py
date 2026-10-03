with open('src/components/admin/OrderTicket.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_footer = """      <div className="ticket__foot">
        <span className="ticket__total">{money(o.totals.total)} · {o.slot}</span>
        {o.status !== "done" && (
          <button className="btn btn--primary btn--sm" onClick={() => app.advanceOrder(o.id)}>
            {o.status === "new" ? "Start cooking" : STATUS_LABEL[next] || "Next"}
          </button>
        )}
        <button className="da-btn" title="Open receipt" aria-label={`Open the receipt for ${o.id}`}
                onClick={() => app.openModal(<Bill order={o} />, "modal--slim")}>
          <Ico name="receipt" />
        </button>
      </div>"""

new_footer = """      <div className="ticket__foot">
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
      </div>"""

c = c.replace(old_footer, new_footer)

with open('src/components/admin/OrderTicket.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
