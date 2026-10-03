import { useEffect, useRef, useState } from "react";
import { useApp } from "../../lib/store.jsx";
import { STAFF } from "../../data/biz.js";
import { initial, shortDate, clockTime } from "../../lib/format.js";
import Ico from "../../lib/icons.jsx";
const when = (iso) => {
  const d = new Date(iso);
  return d.toDateString() === (/* @__PURE__ */ new Date()).toDateString() ? clockTime(d) : shortDate(d);
};
const LAST = (m, t) => m ? m.from === "sys" ? t(m.text, m.text_id) : `${m.from === "guest" ? t("They ask: ", "Tamu tanya: ") : m.from === "chef" ? t("You said: ", "Kamu balas: ") : t("Assistant: ", "Asisten: ")}${t(m.text, m.text_id)}` : t("No messages yet", "Belum ada pesan");
export default function ChatDesk() {
  const app = useApp();
  const threads = app.data.chats;
  const [pick, setPick] = useState(null);
  const [draft, setDraft] = useState("");
  const scroll = useRef(null);
  const t = threads.find((x) => x.id === pick) || threads.find((x) => x.id === app.chatId) || threads[0] || null;
  const unreadAll = threads.reduce((n, x) => n + (x.unread?.chef || 0), 0);
  useEffect(() => {
    if (t?.unread?.chef) app.readChat(t.id, "chef");
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
    return /* @__PURE__ */ React.createElement("div", { className: "empty" }, /* @__PURE__ */ React.createElement("span", null, "\u{1F4AC}"), /* @__PURE__ */ React.createElement("h4", null, app.t("No conversations yet", "Belum ada percakapan")), /* @__PURE__ */ React.createElement("p", null, app.t("The assistant answers guests instantly and every question is filed here for you. Open the guest site and try the bubble in the bottom-right corner.", "Asisten menjawab tamu dengan cepat, dan setiap pertanyaan tersimpan di sini untuk kamu. Buka situs tamu dan coba gelembung di pojok kanan bawah.")), /* @__PURE__ */ React.createElement("button", { className: "btn btn--ghost btn--sm", onClick: app.previewSite }, /* @__PURE__ */ React.createElement(Ico, { name: "eye" }), " ", app.t("View the guest site", "Lihat situs tamu")));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "cd" }, /* @__PURE__ */ React.createElement("div", { className: "cd-list" }, threads.map((x) => {
    const last = x.msgs[x.msgs.length - 1];
    const mine = x.mode === "chef" && last?.from === "guest";
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: x.id,
        type: "button",
        className: `cd-row${t?.id === x.id ? " is-on" : ""}`,
        onClick: () => {
          setPick(x.id);
          app.readChat(x.id, "chef");
        }
      },
      /* @__PURE__ */ React.createElement("span", { className: "avatar", style: { width: 40, height: 40 } }, initial(x.name)),
      /* @__PURE__ */ React.createElement("span", { className: "cd-row__main" }, /* @__PURE__ */ React.createElement("b", null, x.name || app.t("Guest", "Tamu"), x.id === app.chatId && /* @__PURE__ */ React.createElement("small", { className: "cd-live" }, app.t("live", "langsung"))), mine && /* @__PURE__ */ React.createElement("small", { className: "cd-needs" }, app.t("Needs your reply", "Butuh balasanmu")), /* @__PURE__ */ React.createElement("small", null, LAST(last, app.t))),
      /* @__PURE__ */ React.createElement("span", { className: "cd-row__side" }, /* @__PURE__ */ React.createElement("time", null, when(x.updated || last?.at)), !!x.unread?.chef && /* @__PURE__ */ React.createElement("i", null, x.unread.chef))
    );
  })), /* @__PURE__ */ React.createElement("div", { className: "cd-pane" }, /* @__PURE__ */ React.createElement("header", { className: "cd-pane__head" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("b", null, t.name || app.t("Guest", "Tamu")), /* @__PURE__ */ React.createElement("small", null, t.email ? `${t.email} \xB7 ` : "", t.phone ? `${t.phone} \xB7 ` : "", t.msgs.length, " ", t.msgs.length === 1 ? app.t("message", "pesan") : app.t("messages", "pesan"), t.mode === "chef" ? ` \xB7 ${app.t("asked to speak with you", "minta bicara dengan kamu")}` : "")), /* @__PURE__ */ React.createElement("div", { className: "cd-pane__acts" }, /* @__PURE__ */ React.createElement("button", { className: "btn btn--ghost btn--sm", onClick: app.previewSite }, /* @__PURE__ */ React.createElement(Ico, { name: "eye" }), " ", app.t("Try it as a guest", "Coba sebagai tamu")), !!t.msgs.length && /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "da-btn",
      title: app.t("Clear this conversation", "Bersihkan percakapan ini"),
      "aria-label": app.t("Clear this conversation", "Bersihkan percakapan ini"),
      onClick: () => app.clearChat(t.id)
    },
    /* @__PURE__ */ React.createElement(Ico, { name: "trash" })
  ))), /* @__PURE__ */ React.createElement("div", { className: "cd-scroll", ref: scroll }, t.msgs.length ? t.msgs.map((m) => m.from === "sys" ? /* @__PURE__ */ React.createElement("p", { key: m.id, className: "cd-sys" }, app.t(m.text, m.text_id)) : /* @__PURE__ */ React.createElement("div", { key: m.id, className: `cd-msg${m.from === "chef" ? " cd-msg--you" : ""}${m.from === "bot" ? " cd-msg--bot" : ""}` }, /* @__PURE__ */ React.createElement("span", { className: "cd-who" }, m.from === "chef" ? m.by || STAFF.name : m.from === "bot" ? app.t("assistant \xB7 auto", "asisten \xB7 otomatis") : t.name || app.t("Guest", "Tamu"), /* @__PURE__ */ React.createElement("time", null, when(m.at))), /* @__PURE__ */ React.createElement("div", { className: "cd-bubble" }, app.t(m.text, m.text_id)))) : /* @__PURE__ */ React.createElement("p", { className: "muted" }, app.t("Nothing said yet. The assistant greets the guest when they open the panel, and their questions land here.", "Belum ada yang terucap. Asisten menyapa tamu saat mereka membuka panel, dan pertanyaan mereka muncul di sini."))), /* @__PURE__ */ React.createElement("form", { className: "cd-foot", onSubmit: (e) => {
    e.preventDefault();
    send();
  } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: draft,
      onChange: (e) => setDraft(e.target.value),
      placeholder: app.t(`Reply to ${t.name || "the guest"} as ${STAFF.name}\u2026`, `Balas ${t.name || "tamu"} sebagai ${STAFF.name}\u2026`),
      "aria-label": app.t("Reply to the guest", "Balas tamu"),
      autoComplete: "off"
    }
  ), /* @__PURE__ */ React.createElement("button", { className: "btn btn--primary btn--sm", type: "submit", disabled: !draft.trim() }, app.t("Reply", "Balas"), " ", /* @__PURE__ */ React.createElement(Ico, { name: "send" }))), /* @__PURE__ */ React.createElement("p", { className: "cd-note" }, app.t("The assistant writes its own answers from the live menu; anything you send here appears in the guest's chat panel", "Asisten menulis jawabannya sendiri dari menu langsung; apa pun yang kamu kirim di sini muncul di panel chat tamu"), unreadAll ? app.t(` \xB7 ${unreadAll} unread across the board`, ` \xB7 ${unreadAll} belum dibaca di papan`) : "", ".")));
}
