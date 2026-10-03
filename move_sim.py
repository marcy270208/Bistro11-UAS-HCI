import re

with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

inject_sim = """  const advanceOrder = useCallback(id => {
    write(d => {
      const o = d.orders.find(x => x.id === id);
      if (!o) return;
      o.status = STATUS_FLOW[Math.min(STATUS_FLOW.indexOf(o.status) + 1, STATUS_FLOW.length - 1)];
    });
  }, [write]);

  // Global Demo Simulation: automatically advance active orders
  useEffect(() => {
    const activeOrders = data.orders.filter(o => o.status !== "done" && o.status !== "cancelled");
    if (activeOrders.length === 0) return;
    
    const timeouts = [];
    activeOrders.forEach(o => {
      // 12 seconds for delivering animation, 3.5 seconds for kitchen stages
      const delay = o.status === "delivering" ? 12000 : 3500;
      timeouts.push(setTimeout(() => {
        advanceOrder(o.id);
      }, delay));
    });
    
    return () => timeouts.forEach(clearTimeout);
  }, [data.orders, advanceOrder]);"""

c = re.sub(r'  const advanceOrder = useCallback\(id => \{\n.*?\}, \[write\]\);', inject_sim, c, flags=re.DOTALL)

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

# Remove the simulation from TrackOrder.jsx
with open('src/components/modals/TrackOrder.jsx', 'r', encoding='utf-8') as f:
    c2 = f.read()

bad_sim = """  // Auto-advance simulation for demo purposes
  useEffect(() => {
    if (!order || arrived) return;
    const tId = setTimeout(() => {
      app.advanceOrder(order.id);
    }, order.status === "delivering" ? 12000 : 3500);
    return () => clearTimeout(tId);
  }, [order?.status, order?.id, arrived, app]);"""

c2 = c2.replace(bad_sim, "")

with open('src/components/modals/TrackOrder.jsx', 'w', encoding='utf-8') as f:
    f.write(c2)
