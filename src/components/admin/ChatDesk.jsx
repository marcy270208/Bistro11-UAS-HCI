import { useEffect, useRef, useState } from "react";
import { useApp } from "../../lib/store.jsx";
import { VISITOR_THREAD } from "../../data/knowledge.js";
import { STAFF } from "../../data/biz.js";
import { initial, shortDate, clockTime } from "../../lib/format.js";
import Ico from "../../lib/icons.jsx";

const when = iso => {
  const d = new Date(iso);
  return d.toDateString() === new Date().toDateString() ? clockTime(d) : shortDate(d);
};

const LAST = m => (m ? `${m.from === "guest" ? "They ask: " : m.from === "chef" ? "You said: " : "Assistant: "}${m.text}` : "No messages yet");

export default function ChatDesk() {
  const app = useApp();
  const threads = app.data.chats;
  const [pick, setPick] = useState(null);
  const [draft, setDraft] = useState("");
  const scroll = useRef(null);

  const t = threads.find(x => x.id === pick) || threads.find(x => x.id === VISITOR_THREAD) || threads[0] || null;
  const unreadAll = threads.reduce((n, x) => n + (x.unread?.chef || 0), 0);

  useEffect(() => {
    if (t?.unread?.chef) app.readChat(t.id, "chef");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t?.id, t?.msgs.length]);

  useEffect(() => {
    const el = scroll.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [t?.id, t?.msgs.length, draft]);

  const send = () => {
    if (!t || !draft.trim()) return;
    app.chefReply(t.id, draft);
    app.readChat(t.id, "chef");
    setDraft("");
  };

  if (!threads.length) {
    return (
      <div className="empty">
        <span>💬</span>
        <h4>No conversations yet</h4>
        <p>The assistant answers guests instantly and every question is filed here for you. Open the guest site and try the bubble in the bottom-right corner.</p>
        <button className="btn btn--ghost btn--sm" onClick={app.previewSite}><Ico name="eye" /> View the guest site</button>
      </div>
    );
  }

  return (
    <div className="cd">
      <div className="cd-list">
        {threads.map(x => {
          const last = x.msgs[x.msgs.length - 1];
          return (
            <button key={x.id} type="button" className={`cd-row${t?.id === x.id ? " is-on" : ""}`}
                    onClick={() => { setPick(x.id); app.readChat(x.id, "chef"); }}>
              <span className="avatar" style={{ width: 40, height: 40 }}>{initial(x.name)}</span>
              <span className="cd-row__main">
                <b>{x.name || "Guest"}{x.id === VISITOR_THREAD && <small className="cd-live">live</small>}</b>
                <small>{LAST(last)}</small>
              </span>
              <span className="cd-row__side">
                <time>{when(x.updated || last?.at)}</time>
                {!!x.unread?.chef && <i>{x.unread.chef}</i>}
              </span>
            </button>
          );
        })}
      </div>

      <div className="cd-pane">
        <header className="cd-pane__head">
          <div>
            <b>{t.name || "Guest"}</b>
            <small>
              {t.email ? `${t.email} · ` : ""}{t.phone ? `${t.phone} · ` : ""}
              {t.msgs.length} {t.msgs.length === 1 ? "message" : "messages"}
            </small>
          </div>
          <div className="cd-pane__acts">
            <button className="btn btn--ghost btn--sm" onClick={app.previewSite}><Ico name="eye" /> Try it as a guest</button>
            {!!t.msgs.length && (
              <button className="da-btn" title="Clear this conversation" aria-label="Clear this conversation"
                      onClick={() => app.clearChat(t.id)}>
                <Ico name="trash" />
              </button>
            )}
          </div>
        </header>

        <div className="cd-scroll" ref={scroll}>
          {t.msgs.length ? t.msgs.map(m => (
            <div key={m.id} className={`cd-msg${m.from === "chef" ? " cd-msg--you" : ""}${m.from === "bot" ? " cd-msg--bot" : ""}`}>
              <span className="cd-who">
                {m.from === "chef" ? m.by || STAFF.name : m.from === "bot" ? "assistant · auto" : t.name || "Guest"}
                <time>{when(m.at)}</time>
              </span>
              <div className="cd-bubble">{m.text}</div>
            </div>
          )) : (
            <p className="muted">Nothing said yet - the assistant greets the guest when they open the panel, and their questions land here.</p>
          )}
        </div>

        <form className="cd-foot" onSubmit={e => { e.preventDefault(); send(); }}>
          <input
            type="text"
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder={`Reply to ${t.name || "the guest"} as ${STAFF.name}…`}
            aria-label="Reply to the guest"
            autoComplete="off"
          />
          <button className="btn btn--primary btn--sm" type="submit" disabled={!draft.trim()}>
            Reply <Ico name="send" />
          </button>
        </form>
        <p className="cd-note">
          The assistant writes its own answers from the live menu; anything you send here appears in the guest&apos;s chat panel
          {unreadAll ? ` · ${unreadAll} unread across the board` : ""}.
        </p>
      </div>
    </div>
  );
}
