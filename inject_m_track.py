import re

with open('src/components/ChatWidget.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

good_block = """        {asks && go && (
          <button className="chat__link" onClick={() => app.goSection(go[0])}>
            {go[1]} <Ico name="arrow" />
          </button>
        )}
        {m.track && (
          <button className="chat__link" onClick={() => app.openModal(<TrackOrder orderId={m.track} />)}>
            {app.t("Watch the rider on the map", "Lacak kurir di peta")} <Ico name="arrow" />
          </button>
        )}
      </div>
      <time className="chat__at" dateTime={m.at}>{clockTime(m.at)}</time>"""

if 'm.track && (' not in c:
    c = c.replace("""        {asks && go && (
          <button className="chat__link" onClick={() => app.goSection(go[0])}>
            {go[1]} <Ico name="arrow" />
          </button>
        )}
      </div>
      <time className="chat__at" dateTime={m.at}>{clockTime(m.at)}</time>""", good_block)

with open('src/components/ChatWidget.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
