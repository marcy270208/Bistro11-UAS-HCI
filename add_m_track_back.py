import re

with open('src/components/ChatWidget.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

good_block = """        {asks && m.handoff && app.ui.chatMode !== "chef" && (
          <button className="chat__link" onClick={() => app.toggleChatMode("chef")}>
            {app.t(`Talk to ${STAFF.name} directly`, `Bicara langsung dengan ${STAFF.name}`)} <Ico name="arrow" />
          </button>
        )}
        {m.track && (
          <button className="chat__link" onClick={() => app.openModal(<TrackOrder orderId={m.track} />)}>
            {app.t("Watch the rider on the map", "Lacak kurir di peta")} <Ico name="arrow" />
          </button>
        )}
      </div>"""

if 'm.track &&' not in c:
    c = c.replace("""        {asks && m.handoff && app.ui.chatMode !== "chef" && (
          <button className="chat__link" onClick={() => app.toggleChatMode("chef")}>
            {app.t(`Talk to ${STAFF.name} directly`, `Bicara langsung dengan ${STAFF.name}`)} <Ico name="arrow" />
          </button>
        )}
      </div>""", good_block)

with open('src/components/ChatWidget.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
