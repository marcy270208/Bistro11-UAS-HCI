with open('src/pages/AdminPage.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

if 'safeAvatar' not in c:
    c = c.replace('import { money } from "../lib/format.js";', 'import { money, safeAvatar } from "../lib/format.js";')

old_avatar_jsx = """<span className="avatar" style={{ width: 44, height: 44 }}>{(r.name || "G")[0]}</span>"""
new_avatar_jsx = """{(() => {
                      const acc = r.email ? app.findAccount(r.email) : null;
                      const pic = acc?.avatar ? safeAvatar(acc.avatar) : "";
                      return pic ? (
                        <img src={pic} className="avatar" style={{ width: 44, height: 44 }} alt={r.name} />
                      ) : (
                        <span className="avatar" style={{ width: 44, height: 44 }}>{(r.name || "G")[0]}</span>
                      );
                    })()}"""

c = c.replace(old_avatar_jsx, new_avatar_jsx)

with open('src/pages/AdminPage.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

