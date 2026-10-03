import re

with open('src/lib/store.jsx', 'r', encoding='utf-8') as f:
    c = f.read()

# Add chatMode to defaults
c = c.replace('chatOpen: false, chatOut: false, chatTyping: false', 'chatOpen: false, chatOut: false, chatTyping: false, chatMode: "bot"')

# Update askChat to accept mode and use it
old_askChat = """  const askChat = useCallback(text => {
    const t = String(text || "").trim();
    if (!t) return;
    pushChat(VISITOR_THREAD, { from: "guest", text: t }, "chef");
    setUi(u => ({ ...u, chatTyping: true }));
    clearTimeout(timers.current.chat);
    timers.current.chat = setTimeout(() => {
      const a = answer(t, data.menu);
      setUi(u => ({ ...u, chatTyping: false }));
      pushChat(VISITOR_THREAD, { from: "bot", text: a.text, chips: a.chips || [], dishes: a.dishes || [], go: a.go || "" });
    }, 700 + Math.min(900, t.length * 14));
  }, [pushChat, data.menu]);"""

new_askChat = """  const askChat = useCallback((text, mode = "bot") => {
    const t = String(text || "").trim();
    if (!t) return;
    pushChat(VISITOR_THREAD, { from: "guest", text: t }, "chef");
    
    if (mode === "chef") {
      return; // Do not trigger bot answer
    }
    
    setUi(u => ({ ...u, chatTyping: true }));
    clearTimeout(timers.current.chat);
    timers.current.chat = setTimeout(() => {
      const a = answer(t, data.menu);
      setUi(u => ({ ...u, chatTyping: false }));
      pushChat(VISITOR_THREAD, { from: "bot", text: a.text, chips: a.chips || [], dishes: a.dishes || [], go: a.go || "" });
    }, 700 + Math.min(900, t.length * 14));
  }, [pushChat, data.menu]);

  const toggleChatMode = useCallback(mode => {
    setUi(u => {
      if (u.chatMode === mode) return u;
      
      const msg = mode === "chef" 
        ? `This one goes to ${STAFF.name}. The assistant has stepped back, so a reply arrives when the chef reads the board.`
        : `The assistant is back on the line. ${STAFF.name} still reads everything you wrote here.`;
        
      pushChat(VISITOR_THREAD, { from: "bot", text: msg });
      
      return { ...u, chatMode: mode };
    });
  }, [pushChat]);"""

c = c.replace(old_askChat, new_askChat)

# Add toggleChatMode to exports
c = c.replace('chatThread, openChat, closeChat, askChat, chefReply,', 'chatThread, openChat, closeChat, askChat, toggleChatMode, chefReply,')

with open('src/lib/store.jsx', 'w', encoding='utf-8') as f:
    f.write(c)
