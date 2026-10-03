import re

with open('src/components/modals/TrackOrder.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Remove the Tanya Dapur button block completely
pattern = r'\{\?\s*\(\s*<button className="btn btn--primary".*?\{t\("Ask the kitchen", "Tanya dapur"\)\}\s*</button>\s*\)\}'
# Wait, it's actually:
#            ) : (
#              <button className="btn btn--primary"
#                      onClick={() => { app.closeModal(); app.openChat(); }}>
#                {t("Ask the kitchen", "Tanya dapur")}
#              </button>
#            )}

c = re.sub(r'\s*\)\s*:\s*\(\s*<button className="btn btn--primary"\s*onClick=\{\(\) => \{ app\.closeModal\(\); app\.openChat\(\); \}\}>\s*\{t\("Ask the kitchen", "Tanya dapur"\)\}\s*</button>\s*\)', '', c, flags=re.DOTALL)

with open('src/components/modals/TrackOrder.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
