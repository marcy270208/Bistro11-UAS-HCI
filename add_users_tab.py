with open('src/pages/AdminPage.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add users to tabs
c = c.replace('["feedback", t(lang, "admin.reviews", "Reviews")]];', '["feedback", t(lang, "admin.reviews", "Reviews")], ["users", t(lang, "admin.users", "Users")]];')

old_feedback = """            </div>
          )}
        </div>
      </div>
    </section>
  );
}"""

new_feedback = """            </div>
          )}

          {tab === "users" && (
            <div className="admin__panel">
              <div className="co-list">
                {data.accounts.map(a => (
                  <div key={a.email} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid var(--b-line)' }}>
                    <div>
                      <strong>{a.name}</strong> <br/>
                      <small className="muted">{a.email} {a.phone ? `· ${a.phone}` : ''}</small>
                    </div>
                    <button className="icon-btn" style={{ color: 'var(--c-err)' }} onClick={() => {
                      if (confirm(`Delete account ${a.email}?`)) app.deleteAccount(a.email);
                    }} title="Delete Account">
                      <Ico name="trash" />
                    </button>
                  </div>
                ))}
                {!data.accounts.length && <p className="muted">No accounts registered yet.</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}"""

c = c.replace(old_feedback, new_feedback)

with open('src/pages/AdminPage.jsx', 'w', encoding='utf-8') as f:
    f.write(c)

with open('src/lib/i18n.js', 'r', encoding='utf-8') as f:
    i18n = f.read()

en_add = '    "admin.users": "Users",\n'
id_add = '    "admin.users": "Pengguna",\n'

i18n = i18n.replace('    "admin.reviews": "Reviews",\n', '    "admin.reviews": "Reviews",\n' + en_add)
i18n = i18n.replace('    "admin.reviews": "Ulasan",\n', '    "admin.reviews": "Ulasan",\n' + id_add)

with open('src/lib/i18n.js', 'w', encoding='utf-8') as f:
    f.write(i18n)
