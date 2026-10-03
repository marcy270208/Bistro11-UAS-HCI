import re

with open('src/components/ChatWidget.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add the toggle UI below the header
toggle_ui = """        </header>
        
        <div style={{ display: "flex", gap: "0.5rem", padding: "0.5rem 1rem", borderBottom: "1px solid var(--line-1)" }}>
          <button 
            style={{ flex: 1, padding: "0.5rem", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: "600", transition: "0.2s", background: ui.chatMode === "bot" ? "var(--accent-strong)" : "transparent", color: ui.chatMode === "bot" ? "var(--ink-dark)" : "var(--ink-2)", border: "1px solid " + (ui.chatMode === "bot" ? "var(--accent-strong)" : "var(--line-2)") }} 
            onClick={() => app.toggleChatMode("bot")}
          >
            <Ico name="chat" /> Assistant
          </button>
          <button 
            style={{ flex: 1, padding: "0.5rem", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", fontSize: "0.85rem", fontWeight: "600", transition: "0.2s", background: ui.chatMode === "chef" ? "var(--accent-strong)" : "transparent", color: ui.chatMode === "chef" ? "var(--ink-dark)" : "var(--ink-2)", border: "1px solid " + (ui.chatMode === "chef" ? "var(--accent-strong)" : "var(--line-2)") }} 
            onClick={() => app.toggleChatMode("chef")}
          >
            <Ico name="user" /> Ask the chef
          </button>
        </div>"""

c = re.sub(r'</header>', toggle_ui, c)

with open('src/components/ChatWidget.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
