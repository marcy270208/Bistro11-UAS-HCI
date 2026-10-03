import re

with open('src/styles/overlays.css', 'r', encoding='utf-8') as f:
    c = f.read()

css_block = """/* live delivery map */
.dlv__map{background:var(--surface-2);border-bottom:1px solid var(--line)}
.dlv__map svg{display:block;width:100%;height:auto}
.dlv__streets line{stroke:var(--surface-3);stroke-width:13;stroke-linecap:round}
.dlv__block{fill:var(--surface-3);opacity:.7}
.dlv__park{fill:var(--ok);opacity:.18}
.dlv__road{fill:none;stroke:var(--ink-3);stroke-width:4;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:9 12;opacity:.5;animation:roadFlow 2.4s linear infinite}
@keyframes roadFlow{to{stroke-dashoffset:-42}}
.dlv__done{fill:none;stroke:var(--accent);stroke-width:4.5;stroke-linecap:round;stroke-linejoin:round;transition:stroke-dashoffset 1.1s linear}
.dlv__pin{font-size:16px;text-anchor:middle}
.dlv__label{font-size:8.5px;font-weight:700;letter-spacing:.06em;text-anchor:middle;fill:var(--ink-3)}
.dlv__dot{transition:transform 1.1s linear}
.dlv__halo{fill:var(--accent);opacity:.16}
.dlv__chip{fill:var(--surface);stroke:var(--accent);stroke-width:2}
.dlv__pulse{fill:var(--accent);transform-box:fill-box;transform-origin:center;animation:ping 2.4s var(--ease) infinite}
@keyframes ping{0%{transform:scale(.55);opacity:.3}70%,100%{transform:scale(1.55);opacity:0}}
.dlv__now{display:flex;align-items:center;gap:16px;padding-bottom:18px}
.dlv__clock{flex:none;width:92px;padding:12px 8px;border-radius:var(--r-md);text-align:center;background:var(--accent-soft);border:1px solid var(--accent)}
.dlv__clock b{display:block;font-family:var(--f-display);font-size:1.7rem;line-height:1.05;font-variant-numeric:tabular-nums;color:var(--accent)}
.dlv__clock small{font-size:.66rem;letter-spacing:.08em;text-transform:uppercase;color:var(--ink-3)}
.dlv__head b{display:block;font-size:1.02rem;font-weight:600;margin-bottom:4px}
.dlv__head small{font-size:.82rem;color:var(--ink-2)}
.dlv__steps{display:grid;gap:11px;text-align:left}
.dlv__steps li{display:flex;align-items:center;gap:12px;font-size:.88rem;color:var(--ink-3);padding:11px 15px;border-radius:13px;background:var(--surface-2);border:1px solid transparent;transition:all .5s var(--ease)}
.dlv__steps li i{width:22px;height:22px;border-radius:99px;display:grid;place-items:center;flex:none;font-size:11px;font-style:normal;background:var(--surface-3);color:var(--ink-3);transition:all .5s var(--ease)}
.dlv__steps li.is-active{color:var(--ink);border-color:var(--accent);background:var(--accent-soft)}
.dlv__steps li.is-active i{background:var(--accent);color:var(--accent-ink);animation:activePulse 1.9s var(--ease) infinite}
@keyframes activePulse{0%,100%{box-shadow:0 0 0 0 color-mix(in srgb,var(--accent) 42%,transparent)}55%{box-shadow:0 0 0 7px transparent}}
.dlv__steps li.is-done{color:var(--ink-2)}
.dlv__steps li.is-done i{background:var(--ok);color:#fff;animation:pop .45s var(--ease-out)}
.dlv__rider{display:flex;align-items:center;gap:12px;margin-top:14px;padding:11px 14px;border-radius:var(--r-md);background:var(--surface-2);border:1px solid var(--line)}
.dlv__rider span{width:36px;height:36px;flex:none;border-radius:99px;display:grid;place-items:center;font-size:18px;background:var(--accent-soft)}
.dlv__rider b{display:block;font-size:.88rem}
.dlv__rider small{font-size:.75rem;color:var(--ink-3)}
.dlv__rider em{margin-left:auto;font-style:normal;font-size:.82rem;font-weight:700;color:var(--accent);font-variant-numeric:tabular-nums}
.dlv__addr{display:flex;gap:9px;align-items:flex-start;margin-top:14px;font-size:.83rem;color:var(--ink-2)}
.dlv__addr svg{width:15px;height:15px;flex:none;margin-top:2px;stroke:var(--accent);stroke-width:2}
.dlv__sign{display:flex;gap:10px;align-items:flex-start;margin-top:14px;padding:12px 14px;border-radius:var(--r-md);background:var(--accent-soft);border:1px solid var(--accent);font-size:.82rem;line-height:1.45}
.dlv__sign svg{width:16px;height:16px;flex:none;margin-top:2px;stroke:var(--accent);stroke-width:2.4}
"""

if '.dlv__map' not in c:
    c = c + '\n' + css_block

with open('src/styles/overlays.css', 'w', encoding='utf-8') as f:
    f.write(c)
