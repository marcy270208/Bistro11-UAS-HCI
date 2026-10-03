import re

with open('src/components/OrderTracker.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

pattern = r'<div className="tracker__card">.*?</ol>\s*</div>'

new_card = """<div className="tracker__card" style={order.type === 'delivery' ? { padding: 0, overflow: 'hidden', background: '#1c1a19' } : {}}>
        {order.type === 'delivery' ? (
          <>
            <DeliveryMap step={step} />
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ border: '1px solid #d2924a', borderRadius: '12px', padding: '0.8rem', textAlign: 'center', minWidth: '70px', background: 'rgba(210,146,74,0.05)' }}>
                  <b style={{ color: '#d2924a', fontSize: '1.5rem', display: 'block' }}>{Math.max(0, 15 - (step+1) * 3)}</b>
                  <span style={{ color: '#888', fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '1px' }}>MIN LEFT</span>
                </div>
                <div>
                  <h3 style={{ margin: '0 0 0.2rem 0', color: '#fff', fontSize: '1.1rem' }}>{step >= 3 ? "Rider on the way" : step >= 0 ? steps[step] : "Preparing order"}</h3>
                  <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>0.4 km to your door · harkit</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {["Ticket on the pass", "In the kitchen", "Packed and sealed", "Rider on the way", "At your door"].map((s, i) => {
                  const done = step > i || doneAll;
                  const active = !doneAll && step === i;
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem 1rem', background: active ? 'rgba(210,146,74,0.08)' : 'rgba(255,255,255,0.03)', borderRadius: '12px', border: active ? '1px solid rgba(210,146,74,0.5)' : '1px solid transparent', opacity: (!done && !active) ? 0.4 : 1, transition: '0.3s' }}>
                      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: done ? '#5d9c74' : (active ? '#d2924a' : '#333'), color: done || active ? '#fff' : '#888', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold' }}>
                        {done ? "✓" : (active && i === 3 ? "🛵" : i+1)}
                      </div>
                      <span style={{ color: '#fff', fontWeight: active ? '600' : 'normal', fontSize: '0.95rem' }}>{s}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="tracker__pan">
              <span className="steam s1" /><span className="steam s2" /><span className="steam s3" />
              <div className="pan">🍳</div>
              <div className="tracker__ring">
                <svg viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" className="ring-bg" />
                  <circle cx="60" cy="60" r="52" className="ring-fg"
                          style={{ strokeDasharray: CIRC, strokeDashoffset: offset }} />
                </svg>
                <b id="ring-pct">{pct}%</b>
              </div>
            </div>
            <h3 id="tracker-title">{pair[0]}</h3>
            <p id="tracker-sub">{pair[1]}</p>
            <ol className="tracker__steps" id="tracker-steps">
              {steps.map((s, i) => {
                const done = doneAll || i < step;
                const active = !doneAll && i === step;
                return (
                  <li key={i} data-i={i} className={`${done ? "is-done" : ""} ${active ? "is-active" : ""}`.trim()}>
                    <i>{done ? "✓" : i + 1}</i>{s}
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </div>"""

c = re.sub(pattern, new_card, c, flags=re.DOTALL)

with open('src/components/OrderTracker.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
