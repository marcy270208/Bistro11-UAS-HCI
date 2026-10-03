/* Small formatting + validation helpers shared across the app. */

const RP = new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 });
export const money = n => RP.format(Number(n) || 0);
export const plural = (n, w) => (n === 1 ? `1 ${w}` : `${n} ${w}s`);
export const uid = p => p + Math.random().toString(36).slice(2, 7).toUpperCase();
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const r0 = n => Math.round(n);
export const initial = n => (n || "G").trim()[0]?.toUpperCase() || "G";

export const badEmail = v => !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v);
export const okEmail = v => /^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(v);

/* Only ever let an <img> point at https or an inline image data-url. */
const SAFE_SRC = /^https:\/\/\S+$/i;
const SAFE_DATA = /^data:image\/[a-z+.-]+;base64,[a-z0-9+/=]+$/i;
export const safeSrc = s => (SAFE_SRC.test(s) || SAFE_DATA.test(s) ? s : "");
export const safeAvatar = s => (SAFE_DATA.test(s || "") ? s : "");

let LOCALE = "en-GB";
export const setLocale = l => { LOCALE = l || "en-GB"; };

export const shortDate = d => new Date(d).toLocaleDateString(LOCALE, { month: "short", day: "numeric", year: "numeric" });
export const clockTime = d => new Date(d).toLocaleTimeString(LOCALE, { hour: "2-digit", minute: "2-digit" });
export const weekday = d => new Date(d).toLocaleDateString(LOCALE, { weekday: "long" });

/* Resize an uploaded picture down to a size that survives localStorage. */
export function readAndShrink(file, max = 220) {
  return new Promise((resolve, reject) => {
    if (!/^image\//.test(file.type)) return reject(new Error("not an image"));
    const fr = new FileReader();
    fr.onerror = () => reject(new Error("unreadable"));
    fr.onload = () => {
      const im = new Image();
      im.onerror = () => reject(new Error("unreadable"));
      im.onload = () => {
        const sc = Math.min(1, max / Math.max(im.width, im.height));
        const c = document.createElement("canvas");
        c.width = Math.round(im.width * sc);
        c.height = Math.round(im.height * sc);
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        resolve(c.toDataURL("image/jpeg", 0.82));
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

/* "🧈 French butter" → ["🧈","French butter"]; falls back to a bullet */
export function parseIngredients(text) {
  return String(text || "").split("\n").map(l => l.trim()).filter(Boolean).map(l => {
    const m = l.match(/^(\S+)\s+(.*)$/);
    return m && /\p{Extended_Pictographic}/u.test(m[1]) ? [m[1], m[2]] : ["•", l];
  });
}

/* one label per typed line, blanks kept so a translated list lines up with the English one */
export const ingredientLines = text =>
  String(text || "").split("\n").map(l => parseIngredients(l)[0]?.[1] || "");
