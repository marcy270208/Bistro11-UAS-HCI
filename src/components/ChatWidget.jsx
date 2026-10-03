import { useEffect, useRef, useState } from "react";
import { useApp } from "../lib/store.jsx";
import { t } from "../lib/i18n.js";
import { TOPICS } from "../data/knowledge.js";
import { STAFF } from "../data/biz.js";
import { money, clockTime } from "../lib/format.js";
import Ico from "../lib/icons.jsx";
import Photo from "./Photo.jsx";
import DishDetail from "./modals/DishDetail.jsx";
import TrackOrder from "./modals/TrackOrder.jsx";

/* topics that advertise themselves as a starter question - emoji stripped off the chip */
const QUICK = TOPICS.filter(t => t.chip)
  .map(t => [t.id, t.chip.replace(/^[^\p{L}\p{N}]+/u, "").trim()]);

/* an answer can point the guest at a section of the site */
const GO = {
  menu: ["menu", "See the whole board"],
  visit: ["visit", "Where we cook"],
  reviews: ["reviews", "Read guest reviews"],
  gallery: ["gallery", "Look at the room"]
};

function Bubble({ m, app, asks }) {
  const plates = (m.dishes || []).map(id => app.dishById(id)).filter(d => d && d.available !== false);
  const go = GO[m.go];
  return (
    <div className={`chat__msg chat__msg--${m.from}`}>
      <div className="chat__bubble">
        {m.from !== "bot" && (
          <b className="chat__by">{m.from === "chef" ? m.by || STAFF.name : "You"}</b>
        )}
        <p>{m.text}</p>

        {!!plates.length && (
          <div className="chat__plates">
            {plates.map(d => (
              <button
                key={d.id}
                onClick={() => app.openModal(<DishDetail dish={d} />, "modal--wide")}
                aria-label={`Open ${d.name}`}
              >
                <Photo src={d.imgs?.[0]} alt={d.name} cat={d.cat} />
                <span><b>{d.name}</b><em>{money(d.price)}</em></span>
              </button>
            ))}
          </div>
        )}

        {asks && !!m.chips?.length && (
          <div className="chat__asks">
            {m.chips.map(c => <button key={c} onClick={() => app.askChat(c)}>{c}</button>)}
          </div>
        )}
        {asks && go && (
          <button className="chat__link" onClick={() => app.goSection(go[0])}>
            {go[1]} <Ico name="arrow" />
          </button>
        )}
      </div>
      <time className="chat__at" dateTime={m.at}>{clockTime(m.at)}</time>
    </div>
  );
}

export default function ChatWidget() {
  const app = useApp();
  const lang = app.ui.lang;
  const { ui } = app;
  const msgs = app.chatThread?.msgs || [];
  const [draft, setDraft] = useState("");
  const body = useRef(null);
  const input = useRef(null);

  const shown = ui.chat || ui.chatOut;
  const unread = app.chatThread?.unread?.guest || 0;

  useEffect(() => {
    if (!ui.chat) return;
    const el = body.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [ui.chat, msgs.length, ui.chatTyping, draft]);

  useEffect(() => {
    if (!ui.chat) return undefined;
    const id = setTimeout(() => input.current?.focus({ preventScroll: true }), 240);
    return () => clearTimeout(id);
  }, [ui.chat]);

  if (ui.view !== "guest") return null;
  if (!app.data.session) return null;

  const send = text => {
    const v = String(text || "").trim();
    if (!v) return;
    setDraft("");
    app.askChat(v, app.ui.chatMode);
  };

  const last = msgs[msgs.length - 1];
  const asked = msgs.some(m => m.from === "guest");

  return (
    <>
      <button
        className={`chat-launch${shown ? " is-tuck" : ""}`}
        onClick={app.openChat}
        aria-label={unread
          ? `Open the live chat - ${unread} new message${unread > 1 ? "s" : ""} from the kitchen`
          : "Open the live chat"}
      >
        <Ico name="chat" />
        <span>{t(lang, "chat.ask")}</span>
        {!!unread && <b className="chat-launch__pip">{unread}</b>}
      </button>

      <section
        className={`chat${ui.chatOut ? " is-out" : ""}`}
        hidden={!shown}
        aria-label="Live chat with Bistro Eleven"
      >
        <header className="chat__head">
          <span className="chat__ava" aria-hidden="true">🤖</span>
          <div className="chat__who">
            <b>Bistro Eleven assistant</b>
            <span className="chat__state"><i /> answers now · {STAFF.name} reads the board</span>
          </div>
          <button className="chat__x" onClick={app.closeChat} aria-label="Close the chat">
            <Ico name="close" />
          </button>
                </header>
        
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
        </div>

        <div className="chat__body" ref={body}>
          <div className="chat__log" aria-live="polite">
            {msgs.map(m => <Bubble key={m.id} m={m} app={app} asks={m === last} />)}
            {ui.chatTyping && (
              <div className="chat__msg chat__msg--bot">
                <div className="chat__bubble chat__bubble--typing" aria-label="The assistant is typing">
                  <i /><i /><i />
                </div>
              </div>
            )}
          </div>

          {!asked && (
            <div className="chat__quick">
              {QUICK.map(([id, q]) => <button key={id} onClick={() => send(q)}>{q}</button>)}
            </div>
          )}
          {m.track && (
            <button className="chat__link" onClick={() => app.openModal(<TrackOrder orderId={m.track} />)}>
              {app.t("Watch the rider on the map", "Lacak kurir di peta")} <Ico name="arrow" />
            </button>
          )}
        </div>

        <footer className="chat__foot">
          <form
            className="chat__form"
            onSubmit={e => { e.preventDefault(); send(draft); }}
          >
            <input
              ref={input}
              type="text"
              value={draft}
              onChange={e => setDraft(e.target.value)}
              placeholder="Dish, allergen, price, hours…"
              autoComplete="off"
              aria-label="Message the assistant"
            />
            <button className="chat__send" type="submit" disabled={!draft.trim()} aria-label="Send message">
              <Ico name="send" />
            </button>
          </form>
          <p className="chat__note">It reads the live menu - nothing here touches your basket.</p>
        </footer>
      </section>
    </>
  );
}
