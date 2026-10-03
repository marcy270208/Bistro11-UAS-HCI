with open('src/pages/AdminPage.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_stats = """  const stats = [
    [`${t(lang, "admin.rev", "Revenue booked")}`, money(revenue), `${orders.length} ${t(lang, "admin.order_unit", "orders")}`],
    [`${t(lang, "admin.live", "Live tickets")}`, open, open ? t(lang, "admin.busy", "kitchen is busy") : t(lang, "admin.quiet", "all quiet")],
    [`${t(lang, "admin.plates", "Plates fired")}`, sold, top ? `${t(lang, "admin.top", "top")}: ${top[0]}` : t(lang, "admin.nosales", "no sales yet")],
    [`${t(lang, "admin.score", "Guest score")}`, avg.toFixed(2), `${live.length} ${t(lang, "admin.reviews_unit", "reviews")}`]
  ];"""

new_stats = """  const stats = [
    [`${t(lang, "admin.rev", "Revenue booked")}`, money(revenue), `${orders.length} ${t(lang, "admin.order_unit", "orders")}`],
    [`${t(lang, "admin.live", "Live tickets")}`, open, open ? t(lang, "admin.busy", "kitchen is busy") : t(lang, "admin.quiet", "all quiet")],
    [`${t(lang, "admin.score", "Guest score")}`, avg.toFixed(2), `${live.length} ${t(lang, "admin.reviews_unit", "reviews")}`]
  ];"""

c = c.replace(old_stats, new_stats)

with open('src/pages/AdminPage.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
