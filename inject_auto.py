import re

with open('src/components/modals/TrackOrder.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

inject = """  const out = order?.status === "delivering";

  // Auto-advance simulation for demo purposes
  useEffect(() => {
    if (!order || arrived) return;
    const tId = setTimeout(() => {
      app.advanceOrder(order.id);
    }, order.status === "delivering" ? 12000 : 3500);
    return () => clearTimeout(tId);
  }, [order?.status, order?.id, arrived, app]);"""

c = c.replace('  const out = order?.status === "delivering";', inject)

with open('src/components/modals/TrackOrder.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
