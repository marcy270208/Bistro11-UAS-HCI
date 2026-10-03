import re

with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# First, remove the bad advanceOrder and global sim I added, and any leftover
# Since I replaced it from advanceOrder up to setOrderStatus, the file currently has:
#   const advanceOrder = useCallback(id => { ... }, [write]);
#   // Global Demo Simulation ...
#   const emailOrder = useCallback(id => {

pattern = r'  const advanceOrder = useCallback\(id => \{.*?  const emailOrder = useCallback\(id => \{'

replacement = """  const advanceOrder = useCallback(id => {
    write(d => {
      const o = d.orders.find(x => x.id === id);
      if (!o) return;
      o.status = STATUS_FLOW[Math.min(STATUS_FLOW.indexOf(o.status) + 1, STATUS_FLOW.length - 1)];
    });
    // Removed toast because it would be annoying if it auto-advances
  }, [write]);

  const setOrderStatus = useCallback((id, status) => {
    write(d => {
      const o = d.orders.find(x => x.id === id);
      if (o) o.status = status;
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
  }, [data.orders, advanceOrder]);

  const emailOrder = useCallback(id => {"""

c = re.sub(pattern, replacement, c, flags=re.DOTALL)

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
