import { useEffect } from "react";
import { createPortal } from "react-dom";
import { fullPic } from "../data/photos.js";
import Ico from "../lib/icons.jsx";

/* Full, uncropped photo. Portalled to body because dish cards sit inside
   overflow:hidden frames that would clip an absolutely positioned sheet. */
export default function Lightbox({ photos = [], index = 0, name, onIndex, onClose }) {
  const n = photos.length;

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = e => {
      if (e.key === "Escape") { e.stopImmediatePropagation(); onClose(); }
      else if (n > 1 && e.key === "ArrowRight") onIndex((index + 1) % n);
      else if (n > 1 && e.key === "ArrowLeft") onIndex((index - 1 + n) % n);
    };
    addEventListener("keydown", onKey, true);
    return () => {
      removeEventListener("keydown", onKey, true);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, n, onIndex, onClose]);

  const jump = i => e => { e.stopPropagation(); onIndex(i); };
  /* portalled nodes still bubble through the React tree - without this the
     gallery's own click handler re-opens the sheet the moment it closes */
  const close = e => { e.stopPropagation(); onClose(); };

  return createPortal(
    <div className="lb" role="dialog" aria-modal="true" aria-label={`${name} - full photo`} onClick={close}>
      <figure className="lb__stage" onClick={e => e.stopPropagation()}>
        <img className="lb__img" src={fullPic(photos[index])}
             alt={index === 0 ? name : `${name} - angle ${index + 1}`} />
        <figcaption className="lb__cap">
          <b>{name}</b>
          <span>{n > 1 ? `angle ${index + 1} of ${n}` : "full photo"}</span>
        </figcaption>
      </figure>

      <button className="lb__x" onClick={close} aria-label="Close the photo"><Ico name="close" /></button>

      {n > 1 && (
        <>
          <button className="pg__nav lb__nav lb__nav--prev" onClick={jump((index - 1 + n) % n)}
                  aria-label={`Previous photo of ${name}`}><Ico name="chevronL" /></button>
          <button className="pg__nav lb__nav lb__nav--next" onClick={jump((index + 1) % n)}
                  aria-label={`Next photo of ${name}`}><Ico name="chevronR" /></button>
          <div className="pg__dots lb__dots">
            {photos.map((_, i) => (
              <button key={i} className={`pg__dot${i === index ? " is-on" : ""}`}
                      onClick={jump(i)} aria-label={`Show photo ${i + 1} of ${n}`} />
            ))}
          </div>
        </>
      )}
    </div>,
    document.body
  );
}
