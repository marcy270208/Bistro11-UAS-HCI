import re

with open('src/components/OrderTracker.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

if 'import TrackOrder from "./modals/TrackOrder.jsx";' not in c:
    c = c.replace('import Bill from "./modals/Bill.jsx";', 'import Bill from "./modals/Bill.jsx";\nimport TrackOrder from "./modals/TrackOrder.jsx";')

old_push = """    push(() => {
      app.setTracker(null);
      app.openModal(<Bill order={order} />, "modal--slim");
    }, tEnd + 700 + 700);"""

new_push = """    push(() => {
      app.setTracker(null);
      if (order.type === "delivery") {
        app.openModal(<TrackOrder orderId={order.id} />);
      } else {
        app.openModal(<Bill order={order} />, "modal--slim");
      }
    }, tEnd + 700 + 700);"""

c = c.replace(old_push, new_push)

with open('src/components/OrderTracker.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
