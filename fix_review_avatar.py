with open('src/components/ReviewSection.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace('import { shortDate } from "../lib/format.js";', 'import { shortDate, safeAvatar } from "../lib/format.js";')

old_avatar_jsx = """                <span className="avatar">{r.name[0] || "G"}</span>"""

new_avatar_jsx = """                {(() => {
                  const acc = r.email ? app.findAccount(r.email) : null;
                  const pic = acc?.avatar ? safeAvatar(acc.avatar) : "";
                  return pic ? (
                    <img src={pic} className="avatar" alt={r.name} />
                  ) : (
                    <span className="avatar">{r.name[0] || "G"}</span>
                  );
                })()}"""

c = c.replace(old_avatar_jsx, new_avatar_jsx)

with open('src/components/ReviewSection.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

