import re

with open('src/components/ChatWidget.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

if 'import TrackOrder from "./modals/TrackOrder.jsx";' not in c:
    c = c.replace('import DishDetail from "./modals/DishDetail.jsx";', 'import DishDetail from "./modals/DishDetail.jsx";\nimport TrackOrder from "./modals/TrackOrder.jsx";')

btn_code = """          )}
          {m.track && (
            <button className="chat__link" onClick={() => app.openModal(<TrackOrder orderId={m.track} />)}>
              {app.t("Watch the rider on the map", "Lacak kurir di peta")} <Ico name="arrow" />
            </button>
          )}
        </div>"""

if 'm.track &&' not in c:
    c = c.replace("""          )}
        </div>""", btn_code)

with open('src/components/ChatWidget.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
