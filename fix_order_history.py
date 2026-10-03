with open('src/components/modals/AccountPanel.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

if 'import Bill from "./Bill.jsx";' not in c:
    c = c.replace('import ModalHead from "../ModalHead.jsx";', 'import ModalHead from "../ModalHead.jsx";\nimport Bill from "./Bill.jsx";')

old_order_jsx = """              <div className="mini-order" key={o.id}>"""
new_order_jsx = """              <button className="mini-order" key={o.id} style={{ width: "100%", textAlign: "left", cursor: "pointer", background: "none", border: "none", padding: 0 }} onClick={() => app.openModal(<Bill order={o} />, "modal--slim")}>"""

# also need to replace the closing tag if I changed it to a button
# Wait, I can just keep it as a div with role="button", tabIndex=0 to avoid changing closing tags
new_order_jsx = """              <div className="mini-order" key={o.id} role="button" tabIndex={0} onClick={() => app.openModal(<Bill order={o} />, "modal--slim")} onKeyDown={e => e.key === "Enter" && app.openModal(<Bill order={o} />, "modal--slim")} style={{ cursor: "pointer" }}>"""

c = c.replace(old_order_jsx, new_order_jsx)

with open('src/components/modals/AccountPanel.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

