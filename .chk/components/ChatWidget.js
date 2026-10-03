import { useEffect, useRef, useState } from "react";
import { useApp } from "../lib/store.jsx";
import { TOPICS, chipText } from "../data/knowledge.js";
import { STAFF } from "../data/biz.js";
import { money, clockTime, weekday } from "../lib/format.js";
import { kitchen } from "../lib/hours.js";
import Ico from "../lib/icons.jsx";
import Photo from "./Photo.jsx";
import DishDetail from "./modals/DishDetail.jsx";
import TrackOrder from "./modals/TrackOrder.jsx";
const QUICK = TOPICS.filter((t) => t.chip).map((t) => [t.id, t.chip.replace(/^[^\p{L}\p{N}]+/u, "").trim()]);
const CHEF_QUICK = [
  ["Can you hold a table for four tonight?", "Boleh tahanin meja untuk empat orang malam ini?"],
  ["Someone at the table has a nut allergy, is that okay?", "Satu meja ada alergi kacang, aman?"],
  ["What do you recommend today?", "Hari ini kamu rekomendasiin apa?"]
];
const GO = {
  menu: ["menu", "See the whole board", "Lihat semua menu"],
  visit: ["visit", "Where we cook", "Lihat dapur kami"],
  reviews: ["reviews", "Read guest reviews", "Baca ulasan tamu"],
  gallery: ["gallery", "Look at the room", "Lihat suasananya"]
};
const chipLabel = (c, t, menu) => {
  const m = /^Tell me about (.+)$/.exec(c);
  if (!m) return chipText(c, t);
  const plate = (menu || []).find((d) => d.name === m[1]);
  return t(`Tell me about ${m[1]}`, `Ceritakan soal ${plate?.name_id || m[1]}`);
};
const chipId = (c, menu) => chipLabel(c, (en, id) => id || en, menu);
function Bubble({ m, app, asks }) {
  if (m.from === "sys") {
    return /* @__PURE__ */ React.createElement("div", { className: "chat__msg chat__msg--sys" }, /* @__PURE__ */ React.createElement("p", null, app.t(m.text, m.text_id)));
  }
  const plates = (m.dishes || []).map((id) => app.dishById(id)).filter((d) => d && d.available !== false);
  const go = GO[m.go];
  return /* @__PURE__ */ React.createElement("div", { className: `chat__msg chat__msg--${m.from}` }, /* @__PURE__ */ React.createElement("div", { className: "chat__bubble" }, m.from !== "bot" && /* @__PURE__ */ React.createElement("b", { className: "chat__by" }, m.from === "chef" ? m.by || STAFF.name : app.t("You", "Kamu")), /* @__PURE__ */ React.createElement("p", null, app.t(m.text, m.text_id)), !!plates.length && /* @__PURE__ */ React.createElement("div", { className: "chat__plates" }, plates.map((d) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: d.id,
      onClick: () => app.openModal(/* @__PURE__ */ React.createElement(DishDetail, { dish: d }), "modal--wide"),
      "aria-label": app.t(`Open ${d.name}`, `Buka ${app.t(d.name, d.name_id)}`)
    },
    /* @__PURE__ */ React.createElement(Photo, { src: d.imgs?.[0], alt: app.t(d.name, d.name_id), cat: d.cat }),
    /* @__PURE__ */ React.createElement("span", null, /* @__PURE__ */ React.createElement("b", null, app.t(d.name, d.name_id)), /* @__PURE__ */ React.createElement("em", null, money(d.price)))
  ))), asks && !!m.chips?.length && /* @__PURE__ */ React.createElement("div", { className: "chat__asks" }, m.chips.map((c) => /* @__PURE__ */ React.createElement("button", { key: c, onClick: () => app.askChat(c, chipId(c, app.data.menu)) }, chipLabel(c, app.t, app.data.menu)))), asks && go && /* @__PURE__ */ React.createElement("button", { className: "chat__link", onClick: () => app.goSection(go[0]) }, app.t(go[1], go[2]), " ", /* @__PURE__ */ React.createElement(Ico, { name: "arrow" })), m.track && /* @__PURE__ */ React.createElement("button", { className: "chat__link", onClick: () => app.openModal(/* @__PURE__ */ React.createElement(TrackOrder, { orderId: m.track })) }, app.t("Watch the rider on the map", "Lacak kurir di peta"), " ", /* @__PURE__ */ React.createElement(Ico, { name: "arrow" }))), /* @__PURE__ */ React.createElement("time", { className: "chat__at", dateTime: m.at }, clockTime(m.at)));
}
export default function ChatWidget() {
  const app = useApp();
  const { ui, t } = app;
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
    if (!ui.chat) return void 0;
    const id = setTimeout(() => input.current?.focus({ preventScroll: true }), 240);
    return () => clearTimeout(id);
  }, [ui.chat]);
  if (ui.view !== "guest") return null;
  const send = (text, label) => {
    const v = String(text || "").trim();
    if (!v) return;
    setDraft("");
    app.askChat(v, label);
  };
  const last = msgs[msgs.length - 1];
  const asked = msgs.some((m) => m.from === "guest");
  const chef = app.chatMode === "chef";
  const at = kitchen();
  const nextOpen = at.opensAt ? at.inDays ? `${weekday(at.opensAt)} ${clockTime(at.opensAt)}` : clockTime(at.opensAt) : t("soon", "segera");
  const waiting = chef && last?.from === "guest";
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: `chat-launch${shown ? " is-tuck" : ""}`,
      onClick: app.openChat,
      "aria-label": unread ? t(`Open the live chat, ${unread} new message${unread > 1 ? "s" : ""} from the kitchen`, `Buka obrolan langsung, ${unread} pesan baru dari dapur`) : t("Open the live chat", "Buka obrolan langsung")
    },
    /* @__PURE__ */ React.createElement(Ico, { name: "chat" }),
    /* @__PURE__ */ React.createElement("span", null, chef ? t(`Chat ${STAFF.name}`, `Chat ${STAFF.name}`) : t("Ask about the menu", "Tanya soal menu")),
    !!unread && /* @__PURE__ */ React.createElement("b", { className: "chat-launch__pip" }, unread)
  ), /* @__PURE__ */ React.createElement(
    "section",
    {
      className: `chat${ui.chatOut ? " is-out" : ""}`,
      hidden: !shown,
      "aria-label": t("Live chat with Bistro Eleven", "Obrolan langsung dengan Bistro Eleven")
    },
    /* @__PURE__ */ React.createElement("header", { className: "chat__head" }, /* @__PURE__ */ React.createElement("span", { className: "chat__ava", "aria-hidden": "true" }, chef ? "\u{1F468}\u200D\u{1F373}" : "\u{1F916}"), /* @__PURE__ */ React.createElement("div", { className: "chat__who" }, /* @__PURE__ */ React.createElement("b", null, chef ? STAFF.name : t("Bistro Eleven assistant", "Asisten Bistro Eleven")), chef ? /* @__PURE__ */ React.createElement("span", { className: `chat__state${at.open ? "" : " is-shut"}` }, /* @__PURE__ */ React.createElement("i", null), at.open ? t(`At the pass until ${clockTime(at.closesAt)}`, `Ada di pass sampai ${clockTime(at.closesAt)}`) : t(`Kitchen closed, opens ${nextOpen}`, `Dapur tutup, buka ${nextOpen}`)) : /* @__PURE__ */ React.createElement("span", { className: "chat__state" }, /* @__PURE__ */ React.createElement("i", null), " ", t("answers now", "siap menjawab"), " \xB7 ", STAFF.name, " ", t("reads the board", "ikut memantau"))), /* @__PURE__ */ React.createElement("button", { className: "chat__x", onClick: app.closeChat, "aria-label": t("Close the chat", "Tutup obrolan") }, /* @__PURE__ */ React.createElement(Ico, { name: "close" }))),
    /* @__PURE__ */ React.createElement("div", { className: "chat__modes", role: "group", "aria-label": t("Who you are talking to", "Kamu sedang bicara dengan siapa") }, /* @__PURE__ */ React.createElement("button", { type: "button", className: chef ? "" : "is-on", "aria-pressed": !chef, onClick: () => app.setChatMode("bot") }, /* @__PURE__ */ React.createElement(Ico, { name: "chat" }), " ", t("Assistant", "Asisten")), /* @__PURE__ */ React.createElement("button", { type: "button", className: chef ? "is-on" : "", "aria-pressed": chef, onClick: () => app.setChatMode("chef") }, /* @__PURE__ */ React.createElement(Ico, { name: "user" }), " ", t("Ask the chef", "Tanya chef"))),
    /* @__PURE__ */ React.createElement("div", { className: "chat__body", ref: body }, /* @__PURE__ */ React.createElement("div", { className: "chat__log", "aria-live": "polite" }, msgs.map((m) => /* @__PURE__ */ React.createElement(Bubble, { key: m.id, m, app, asks: m === last })), ui.chatTyping && /* @__PURE__ */ React.createElement("div", { className: "chat__msg chat__msg--bot" }, /* @__PURE__ */ React.createElement("div", { className: "chat__bubble chat__bubble--typing", "aria-label": t("The assistant is typing", "Asisten sedang mengetik") }, /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("i", null), /* @__PURE__ */ React.createElement("i", null))), waiting && /* @__PURE__ */ React.createElement("p", { className: "chat__wait" }, /* @__PURE__ */ React.createElement("i", null), at.open ? t(`Sent ${clockTime(last.at)}, waiting for ${STAFF.name} to reply`, `Terkirim ${clockTime(last.at)}, menunggu ${STAFF.name} balas`) : t(`Saved on the board, the kitchen opens ${nextOpen}`, `Tersimpan di papan, dapur buka ${nextOpen}`))), !asked && /* @__PURE__ */ React.createElement("div", { className: "chat__quick" }, chef ? CHEF_QUICK.map(([en, id]) => /* @__PURE__ */ React.createElement("button", { key: en, onClick: () => send(en, id) }, t(en, id))) : QUICK.map(([id, q]) => /* @__PURE__ */ React.createElement("button", { key: id, onClick: () => send(q, chipId(q, app.data.menu)) }, chipLabel(q, t, app.data.menu))))),
    /* @__PURE__ */ React.createElement("footer", { className: "chat__foot" }, /* @__PURE__ */ React.createElement(
      "form",
      {
        className: "chat__form",
        onSubmit: (e) => {
          e.preventDefault();
          send(draft);
        }
      },
      /* @__PURE__ */ React.createElement(
        "input",
        {
          ref: input,
          type: "text",
          value: draft,
          onChange: (e) => setDraft(e.target.value),
          placeholder: chef ? t(`Message ${STAFF.name}\u2026`, `Pesan untuk ${STAFF.name}\u2026`) : t("Dish, allergen, price, hours\u2026", "Hidangan, alergen, harga, jam buka\u2026"),
          autoComplete: "off",
          "aria-label": chef ? t("Message the chef", "Kirim pesan ke chef") : t("Message the assistant", "Kirim pesan ke asisten")
        }
      ),
      /* @__PURE__ */ React.createElement("button", { className: "chat__send", type: "submit", disabled: !draft.trim(), "aria-label": t("Send message", "Kirim") }, /* @__PURE__ */ React.createElement(Ico, { name: "send" }))
    ), /* @__PURE__ */ React.createElement("p", { className: "chat__note" }, chef ? t(`${STAFF.name} answers between services, nothing is written for them here.`, `${STAFF.name} balas di sela jam masak, tidak ada yang ditulis otomatis untuknya di sini.`) : t("It reads the live menu, nothing here touches your basket.", "Ia membaca menu langsung, semuanya di sini tidak mengubah keranjangmu.")))
  ));
}
