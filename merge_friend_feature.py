import os
import shutil

src_dir = r"C:\Users\Marcy Priscilla\Downloads\p\src"
dest_dir = r"C:\Users\Marcy Priscilla\Downloads\Bistro-Eleven\src"

# Copy OrderTracker.jsx
shutil.copy2(os.path.join(src_dir, "components", "OrderTracker.jsx"), 
             os.path.join(dest_dir, "components", "OrderTracker.jsx"))

# Copy TrackOrder.jsx
shutil.copy2(os.path.join(src_dir, "components", "modals", "TrackOrder.jsx"), 
             os.path.join(dest_dir, "components", "modals", "TrackOrder.jsx"))

# Modify AccountPanel.jsx in destination to add the Track button
with open(os.path.join(dest_dir, "components", "modals", "AccountPanel.jsx"), "r", encoding="utf-8") as f:
    acc_panel = f.read()

if "import TrackOrder from" not in acc_panel:
    acc_panel = acc_panel.replace('import Bill from "./Bill.jsx";', 'import Bill from "./Bill.jsx";\nimport TrackOrder from "./TrackOrder.jsx";')

# Inject track button next to the Bill button
btn_code = """<button type="button" className="text-btn" onClick={() => app.openModal(<Bill order={o} />, "modal--slim")}>{app.t("Bill", "Struk")}</button>"""

if "Track the rider" not in acc_panel and "Lacak kurir" not in acc_panel:
    acc_panel = acc_panel.replace(
        btn_code, 
        btn_code + '\n                    {o.type === "delivery" && <button type="button" className="text-btn" onClick={() => app.openModal(<TrackOrder orderId={o.id} />)}>{app.t("Track the rider", "Lacak kurir")}</button>}'
    )

with open(os.path.join(dest_dir, "components", "modals", "AccountPanel.jsx"), "w", encoding="utf-8") as f:
    f.write(acc_panel)
