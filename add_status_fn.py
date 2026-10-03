import re

with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_advance = """  const advanceOrder = useCallback(id => {
    write(d => {
      const o = d.orders.find(x => x.id === id);
      if (!o) return;
      o.status = STATUS_FLOW[Math.min(STATUS_FLOW.indexOf(o.status) + 1, STATUS_FLOW.length - 1)];
    });
    const o = data.orders.find(x => x.id === id);
    if (o) toast(`${o.id} moved on`, "🍽️");
  }, [write, data.orders, toast]);"""

new_advance = """  const advanceOrder = useCallback(id => {
    write(d => {
      const o = d.orders.find(x => x.id === id);
      if (!o) return;
      o.status = STATUS_FLOW[Math.min(STATUS_FLOW.indexOf(o.status) + 1, STATUS_FLOW.length - 1)];
    });
    const o = data.orders.find(x => x.id === id);
    if (o) toast(`${o.id} moved on`, "🍽️");
  }, [write, data.orders, toast]);

  const setOrderStatus = useCallback((id, status) => {
    write(d => {
      const o = d.orders.find(x => x.id === id);
      if (o) o.status = status;
    });
  }, [write]);"""
c = c.replace(old_advance, new_advance)

c = c.replace('placeOrder, advanceOrder, emailOrder,', 'placeOrder, advanceOrder, setOrderStatus, emailOrder,')

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
