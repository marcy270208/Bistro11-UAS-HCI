import re

with open('src/components/OrderTracker.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Create DeliveryMap component to insert at the top
delivery_map_code = """const DeliveryMap = ({ step }) => {
  const progress = step < 0 ? 0 : (step + 1) / 4;
  const total = 360;
  let d = progress * total;
  let rx, ry;
  if (d <= 80) { rx = 40; ry = 180 - d; }
  else if (d <= 180) { rx = 40 + (d - 80); ry = 100; }
  else if (d <= 240) { rx = 140; ry = 100 - (d - 180); }
  else { rx = 140 + (d - 240); ry = 40; }
  if (rx > 260) rx = 260;
  
  return (
    <div style={{ position: 'relative', width: '100%', height: '220px', background: '#26221f', borderRadius: '12px 12px 0 0', overflow: 'hidden', borderBottom: '1px solid #332e2a' }}>
      <svg width="100%" height="100%" viewBox="0 0 300 220" preserveAspectRatio="none">
         <g fill="#1a1816" stroke="#332e2a" strokeWidth="2" rx="8">
           <rect x="15" y="15" width="50" height="40" rx="6" />
           <rect x="85" y="15" width="50" height="40" rx="6" />
           <rect x="155" y="15" width="50" height="40" rx="6" />
           <rect x="225" y="15" width="60" height="40" rx="6" />

           <rect x="15" y="75" width="50" height="40" rx="6" />
           <rect x="85" y="75" width="50" height="40" rx="6" />
           <rect x="155" y="75" width="50" height="40" rx="6" />
           <rect x="225" y="75" width="60" height="40" rx="6" />

           <rect x="15" y="135" width="50" height="50" rx="6" />
           <rect x="85" y="135" width="50" height="50" rx="6" />
           <rect x="155" y="135" width="50" height="50" rx="6" />
           <rect x="225" y="135" width="60" height="50" rx="6" fill="#1c2920" />
         </g>
         <path d="M 40 180 L 40 100 L 140 100 L 140 40 L 260 40" fill="none" stroke="#443c36" strokeWidth="6" strokeDasharray="10 10" />
         <path d="M 40 180 L 40 100 L 140 100 L 140 40 L 260 40" fill="none" stroke="#d2924a" strokeWidth="6" strokeDasharray="360" strokeDashoffset={360 - (progress * 360)} style={{ transition: 'stroke-dashoffset 0.8s ease-out' }} />
      </svg>
      <div style={{ position: 'absolute', left: `${(40/300)*100}%`, top: `${(180/220)*100}%`, transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <div style={{ background: '#5b4c73', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', border: '2px solid #26221f' }}>🍳</div>
        <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#fff', marginTop: '2px', textShadow: '0 1px 2px #000' }}>Bistro</div>
      </div>
      <div style={{ position: 'absolute', left: `${(260/300)*100}%`, top: `${(40/220)*100}%`, transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#fff', marginBottom: '2px', textShadow: '0 1px 2px #000' }}>You</div>
        <div style={{ background: '#394d3f', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', border: '2px solid rgba(255,255,255,0.1)' }}>🏡</div>
      </div>
      {step >= 0 && (
        <div style={{ position: 'absolute', left: `${(rx/300)*100}%`, top: `${(ry/220)*100}%`, transform: 'translate(-50%, -50%)', transition: 'left 0.8s ease-out, top 0.8s ease-out', zIndex: 10 }}>
          <div style={{ background: '#a54456', width: '30px', height: '30px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', border: '2px solid #d2924a', boxShadow: '0 0 0 4px rgba(210,146,74,0.2)' }}>🛵</div>
        </div>
      )}
    </div>
  );
};
"""

c = c.replace('export default function OrderTracker() {', delivery_map_code + '\nexport default function OrderTracker() {')


old_card = """      <div className="tracker__card">
        <div className="tracker__pan">
          <span className="steam s1" /><span className="steam s2" /><span className="steam s3" />
          <div className="pan">dY?3</div>
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
      </div>"""

new_card = """      <div className="tracker__card" style={order.type === 'delivery' ? { padding: 0, overflow: 'hidden', background: '#1c1a19' } : {}}>
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

c = c.replace(old_card, new_card)

with open('src/components/OrderTracker.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
