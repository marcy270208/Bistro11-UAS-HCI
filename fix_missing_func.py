with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

func = """  const setOrderStatus = useCallback((id, status) => {
    write(d => {
      const o = d.orders.find(x => x.id === id);
      if (o) o.status = status;
    });
  }, [write]);

"""

c = c.replace('  const emailOrder = useCallback', func + '  const emailOrder = useCallback')

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
