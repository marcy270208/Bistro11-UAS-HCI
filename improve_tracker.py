import re

with open('src/components/OrderTracker.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Replace the whole DeliveryMap component and the map rendering logic

new_tracker_code = """const DeliveryMap = ({ step }) => {
  const progress = step < 0 ? 0 : (step + 1) / 4;
  const total = 313.5;
  const dist = progress * total;
  let rx = 47, ry = 185;
  if (dist <= 70) {
    ry = 185 - dist;
  } else if (dist <= 93.5) {
    const p = (dist - 70) / 23.5;
    rx = 47 + p * 15;
    ry = 115 - p * 15;
  } else if (dist <= 146.5) {
    rx = 62 + (dist - 93.5);
    ry = 100;
  } else if (dist <= 170) {
    const p = (dist - 146.5) / 23.5;
    rx = 115 + p * 15;
    ry = 100 - p * 15;
  } else if (dist <= 200) {
    rx = 130;
    ry = 85 - (dist - 170);
  } else if (dist <= 223.5) {
    const p = (dist - 200) / 23.5;
    rx = 130 + p * 15;
    ry = 55 - p * 15;
  } else {
    rx = 145 + (dist - 223.5);
    ry = 40;
  }
  if (rx > 235) rx = 235;
  
  return (
    <div style={{ position: 'relative', width: '100%', height: '260px', background: '#1c1a19', borderRadius: '24px 24px 0 0', overflow: 'hidden' }}>
      <svg width="100%" height="100%" viewBox="0 0 300 240" preserveAspectRatio="xMidYMid slice">
         <g fill="#282421" stroke="#36312d" strokeWidth="2" rx="12">
           <rect x="25" y="25" width="45" height="45" />
           <rect x="85" y="25" width="45" height="45" />
           <rect x="145" y="25" width="45" height="45" />
           <rect x="205" y="25" width="70" height="45" />

           <rect x="25" y="85" width="45" height="45" />
           <rect x="85" y="85" width="45" height="45" />
           <rect x="145" y="85" width="45" height="45" />
           <rect x="205" y="85" width="70" height="45" />

           <rect x="25" y="145" width="45" height="55" />
           <rect x="85" y="145" width="45" height="55" />
           <rect x="145" y="145" width="45" height="55" />
           <rect x="205" y="145" width="70" height="55" fill="#202c25" />
         </g>

         <path d="M 47 185 L 47 115 Q 47 100 62 100 L 115 100 Q 130 100 130 85 L 130 55 Q 130 40 145 40 L 235 40" fill="none" stroke="#443c36" strokeWidth="6" strokeLinecap="round" strokeDasharray="0 14" />
         
         <path d="M 47 185 L 47 115 Q 47 100 62 100 L 115 100 Q 130 100 130 85 L 130 55 Q 130 40 145 40 L 235 40" fill="none" stroke="#d2924a" strokeWidth="6" strokeLinecap="round" strokeDasharray="350" strokeDashoffset={350 - (progress * 350)} style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)' }} />
      </svg>

      <div style={{ position: 'absolute', left: `${(47/300)*100}%`, top: `${(185/240)*100}%`, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ background: '#5b4c73', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 4px rgba(91,76,115,0.3)' }}>
           <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
        </div>
        <div style={{ fontSize: '11px', fontWeight: '800', color: '#fff', marginTop: '6px', letterSpacing: '0.5px' }}>Bistro</div>
      </div>

      <div style={{ position: 'absolute', left: `${(235/300)*100}%`, top: `${(40/240)*100}%`, transform: 'translate(-50%, -50%)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ fontSize: '11px', fontWeight: '800', color: '#fff', marginBottom: '6px', letterSpacing: '0.5px' }}>You</div>
        <div style={{ background: '#394d3f', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 4px rgba(57,77,63,0.3)' }}>
           <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
        </div>
      </div>

      {step >= 0 && (
        <div style={{ position: 'absolute', left: `${(rx/300)*100}%`, top: `${(ry/240)*100}%`, transform: 'translate(-50%, -50%)', transition: 'left 0.8s cubic-bezier(0.4, 0, 0.2, 1), top 0.8s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 10 }}>
          <div style={{ background: '#a54456', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 5px rgba(165,68,86,0.3)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="7" cy="17" r="3"/><circle cx="17" cy="17" r="3"/><path d="M14 17H7"/><path d="M4 17H3"/><path d="M17 14h2.5c.83 0 1.5-.67 1.5-1.5V11l-3-4H10l-2 3H3v4h1"/></svg>
          </div>
        </div>
      )}
    </div>
  );
};
export default function OrderTracker() {"""

# Replace old DeliveryMap component
c = re.sub(r'const DeliveryMap = \(\{ step \}\) => \{.*?\nexport default function OrderTracker\(\) \{', new_tracker_code, c, flags=re.DOTALL)

# Replace the layout in OrderTracker
new_card = """<div className="tracker__card" style={order.type === 'delivery' ? { padding: 0, overflow: 'hidden', background: '#171514', maxWidth: '380px', width: '100%', margin: '0 auto', border: '1px solid #332e2a' } : {}}>
        {order.type === 'delivery' ? (
          <>
            <DeliveryMap step={step} />
            <div style={{ padding: '1.5rem', background: '#1c1a19' }}>
              <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ border: '1px solid #4a3d31', borderRadius: '16px', padding: '1rem 0.5rem', textAlign: 'center', minWidth: '80px', background: 'rgba(210,146,74,0.05)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <b style={{ color: '#d2924a', fontSize: '1.8rem', lineHeight: 1 }}>{Math.max(0, 15 - (step+1) * 3)}</b>
                  <span style={{ color: '#998d82', fontSize: '0.65rem', fontWeight: '800', letterSpacing: '1px' }}>MIN LEFT</span>
                </div>
                <div>
                  <h3 style={{ margin: '0 0 0.4rem 0', color: '#fff', fontSize: '1.2rem', fontWeight: '600' }}>
                    {step >= 3 ? "Rider on the way" : step >= 0 ? steps[step] : "Preparing order"}
                  </h3>
                  <p style={{ margin: 0, color: '#998d82', fontSize: '0.9rem' }}>0.4 km to your door · harkit</p>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {["Ticket on the pass", "In the kitchen", "Packed and sealed", "Rider on the way", "At your door"].map((s, i) => {
                  const done = step > i || doneAll;
                  const active = !doneAll && step === i;
                  return (
                    <div key={i} style={{ 
                      display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.2rem', 
                      background: active ? '#282421' : '#1f1c1a', 
                      borderRadius: '16px', 
                      border: active ? '1px solid #d2924a' : '1px solid transparent', 
                      opacity: (!done && !active) ? 0.3 : 1, 
                      transition: '0.4s ease' 
                    }}>
                      <div style={{ 
                        width: '26px', height: '26px', borderRadius: '50%', 
                        background: done ? '#5d9c74' : (active ? '#d2924a' : '#333'), 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {done ? (
                           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                        ) : (active && i === 3 ? (
                           <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><circle cx="7" cy="17" r="3"/><circle cx="17" cy="17" r="3"/><path d="M14 17H7"/><path d="M4 17H3"/><path d="M17 14h2.5c.83 0 1.5-.67 1.5-1.5V11l-3-4H10l-2 3H3v4h1"/></svg>
                        ) : (
                           <span style={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}>{i+1}</span>
                        ))}
                      </div>
                      <span style={{ color: '#fff', fontWeight: active ? '600' : 'normal', fontSize: '1rem' }}>{s}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : ("""

c = re.sub(r'<div className="tracker__card" style=\{order\.type === \'delivery\'.*?\) : \(', new_card, c, flags=re.DOTALL)

with open('src/components/OrderTracker.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
