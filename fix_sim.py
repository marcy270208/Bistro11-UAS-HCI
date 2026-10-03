import re

with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

sim_logic = """
  // Global Demo Simulation
  useEffect(() => {
    const activeOrders = data.orders.filter(o => o.status !== "done" && o.status !== "cancelled");
    if (activeOrders.length === 0) return;
    const timeouts = [];
    activeOrders.forEach(o => {
      const delay = o.status === "delivering" ? 12000 : 3500;
      timeouts.push(setTimeout(() => advanceOrder(o.id), delay));
    });
    return () => timeouts.forEach(clearTimeout);
  }, [data.orders, advanceOrder]);
"""

c = c.replace('const printOrder = useCallback(id => {', sim_logic + '\n  const printOrder = useCallback(id => {')

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
